import React from 'react';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mountWithIntl } from 'enzyme-react-intl';
import { act } from 'react-dom/test-utils';
import ReferralDetailsView from '../ReferralDetailsView';
import { mockData } from '../__mock__/mockData';

describe('ReferralDetailsView', () => {
  it("create detail's page snapshot", () => {
    const isAuthenticated = true;
    const wrapper = mountWithIntl(
      <BrowserRouter>
        <Route
          path="/rewards/referral-details/vallon"
          component={<ReferralDetailsView isAuthenticated={isAuthenticated} mockData={mockData} />}
        />
      </BrowserRouter>,
    );
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });
});
