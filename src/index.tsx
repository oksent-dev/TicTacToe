import ReactDOM from 'react-dom/client';
import React, { useState } from 'react';
import './index.css';


interface SquareProps {
    value: 'X' | 'O' | null;
    onClick: () => void;
    isWinningSquare: boolean;
}

function Square(props: SquareProps) {
    return (
      <button className={`w-28 h-28 sm:w-32 sm:h-32 text-4xl dark:bg-gray-700 ${props.isWinningSquare ? 'text-green-500' : 'text-black dark:text-white'}
       bg-gray-200 border-2 border-black font-bold text-2xl`} 
       onClick={props.onClick}>
        {props.value}
      </button>
    );
}

interface BoardProps {
    squares: Array<'X' | 'O' | null>;
    onClick: (i: number) => void;
    winningLine: number[];
}

function Board({ squares, onClick, winningLine }: BoardProps) {
    const renderSquare = (i: number) => {
        return (
            <Square
                key={i}
                value={squares[i]}
                onClick={() => onClick(i)}
                isWinningSquare={winningLine.includes(i)}
            />
        );
    };

    const renderRow = (i: number) => {
        const row: Array<React.JSX.Element> = [];
        for (let j = 0; j < 3; j++) {
            row.push(renderSquare(i * 3 + j));
        }
        return <div key={i} className='flex flex-row flex-nowrap'>{row}</div>
    };

    const boardSize = 3;
    const board: Array<React.JSX.Element> = [];
    for (let i = 0; i < boardSize; i++) {
        board.push(renderRow(i));
    }
    return <div className='flex flex-col flex-nowrap'>{board}</div>;
}

interface History {
    squares: Array<'X' | 'O' | null>;
    location?: number;
}

function Game() {
    const [dark, setDark] = useState(false);
    const darkModeHandler = () => {
        setDark(!dark);
        document.body.classList.toggle("dark");
      }
    function calculateWinner(squares: Array<'X' | 'O' | null>) {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner: squares[a], line: lines[i]};
          }
        }
        return {winner: null, line: []};
    }
    
    const [history, setHistory] = useState<History[]>([{ squares: Array(9).fill(null) }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);

    const handleClick = (i: number) => {
        const historySlice = history.slice(0, stepNumber + 1);
        const current = historySlice[historySlice.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? 'X' : 'O';
        setHistory(historySlice.concat([{
            squares: squares,
            location: i,
        }]));
        setStepNumber(historySlice.length);
        setXIsNext(!xIsNext);
    };

    const jumpTo = (step: number) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    };

    const historyState = history;
    const current = historyState[stepNumber];
    const calculatedWinner = calculateWinner(current.squares);
    const winner = calculatedWinner.winner;
    const winningLine = calculatedWinner.line;

    const moves = historyState.map((step, move) => {
        const desc = move ?
            '#' + move + ' ' + (move % 2 === 0 ? 'O' : 'X') + ' - (' + Math.floor(step.location! / 3) + ',' + step.location! % 3 + ')' :
            'Go to game start';
        return (
            <li key={move}>
                <button className={`p-3 border-2 text-base rounded-lg border-black bg-gray-50 dark:bg-gray-600 my-1 ${move === stepNumber ? 'font-bold' : ''}`}
                    onClick={() => jumpTo(move)}
                >
                    {desc}
                </button>
            </li>
        );
    });
    let status: string;
    if (winner) {
        status = 'Winner: ' + winner;
    } else if (current.squares.every(square => square)) {
        status = 'Draw';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
    return (
        <div className={`font-mono flex flex-col bg-white text-black dark:bg-slate-900 dark:text-white items-center w-full h-screen`}>
            <button onClick={darkModeHandler} className="p-2 text-xl">
                { dark ? 'Light Mode' : 'Dark Mode' }
            </button>
            <h1 className='text-5xl mb-6 border-b border-black dark:border-white'>Tic Tac Toe</h1>
            <div>
                <div className="flex justify-center flex-row flex-wrap gap-6">
                    <div>
                        <Board 
                        squares={current.squares}
                        onClick={(i) => handleClick(i)}
                        winningLine={winningLine}
                        />
                    </div>
                    <div>
                        <div className={`font-bold ${(status.includes('Winner') || status === 'Draw') ? 'animate-bounce text-2xl' : 'text-xl'}`}>{status}</div>
                        <ul>{moves}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
}



const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
        <Game />
);
  