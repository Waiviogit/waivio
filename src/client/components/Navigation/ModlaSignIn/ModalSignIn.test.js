import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import ModalSignIn from './ModalSignIn';

describe('(Component) ModalSignIn', () => {
  describe('with default prop values', () => {
    it('renders and matches snapshot', () => {
      const wrapper = shallow(
        <IntlProvider locale="en">
          <ModalSignIn />
        </IntlProvider>,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
});
