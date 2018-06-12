import React, { Fragment } from 'react';
import '../styles/GameContainer.css';
import Square from './Square';
import { getPlayers, updatePlayer, createPlayer } from '../services/playerService';

class GameContainer extends React.Component {
  static defaultProps = {
    onNewGame: () => {},
  }

  state = {
    hasDrawEndGame: false,
    hasWinner: false,
    isPlayerOneTurn: true,
    selectionsArr: Array(9).fill(''),
    winningIndexes: [],
  }

  squareClicked = (index) => {
    const {
      hasDrawEndGame,
      hasWinner,
      isPlayerOneTurn,
      selectionsArr,
    } = this.state;

    if (selectionsArr[index] || hasWinner || hasDrawEndGame) return;

    const selectionsArrCopy = selectionsArr.slice();
    selectionsArrCopy[index] = isPlayerOneTurn ? 'X' : 'O';

    if (!this.checkGameOver(selectionsArrCopy)) {
      this.setState(state => ({
        isPlayerOneTurn: !state.isPlayerOneTurn,
        selectionsArr: selectionsArrCopy,
      }));
    }
  }

  checkGameOver = (boardArray) => {
    const winningIndexes = this.checkWinner(boardArray);

    if (winningIndexes) {
      this.setState({
        hasWinner: true,
        selectionsArr: boardArray,
        winningIndexes,
      }, this.reportWinner);
      return true;
    } else if (boardArray.filter(square => square !== '').length === 9) {
      this.setState({
        hasDrawEndGame: true,
        selectionsArr: boardArray,
      }, this.reportDraw);
      return true;
    }
    return false;
  }


  checkWinner = (boardArray) => {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningLines.length; i += 1) {
      const [a, b, c] = winningLines[i];
      if (boardArray[a] &&
        boardArray[a] === boardArray[b] &&
        boardArray[a] === boardArray[c]) {
        return winningLines[i];
      }
    }
    return false;
  }

  reportWinner = async () => {
    const { playerOneName, playerTwoName } = this.props;
    const winningPlayerName = this.state.isPlayerOneTurn ? playerOneName : playerTwoName;
    const [userRecord] = await getPlayers({}, `username=${winningPlayerName}`);

    if (userRecord) {
      userRecord.games.win += 1;
      updatePlayer(userRecord);
    } else {
      createPlayer({
        username: winningPlayerName,
        games: {
          win: 1,
          loss: 0,
          draw: 0,
        },
      });
    }
  }

  reportDraw = async () => {
    const { playerOneName, playerTwoName } = this.props;

    // NOTE: we could do a Promise.all, but debatable if we want the all fail behavior.
    const [playerOneRecord] = await getPlayers({}, `username=${playerOneName}`);
    const [playerTwoRecord] = await getPlayers({}, `username=${playerTwoName}`);

    [playerOneRecord, playerTwoRecord].forEach((playerRecord, i) => {
      if (playerRecord) {
        // creating deep copy since Airbnb eslint prevents mutation of params.
        const recordCopy = {
          ...playerRecord,
          games: {
            ...playerRecord.games,
            draw: playerRecord.games.draw + 1,
          },
        };
        updatePlayer(recordCopy);
      } else {
        createPlayer({
          username: i === 0 ? playerOneName : playerTwoName,
          games: {
            win: 0,
            loss: 0,
            draw: 1,
          },
        });
      }
    });
  }

  makeSquare = index => (
    <Square
      className={this.state.winningIndexes.includes(index) ? 'winnerSpace' : ''}
      value={this.state.selectionsArr[index]}
      onClick={() => this.squareClicked(index)}
    />
  );

  resetGame = () => {
    this.setState({
      hasDrawEndGame: false,
      hasWinner: false,
      isPlayerOneTurn: true,
      selectionsArr: Array(9).fill(''),
      winningIndexes: [],
    });
  }

  render() {
    const {
      hasDrawEndGame,
      hasWinner,
      isPlayerOneTurn,
    } = this.state;

    const {
      playerOneName,
      playerTwoName,
      onNewGame,
    } = this.props;

    return (
      <div className="game-container">
        {!hasDrawEndGame && !hasWinner &&
          <div className="player-turn-indicator">
            {isPlayerOneTurn && <h1 className="player-one-indicator">{`${playerOneName}'s turn (X)`}</h1>}
            {!isPlayerOneTurn && <h1 className="player-two-indicator">{`${playerTwoName}'s turn (O)`}</h1>}
          </div>
        }
        {this.state.hasDrawEndGame && <h1 className="game-end-indicator">Draw Game!</h1>}
        {this.state.hasWinner && <h1 className="game-end-indicator"><span>{`${isPlayerOneTurn ? playerOneName : playerTwoName}`}</span> won the game!</h1>}
        <div className="row">
          {this.makeSquare(0)}
          {this.makeSquare(1)}
          {this.makeSquare(2)}
        </div>
        <div className="row">
          {this.makeSquare(3)}
          {this.makeSquare(4)}
          {this.makeSquare(5)}
        </div>
        <div className="row">
          {this.makeSquare(6)}
          {this.makeSquare(7)}
          {this.makeSquare(8)}
        </div>
        {(hasDrawEndGame || hasWinner) &&
          <Fragment>
            <button className="button-base small" onClick={this.resetGame}>Another Round?</button>
            <button className="button-base small outline" onClick={onNewGame}>New Game?</button>
          </Fragment>
        }
      </div>
    );
  }
}

export default GameContainer;
