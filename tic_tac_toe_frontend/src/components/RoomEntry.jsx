import React, { useEffect, useState } from "react";
import { Api } from "../lib/api";

// PUBLIC_INTERFACE
export default function RoomEntry({ onEnter }) {
  /** RoomEntry handles create/join flows and localStorage persistence */
  const [code, setCode] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Initialize from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("ttt_player_id");
    const storedName = localStorage.getItem("ttt_player_name");
    const storedRoom = localStorage.getItem("ttt_room_code");
    if (storedId) setPlayerId(storedId);
    if (storedName) setName(storedName);
    if (storedRoom) setCode(storedRoom);
    if (!storedId) {
      const newId = cryptoRandomId();
      setPlayerId(newId);
      localStorage.setItem("ttt_player_id", newId);
    }
  }, []);

  const cryptoRandomId = () => {
    try {
      const arr = new Uint8Array(16);
      window.crypto.getRandomValues(arr);
      return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
  };

  const persist = (room) => {
    localStorage.setItem("ttt_player_id", playerId);
    localStorage.setItem("ttt_player_name", name || "");
    if (room) localStorage.setItem("ttt_room_code", room);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (!code) return setError("Please enter a room code");
    setBusy(true);
    try {
      const res = await Api.createRoom({ code, player_id: playerId });
      persist(code);
      onEnter?.({ code: res.code || code, playerId, role: "X" });
    } catch (err) {
      setError(err.message || "Unable to create room");
    } finally {
      setBusy(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");
    if (!code) return setError("Please enter a room code");
    setBusy(true);
    try {
      const res = await Api.joinRoom({ code, player_id: playerId });
      persist(code);
      // Determine role based on response
      let role = "O";
      if (res?.player_x === playerId) role = "X";
      if (res?.player_o === playerId) role = "O";
      onEnter?.({ code: res.code || code, playerId, role });
    } catch (err) {
      setError(err.message || "Unable to join room");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel">
      <h1 className="title">Tic Tac Toe</h1>
      <p className="subtitle">Create or Join a Room</p>

      <form className="form-grid" onSubmit={handleJoin}>
        <div className="form-row">
          <label htmlFor="room">Room Code</label>
          <input
            id="room"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g., ALPHA1"
            autoComplete="off"
          />
        </div>

        <div className="form-row">
          <label htmlFor="name">Your Name (optional)</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Alex"
            autoComplete="name"
          />
        </div>

        <div className="actions">
          <button className="btn primary" onClick={handleCreate} disabled={busy}>
            {busy ? "Creating..." : "Create Room"}
          </button>
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Joining..." : "Join Room"}
          </button>
        </div>

        {error ? <div className="error">{error}</div> : null}
      </form>
      <p className="hint">Your player ID is stored locally for continuity.</p>
    </div>
  );
}
