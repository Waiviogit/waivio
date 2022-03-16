import { Checkbox } from 'antd';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShowRewards } from '../../../store/walletStore/walletActions';
import { getShowRewards } from '../../../store/walletStore/walletSelectors';

const ShowRewardsButton = () => {
  const dispatch = useDispatch();
  const check = useSelector(getShowRewards);
  const handleCheck = e => dispatch(setShowRewards(e.target.checked));

  return (
    <div className="WAIVwallet__showWrap">
      <Checkbox onChange={handleCheck} checked={check} />
      <FormattedMessage
        id={'show_author_curator'}
        defaultMessage={'Show author and curators rewards'}
      />
    </div>
  );
};

export default ShowRewardsButton;
