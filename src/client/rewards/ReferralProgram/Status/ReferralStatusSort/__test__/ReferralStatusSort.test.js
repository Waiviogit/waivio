import React from 'react';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { mount } from 'enzyme';
import ReferralStatusSort from '../ReferralStatusSort';
import { mockData } from '../__mock__/mockData';

describe('ReferralStatusSort', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = mockData;
    wrapper = mount(
      <BrowserRouter>
        <IntlProvider locale="en">
          <Route path="/rewards/referral-status/vallon" component={ReferralStatusSort(props)} />
        </IntlProvider>
      </BrowserRouter>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it("should create ReferralStatusSort's snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
