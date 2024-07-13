import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Header() {
    return (
        <header>
            <h1>Tic Tac Toe</h1>
        </header>
    );
}
function Square(props) {
    return (
      <button className={`square ${props.isWinningSquare ? 'winning' : ''}`} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

class Board extends React.Component {
    renderSquare(i) {
        return <Square
          key={i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          isWinningSquare={this.props.winningLine.includes(i)}
        />;
    }
    renderRow(i) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            row.push(this.renderSquare(i * 3 + j));
        }
        return <div key={i} className="board-row">{row}</div>
    }
    render() {
        const boardSize = 3;
        const board = [];
        for (let i = 0; i < boardSize; i++) {
            board.push(this.renderRow(i));
        }
        return <div>{board}</div>;
    }
}

function calculateWinner(squares) {
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

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber:0,
            xIsNext: true,
        }
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const calculatedWinner = calculateWinner(current.squares);
        const winner = calculatedWinner.winner;
        const winningLine = calculatedWinner.line;

        const moves = history.map((step, move) => {
            const desc = move ?
                '#' + move + ' ' + (move % 2 === 0 ? 'O' : 'X') + ' - (' + Math.floor(step.location / 3) + ',' + step.location % 3 + ')' :
                'Go to game start';
            return (
                <li key={move}>
                    <button className='move-button'
                      onClick={() => this.jumpTo(move)}
                      style={move === this.state.stepNumber ? {fontWeight: 'bolder'} : {}}
                    >
                        {desc}
                    </button>
                </li>
            )
        });
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (current.squares.every(square => square)) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
        <div className="game">
            <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              winningLine={winningLine}
            />
            </div>
            <div className="game-info">
            <div className="game-status">{status}</div>
            <ul>{moves}</ul>
            </div>
        </div>
        );
    }
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Header />
    <Game />    
  </>
);