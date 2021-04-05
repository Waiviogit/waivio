import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import formatter from '../../helpers/steemitFormatter';
import ReputationTag from '../ReputationTag';

describe('<ReputationTag />', () => {
  const intlProvider = new IntlProvider({ locale: 'en' }, {});
  const { intl } = intlProvider.getChildContext();
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      intl,
      reputation: 1,
    };

    wrapper = mount(
      <IntlProvider locale="en">
        <ReputationTag {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('Should have Remove from favorites title with isFavorited true prop', () => {
    const formatted = Math.floor(formatter.reputationFloat(props.reputation)).toString();
    const Tag = wrapper.find('Tag');

    expect(Tag.text()).toBe(formatted);
  });
});
