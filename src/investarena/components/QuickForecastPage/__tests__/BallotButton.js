import React from 'react';
import { shallow } from 'enzyme';

import BallotButton from '../BallotButton';

describe('<BallotButton />', () => {
  const props = {
    onClickCB: jest.fn(),
    positiveText: 'Yes',
    negativeText: 'No',
  };
  const wrapper = shallow(<BallotButton {...props} />);

  it('renders without exploding', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('when i click in button "yes" onClicl CB has been called', () => {
    wrapper.find('.ballotButton__positive').simulate('click');
    expect(props.onClickCB).toHaveBeenCalled()
  });

  it('when i click in button "no" onClicl CB has been called', () => {
    wrapper.find('.toHaveBeenCalled').simulate('click');
    expect(props.onClickCB).toHaveBeenCalled()
  });
});


