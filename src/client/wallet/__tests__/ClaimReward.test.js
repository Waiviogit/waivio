import React from 'react';
import { shallow } from 'enzyme';
import ClaimReward from '../ClaimReward';

describe('(Component) ClaimReward', () => {
  describe('with default prop values', () => {
    it('renders and matches snapshot', () => {
      const props = {
        timestamp: '0',
        rewardSteem: '0 HIVE',
        rewardSbd: '0 HBD',
        rewardVests: '0 HP',
        totalVestingShares: '0',
        totalVestingFundSteem: '0',
      };
      const wrapper = shallow(<ClaimReward {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
