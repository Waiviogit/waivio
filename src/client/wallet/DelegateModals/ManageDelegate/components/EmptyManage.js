import React from 'react';
import { useDispatch } from 'react-redux';
import PropsType from 'prop-types';

import { openPowerUpOrDown } from '../../../../../store/walletStore/walletActions';
import Loading from '../../../../components/Icon/Loading';

import './EmptyManage.less';

const EmptyManage = ({ loading }) => {
  const dispatch = useDispatch();
  const handlePowerDown = () => dispatch(openPowerUpOrDown());

  if (loading) return <Loading />;

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

EmptyManage.propTypes = {
  loading: PropsType.bool.isRequired,
};

export default EmptyManage;
