import React from "react";

// PUBLIC_INTERFACE
export default function StatusBar({ status, nextTurn, winner, youAre }) {
  /** Displays current game status and your role */
  let message = "";
  if (winner) {
    message = winner === "DRAW" ? "It's a draw." : `Winner: ${winner}`;
  } else if (status) {
    if (status.toLowerCase().includes("waiting")) {
      message = "Waiting for opponent...";
    } else {
      message = nextTurn ? `Turn: ${nextTurn}` : status;
    }
  }

  return (
    <div className="status-bar" role="status" aria-live="polite">
      <div className="left">
        <span className="badge">You are: {youAre || "-"}</span>
      </div>
      <div className="center">
        <span className={`status ${winner ? (winner === "DRAW" ? "neutral" : "success") : ""}`}>
          {message || "Ready"}
        </span>
      </div>
      <div className="right"></div>
    </div>
  );
}
