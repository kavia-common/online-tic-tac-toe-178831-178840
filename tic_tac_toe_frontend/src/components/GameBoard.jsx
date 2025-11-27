import React from "react";

// PUBLIC_INTERFACE
export default function GameBoard({ board, disabled, onCellClick }) {
  /** Renders a 3x3 tic tac toe board and handles clicks */
  const cells = normalizeBoard(board);

  return (
    <div className={`board ${disabled ? "disabled" : ""}`} role="grid" aria-label="Game Board">
      {cells.map((cell, idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        return (
          <button
            key={idx}
            className={`cell ${cell === "X" ? "x" : cell === "O" ? "o" : ""}`}
            onClick={() => !disabled && onCellClick?.(row, col)}
            aria-label={`Row ${row + 1} Column ${col + 1}${cell ? ` ${cell}` : ""}`}
            disabled={disabled || !!cell}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
}

function normalizeBoard(board) {
  if (!board) return Array(9).fill("");
  if (Array.isArray(board)) {
    // flatten
    const out = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) out.push(board[r][c] || "");
    return out;
  }
  if (typeof board === "string") {
    const s = board.padEnd(9, " ");
    return s.split("").slice(0, 9).map((ch) => (ch === "X" || ch === "O" ? ch : ""));
  }
  return Array(9).fill("");
}
