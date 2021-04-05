import React from 'react';
import { IntlProvider } from 'react-intl';
import { shallow } from 'enzyme';
import SponsoredRewardsTableRowView from '../SponsoredRewardsTableRowView';
import * as mock from '../__mock__/mockData';

describe('SponsoredRewardsTableRowView', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <IntlProvider locale="en">
        {SponsoredRewardsTableRowView(
          mock.data,
          mock.sponsorInfo,
          mock.dataReview,
          mock.userWeight,
          mock.sponsor,
          mock.isModalReportOpen,
          mock.closeModalReport,
          mock.currentAmount,
          mock.currentBalance,
        )}
      </IntlProvider>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it("should create SponsoredRewardsTableRowView's snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
