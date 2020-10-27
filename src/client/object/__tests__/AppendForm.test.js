import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import AppendForm from '../AppendModal/AppendForm';

describe('(Component) AppendForm', () => {
  it('renders and matches snapshot', () => {
    const props = {
      defaultVotePercent: 20,
    };
    const wrapper = shallow(
      <IntlProvider>
        <AppendForm {...props} />
      </IntlProvider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
