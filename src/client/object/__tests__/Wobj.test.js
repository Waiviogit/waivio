import React from 'react';
import { shallow } from 'enzyme';
import Wobj from '../Wobj';

describe('(Component) Wobj', () => {
  describe('with default prop values', () => {
    it('renders and matches snapshot', () => {
      const props = {
        resetGallery: () => {},
        route: {},
        getObject: () => {},
        history: {},
        match: {},
        authenticated: false,
      };
      const wrapper = shallow(<Wobj {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
