import React from 'react';
import GameContainer from '../../src/components/GameContainer';
import Square from '../../src/components/Square';
import { shallow } from 'enzyme';

describe('GameContainer', () => {
  it('makeSquare() returns a Square Component', () => {
    const wrapper = shallow(<GameContainer />);
    const result = shallow(wrapper.instance().makeSquare(0));
    expect(result.is('.square')).to.equal(true);
  });

  it('Displays 9 Square components after names have been entered and hides form', () => {
    const wrapper = shallow(<GameContainer />);
    wrapper.setState({showNameForm: false})
    expect(wrapper.find(Square).length).to.equal(9);
    expect(wrapper.find('form').length).to.equal(0);
  });


  it('checkWinner() returns false if there is not a winning combination', () => {
    const wrapper = shallow(<GameContainer />);
    const result = wrapper.instance().checkWinner(['X','X','O', 'O', 'O', 'X', 'X', 'O', 'O'])
    expect(result).to.be.false;
  });

  it('checkWinner() returns array of winning indexes if there is a winning combination', () => {
    const wrapper = shallow(<GameContainer />);
    let result = wrapper.instance().checkWinner(['X','X','X', 'O', 'O', 'X', 'X', 'O', 'O']);
    expect(result).to.eql([0,1,2]);

    // test diagonals
    result = wrapper.instance().checkWinner(['X','X','O', 'O', 'O', 'X', 'O', 'O', 'X']);
    expect(result).to.eql([2,4,6]);
  });

  it('checkGameOver() sets hasWinner in state to true if a player move won the game', () => {
    const wrapper = shallow(<GameContainer />);
    let result = wrapper.instance().checkGameOver(['X','X','X', 'O', 'O', 'X', 'X', 'O', 'O']);
    expect(wrapper.instance().state.hasWinner).to.be.true;
    expect(wrapper.instance().state.hasDrawEndGame).to.be.false;
  });

  it('checkGameOver() sets hasDrawEndGame in state to true if board is filled without a winner', () => {
    const wrapper = shallow(<GameContainer />);
    let result = wrapper.instance().checkGameOver(['X','O','X', 'O', 'X', 'X', 'O', 'X', 'O']);
    expect(wrapper.instance().state.hasWinner).to.be.false;
    expect(wrapper.instance().state.hasDrawEndGame).to.be.true;
  });

});
