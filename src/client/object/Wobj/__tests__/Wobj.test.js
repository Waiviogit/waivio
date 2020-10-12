import React from 'react';
import { shallow } from 'enzyme';
import WobjectContainer from '../WobjectContainer';

describe('(Component) WobjectContainer', () => {
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
      const wrapper = shallow(<WobjectContainer {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
