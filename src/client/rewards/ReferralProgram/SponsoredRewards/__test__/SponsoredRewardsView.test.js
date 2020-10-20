import React from 'react';
import { IntlProvider } from 'react-intl';
import { shallow } from 'enzyme';
import * as mock from '../__mock__/mockData';
import SponsoredRewardsView from '../SponsoredRewardsView';

jest.mock('../SponsoredRewardsTableRow/SponsoredRewardsTableRow');

describe('SponsoredRewardsView', () => {
  let wrapper;
  const intl = mock.mockIntl;
  const statusSponsoredHistory = mock.sponsor;
  const sponsoredRewardsTitle = mock.rewardsTitle;

  beforeEach(() => {
    wrapper = shallow(
      <IntlProvider locale="en">
        <SponsoredRewardsView
          intl={intl}
          statusSponsoredHistory={statusSponsoredHistory}
          sponsoredRewardsTitle={sponsoredRewardsTitle}
        />
      </IntlProvider>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it("should create SponsoredRewardsView's snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
