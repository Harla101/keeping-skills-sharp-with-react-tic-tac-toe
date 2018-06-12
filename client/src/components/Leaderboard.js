import React from 'react';
import '../styles/Leaderboard.css';
import { getPlayers } from '../services/playerService';
import Trophy from '../images/trophy.svg';

class LeaderBoardContainer extends React.Component {
  state = {
    topTenPlayers: [],
    hasLoaded: false,
    hasErrored: false,
  }

  componentDidMount() {
    this.getTopPlayers();
  }

  getTopPlayers = async () => {
    const topTenPlayers = await getPlayers({ sort: 'games.win', order: 'desc', limit: '10' });
    this.setState({
      topTenPlayers,
      hasLoaded: true,
    });
  }

  render() {
    if (this.state.hasErrored) {
      return (
        <div className="leaderboard-container">
          <div className="leaderboard-content">
            <h1>Looks like we are having trouble getting the leaderboard. Check back soon. </h1>
          </div>
          <button className="button-base small" onClick={this.props.onClose}>Close</button>
        </div>
      );
    }

    if (!this.state.hasLoaded) {
      return (
        <div className="leaderboard-container">
          <div className="leaderboard-content">
            <h1>Loading Stats</h1>
          </div>
          <button className="button-base small" onClick={this.props.onClose}>Close</button>
        </div>
      );
    }
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-content">
          <img src={Trophy} alt="Winner Trophy Statue" />
          <h1>Leaderboard</h1>
          <h3>Top 10 Players</h3>
          <ol>
            {this.state.topTenPlayers.map(player => (
              <li key={player.username}>{player.username}: {player.games.win} wins</li>))
              }
          </ol>
          <button className="button-base small" onClick={this.props.onClose}>Close</button>
        </div>
      </div>
    );
  }
}

export default LeaderBoardContainer;
