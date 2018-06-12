import React from 'react';
import { hot } from 'react-hot-loader';
import BadgeImg from '../images/badge.svg';
import GameContainer from './GameContainer';
import Leaderboard from './Leaderboard';

class App extends React.Component {
  state = {
    showLeaderBoard: false,
    playerOneName: '',
    playerTwoName: '',
    showNameForm: true,
    showGame: false,
  }

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  saveNames = () => {
    this.setState({
      showNameForm: false,
      showGame: true,
    });
  }

  handleNewGame = () => {
    this.setState({
      showNameForm: true,
      showGame: false,
    });
  }

  toggleLeaderBoard = () => {
    this.setState(state => ({
      showLeaderBoard: !state.showLeaderBoard,
    }));
  }

  render() {
    const {
      showLeaderBoard,
      playerOneName,
      playerTwoName,
      showNameForm,
      showGame,
    } = this.state;

    return (
      <div className="App">
        <h1 className="App-header">Tic. Tac. Toe.</h1>
        {!showLeaderBoard &&
          <button className="button-base sticky" onClick={this.toggleLeaderBoard}>
            <img src={BadgeImg} alt="winner badge" />
          </button>}
        {showNameForm &&
          <form className="showNameForm">
            <label htmlFor="playerOneName" >Player One Name:
              <input type="text" name="playerOneName" onChange={this.onInputChange} value={playerOneName} />
            </label>
            <label htmlFor="playerTwoName">Player Two Name:
              <input type="text" name="playerTwoName" onChange={this.onInputChange} value={playerTwoName} />
            </label>
            <input type="button" className="button-base small" onClick={this.saveNames} disabled={!playerOneName || !playerTwoName} value="Let's Play" />
          </form>
        }
        {showGame &&
          <GameContainer
            playerOneName={playerOneName}
            playerTwoName={playerTwoName}
            onNewGame={this.handleNewGame}
          />
        }
        {showLeaderBoard && <Leaderboard onClose={this.toggleLeaderBoard} />}
      </div>
    );
  }
}

export default hot(module)(App);
