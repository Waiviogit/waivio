import React from 'react';
import { IntlProvider } from 'react-intl';
import { shallow } from 'enzyme';
import * as mock from '../__mock__/mockData';
import NotificationClaimReward from '../NotificationClaimReward';

describe('NotificationCampaignReservation', () => {
  let wrapper;
  let notification;
  let read;
  const onClick = jest.fn();

  beforeEach(() => {
    notification = mock.CLAIM_REWARD;
    read = false;
    wrapper = shallow(
      <IntlProvider locale="en">
        <NotificationClaimReward notification={notification} read={read} onClick={onClick} />
      </IntlProvider>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should return create snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
