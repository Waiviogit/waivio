import React from 'react';
import { shallow } from 'enzyme';

import { CreateWebsite } from '../CreateWebsite';

describe('<CreateWebsite />', () => {
  const props = {
    intl: { formatMessage: jest.fn() },
    form: {
      validateFieldsAndScroll: jest.fn(),
      getFieldValue: jest.fn(),
      getFieldDecorator: jest.fn(() => c => c),
    },
    getDomainList: () => {},
    parentDomain: [],
    checkStatusAvailableDomain: jest.fn(),
    availableStatus: { intl: { defaultMessage: 'Available', id: 'available' }, status: 200 },
    createWebsite: jest.fn(),
    loading: false,
  };

  const wrapper = shallow(<CreateWebsite {...props} />);

  it('renders without exploding', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('form submit', () => {
    wrapper.find('#CreateWebsite').simulate('submit', { preventDefault: jest.fn() });
    expect(props.form.validateFieldsAndScroll).toHaveBeenCalled();
  });
});
