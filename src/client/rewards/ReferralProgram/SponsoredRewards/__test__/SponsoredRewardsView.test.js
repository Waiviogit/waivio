import React from 'react';
import { IntlProvider } from 'react-intl';
import { shallow } from 'enzyme';
import SponsoredRewardsView from '../SponsoredRewardsView';
import * as mock from '../__mock__/mockData';

jest.mock('../SponsoredRewardsTableRow/SponsoredRewardsTableRow');

describe('SponsoredRewardsView', () => {
  let wrapper;
  const intl = mock.mockIntl;
  const statusSponsoredHistory = mock.sponsor;
  const sponsoredRewardsTitle = mock.rewardsTitle;

  beforeEach(() => {
    wrapper = shallow(
      <IntlProvider locale="en">
        {SponsoredRewardsView(intl, statusSponsoredHistory, sponsoredRewardsTitle)}
      </IntlProvider>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it("should create SponsoredRewardsView's snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
