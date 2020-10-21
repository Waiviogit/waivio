import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';

import UserCardView from '../UserCardView';

describe('<UserCardView />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      user: {
        name: 'testUser',
      },
    };

    wrapper = shallow(
      <IntlProvider locale="en">
        <UserCardView {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });
  });

  it('should render without exploding', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
