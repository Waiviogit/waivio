import { Checkbox } from 'antd';
import { FormattedMessage } from 'react-intl';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setShowRewards } from '../../../store/walletStore/walletActions';

const ShowRewardsButton = () => {
  useEffect(
    () => () => {
      setShowRewards(false);
    },
    [],
  );

  const dispatch = useDispatch();
  const handleCheck = e => dispatch(setShowRewards(e.target.checked));

  return (
    <div className="WAIVwallet__showWrap">
      <Checkbox onChange={handleCheck} />
      <FormattedMessage
        id={'show_author_curator'}
        defaultMessage={'Show author and curators rewards'}
      />
    </div>
  );
};

export default ShowRewardsButton;
