import React from "react";

// PUBLIC_INTERFACE
export default function HistoryPanel({ moves }) {
  /** Renders the move history list. moves: [{row,col,player,timestamp?}] */
  if (!Array.isArray(moves) || moves.length === 0) {
    return (
      <div className="history">
        <h3>History</h3>
        <div className="empty">No moves yet.</div>
      </div>
    );
  }

  return (
    <div className="history">
      <h3>History</h3>
      <ol>
        {moves.map((m, i) => (
          <li key={i}>
            <span className={`tag ${m.player === "X" ? "x" : "o"}`}>{m.player}</span>
            Move {i + 1}: Row {m.row + 1}, Col {m.col + 1}
            {m.timestamp ? <span className="time"> • {new Date(m.timestamp).toLocaleTimeString()}</span> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
