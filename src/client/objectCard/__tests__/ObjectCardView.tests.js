import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import ObjectCardView from '../ObjectCardView';

describe('(Component) ObjectCardViewwith default props', () => {
  it('renders and matches snapshot', () => {
    const wrapper = shallow(
      <IntlProvider locale="en">
        <ObjectCardView />
      </IntlProvider>,
    );

    expect(wrapper).toMatchSnapshot();
  });
});
