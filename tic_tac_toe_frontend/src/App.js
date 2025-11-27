import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import "./index.css";
import RoomEntry from "./components/RoomEntry";
import GameBoard from "./components/GameBoard";
import StatusBar from "./components/StatusBar";
import HistoryPanel from "./components/HistoryPanel";
import { Api } from "./lib/api";
import { subscribeToState } from "./lib/realtime";

// PUBLIC_INTERFACE
function App() {
  /**
   * Main App orchestrates:
   * - Theme (Executive Gray style)
   * - Room lifecycle (create/join)
   * - Realtime state updates via polling/SSE
   * - Move submission and reset
   * - Local storage of player_id and room code
   */
  const [theme, setTheme] = useState("light");
  const [session, setSession] = useState(() => {
    const code = localStorage.getItem("ttt_room_code") || "";
    const playerId = localStorage.getItem("ttt_player_id") || "";
    return code && playerId ? { code, playerId, role: undefined } : null;
  });

  // Game state
  const [state, setState] = useState({ board: "", next_turn: "", status: "", winner: null });
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Try to infer role if session exists by fetching room info
  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!session?.code || !session?.playerId) return;
      try {
        const info = await Api.getRoom(session.code);
        if (!alive) return;
        let role = session.role;
        if (!role) {
          if (info?.player_x === session.playerId) role = "X";
          else if (info?.player_o === session.playerId) role = "O";
        }
        setSession((s) => ({ ...(s || {}), code: session.code, playerId: session.playerId, role }));
      } catch (e) {
        // ignore
      }
    };
    load();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to updates when in a room
  useEffect(() => {
    if (!session?.code) return;
    let unsub = () => {};
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const s = await Api.getState(session.code);
        if (!cancelled) setState(s);
      } catch (e) {
        // ignore initial
      }
      try {
        const h = await Api.getHistory(session.code);
        if (!cancelled) setHistory(Array.isArray(h?.moves) ? h.moves : []);
      } catch (e) {
        // ignore
      }
    };
    bootstrap();

    unsub = subscribeToState({
      code: session.code,
      onMessage: (s) => setState(s),
      onError: () => {},
      intervalMs: 1200,
    });

    const interval = setInterval(async () => {
      try {
        const h = await Api.getHistory(session.code);
        setHistory(Array.isArray(h?.moves) ? h.moves : []);
      } catch {
        // ignore
      }
    }, 2000);

    return () => {
      unsub?.();
      clearInterval(interval);
      cancelled = true;
    };
  }, [session?.code]);

  const isYourTurn = useMemo(() => {
    if (!session?.role || !state?.next_turn) return false;
    return session.role === state.next_turn;
  }, [session?.role, state?.next_turn]);

  const handleEnter = useCallback(({ code, playerId, role }) => {
    setSession({ code, playerId, role });
    localStorage.setItem("ttt_room_code", code);
    localStorage.setItem("ttt_player_id", playerId);
  }, []);

  const handleCellClick = async (row, col) => {
    if (!session?.code || !session?.playerId) return;
    if (busy || state?.winner) return;
    if (!isYourTurn) return;
    try {
      setBusy(true);
      await Api.postMove(session.code, { row, col, player_id: session.playerId });
      // state will refresh via polling
    } catch (e) {
      setError(e.message || "Failed to submit move");
      setTimeout(() => setError(""), 2500);
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!session?.code) return;
    try {
      setBusy(true);
      await Api.reset(session.code);
    } catch (e) {
      setError(e.message || "Failed to reset");
      setTimeout(() => setError(""), 2500);
    } finally {
      setBusy(false);
    }
  };

  const handleLeave = () => {
    setSession(null);
    setState({ board: "", next_turn: "", status: "", winner: null });
    setHistory([]);
    // Keep player id, clear room
    localStorage.removeItem("ttt_room_code");
  };

  return (
    <div className="App">
      <header className="App-header executive-layout">
        <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {!session?.code ? (
          <RoomEntry onEnter={handleEnter} />
        ) : (
          <div className="game-shell">
            <div className="top">
              <StatusBar
                status={state?.status}
                nextTurn={state?.next_turn}
                winner={state?.winner}
                youAre={session?.role}
              />
              <div className="room-code">Room: <strong>{session.code}</strong></div>
            </div>

            <div className="board-wrap">
              <GameBoard
                board={state?.board}
                disabled={busy || !!state?.winner || !isYourTurn}
                onCellClick={handleCellClick}
              />
            </div>

            <div className="controls">
              <button className="btn" onClick={handleReset} disabled={busy}>
                Reset
              </button>
              <button className="btn danger" onClick={handleLeave} disabled={busy}>
                Leave Room
              </button>
            </div>

            <div className="panels">
              <HistoryPanel moves={history} />
            </div>

            {error ? <div className="error floating">{error}</div> : null}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
