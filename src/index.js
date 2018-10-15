import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Intro = () =>{
  return(
    <div>
      <h1>Tic-Tac-Toe</h1>
      <b>
        <i>A tutorial game from </i>
        <a href="https://reactjs.org/tutorial/tutorial.html"
        target="_blank">React.js</a>
        <i> completed by </i>
        <a href="https://github.com/JorgeJoseAbad"
        target="_blank">Jorge Abad</a>
      </b>
      <p>Completed with five sugested improvements</p>
      <ol>
        <li>Display the location for each move in the format (col, row)
          in the move history list.
        </li>
        <li>Bold the currently selected item in the move list.</li>
        <li>Rewrite Board to use two loops to make the squares instead of
          hardcoding them.
        </li>
        <li>When someone wins, highlight the three squares that caused the win.
        </li>
        <li>When no one wins, display a message about the
        result being a draw.</li>
      </ol>
      <h5>Of course, this is a directed tutorial...</h5>
      <div>But it is representative of many aspects of React that must
      be handled. No CSS added.</div>
      <br></br>

    </div>
  )
}


function Square (props){
    return (
      <button style={{color:props.color}}
        className="square"
        onClick={() => props.onClick()}
      >
        {props.value}
      </button>
    );
  }

class Board extends React.Component {

  renderSquare(i,color) {
    let myKey=i;
    return <Square
      key={myKey}
      color={color}
      value={this.props.squares[i]}
      onClick={()=>this.props.onClick(i)}
           />;
  }

  render() {
  	let boardcols = [];
  	let boardRows = [];

  	for(let i = 0; i <= 2; i++) {
      		boardRows = [];
      		for(let j = i*3+1; j <= i*3+3; j++) {
      			//boardRows.push(this.renderSquare(j-1)); original
            if (this.props.winnerArray){
               if (this.props.winnerArray[0][0]===j-1 ||
                   this.props.winnerArray[0][1]===j-1 ||
                   this.props.winnerArray[0][2]===j-1) {
                     boardRows.push(this.renderSquare(j-1,'red'))}
               else boardRows.push(this.renderSquare(j-1,'black'))
             }
            else boardRows.push(this.renderSquare(j-1,'black'))
      		}
      		boardcols.push(<div key={i} className="board-row">{boardRows}</div>);
    }

    return (
      <div>
        {boardcols}
      </div>
    );
  }
} /*End Board class*/

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      history: [{
        squares: Array(9).fill(null),
        col:'',
        row:''
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
     const history = this.state.history.slice(0, this.state.stepNumber + 1);
     const current = history[history.length - 1];
     const squares = current.squares.slice();
     if (calculateWinner(squares) || squares[i]) {
        return; /*squares[i] is true if is occupied by X or O*/
      }
     squares[i] = this.state.xIsNext ? 'X' : 'O';
     this.setState({
       history: history.concat([{
          squares: squares,
          col:i%3,
          row:Math.trunc(i/3)
        }]),
        stepNumber: history.length,
        xIsNext:!this.state.xIsNext
     });
}

jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let myWinnerArray=null; //to send array winner

    const moves = history.map((step, move) => {
      let n=step.col+3*step.row;
      const desc = move ?
        `Go to move #  ${move} ;
        col: ${step.col}; row: ${step.row};
        element selected: ${step.squares[n]}`
        :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
      myWinnerArray=winner.winnerArray;
    }
    else if (this.state.stepNumber===9&&winner==null) {
      alert("No one win!!!");
      status="No one win!!!!";
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <Intro />
        <div className="game">
          <div className="game-board">
            <Board
              winnerArray={myWinnerArray}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  /*lines: possibles combinations of squares to get "tree on line"*/
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

let winnerPack={
  winner:'',
  winnerArray:[]
}
for (let i = 0; i < lines.length; i++) {
  const [a, b, c] = lines[i];
  if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    winnerPack.winnerArray.push([a,b,c]);
    winnerPack.winner=squares[a];
    return winnerPack;
  }
}
return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
