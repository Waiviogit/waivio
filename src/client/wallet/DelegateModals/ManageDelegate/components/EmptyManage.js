import React from 'react';
import { useDispatch } from 'react-redux';
import { openPowerUpOrDown } from '../../../../../store/walletStore/walletActions';

import './EmptyManage.less';

const EmptyManage = () => {
  const dispatch = useDispatch();
  const handlePowerDown = () => dispatch(openPowerUpOrDown());

  return (
    <div className="EmptyManage">
      You don&apos;t have any staked token yet. Make{' '}
      <span className="EmptyManage__button" onClick={handlePowerDown}>
        Power up
      </span>{' '}
      to continue.
    </div>
  );
};

export default EmptyManage;
