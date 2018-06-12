import React from 'react';
import Square from '../../src/components/Square';
import { shallow } from 'enzyme';

describe('Square', () => {
  it('Displays the value passed in via prop "value"', () => {
    const wrapper = shallow(<Square value="O"/>);
    expect(wrapper.contains('O')).to.equal(true);
  });

  it('Triggers the props onClick function when clicked', () => {
    let mockFunctionReturn = "should not be this string";
    const mockFunction = () => mockFunctionReturn = 'success';

    const wrapper = shallow(<Square onClick={mockFunction}/>);
    wrapper.find('button').simulate('click');

    expect(mockFunctionReturn).to.not.equal('should not be this string');
    expect(mockFunctionReturn).to.equal('success');
  });
});
