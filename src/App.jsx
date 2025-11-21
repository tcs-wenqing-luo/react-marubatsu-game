import { useState } from 'react';

function Square({value, onSquareClick}) {
  return(
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ currentPlayer, squares, onPlay}) {
   function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = currentPlayer;
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    status = "Draw";
  } else {
    status = "Next player: " + currentPlayer;
  }

  return (
  <>
    <div className="status">{status}</div>
    {Array(3)
      .fill(null)
      .map((_, rowIndex) => {
        const start = rowIndex * 3;
        const rowSquares = squares.slice(start, start + 3);

        return (
          <div className="board-row" key={rowIndex}>
            {rowSquares.map((value, colIndex) => {
              const idx = start + colIndex;
              return (
                <Square
                  key={idx}
                  value={value}
                  onSquareClick={() => handleClick(idx)}
                />
              );
            })}
          </div>
        );
      })}
  </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const currentPlayer = currentMove % 2 === 0 ? 'X' : 'O';
  const currentSquares = history[currentMove];
  
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

function jumpTo(nextMove) {
  setCurrentMove(nextMove);
}

const moves = history.map((squares, move) => {
  let description;
  if (move > 0) {
    description = 'Go to move #' + move;
  } else {
    description = 'Go to game start';
  }
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});

  return (
    <div className="game">
      <div className="game-board">
        <Board
        currentPlayer={currentPlayer}
        squares={currentSquares}
        onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}