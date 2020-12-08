import React from 'react';
import { IntlProvider } from 'react-intl';
import { shallow } from 'enzyme';
import * as mock from '../__mock__/mockData';
import NotificationCampaignReservation from '../NotificationCampaignReservation';

describe('NotificationCampaignReservation', () => {
  let wrapper;
  let notification;
  let read;
  const onClick = jest.fn();

  beforeEach(() => {
    notification = mock.NOTIFICATION_CAMPAIGN_RESERVATION;
    read = false;
    wrapper = shallow(
      <IntlProvider locale="en">
        <NotificationCampaignReservation
          notification={notification}
          read={read}
          onClick={onClick}
        />
      </IntlProvider>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should return create snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
