import React from 'react';
import { shallow } from 'enzyme';

import { ManageWebsite } from '../ManageWebsite';

describe('<ManageWebsite />', () => {
  const props = {
    intl: { formatMessage: jest.fn() },
    getManageInfo: jest.fn(),
    userName: '',
    manageInfo: {
      accountBalance: {},
      prices: {
        perUser: 0,
        minimumValue: 1,
      },
      websites: [{}],
      dataForPayments: {
        memo: '',
      },
    },
    activateWebsite: jest.fn(),
    suspendWebsite: jest.fn(),
    openTransfer: jest.fn(),
    deleteWebsite: jest.fn(),
  };

  const wrapper = shallow(<ManageWebsite {...props} />);

  it('renders without exploding with manageInfo', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders without exploding without manageInfo', () => {
    expect(shallow(<ManageWebsite {...props} manageInfo={{}} />)).toMatchSnapshot();
  });

  // it('handle click pay now button', () => {
  //   wrapper.find('.ManageWebsites__btn-pay').simulate('click');
  //   expect(props.openTransfer).toHaveBeenCalled();
  // });
});
