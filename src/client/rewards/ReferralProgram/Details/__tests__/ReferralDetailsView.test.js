import React from 'react';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
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
          component={ReferralDetailsView(isAuthenticated, mockData)}
        />
      </BrowserRouter>,
    );
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });
});
