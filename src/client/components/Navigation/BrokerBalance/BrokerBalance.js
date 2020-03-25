import { sortBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Dropdown, Icon, Menu } from 'antd';
import store from 'store';
import {
  getPlatformNameState,
  getUserWalletState,
} from '../../../../investarena/redux/selectors/platformSelectors';
import CurrencyItem from '../../../wallet/CurrencyItem/CurrencyItem';
import { getUserStatistics } from '../../../../investarena/redux/actions/platformActions';
import Loading from '../../Icon/Loading';
import { logout } from '../../../auth/authActions';
import './BrokerBalance.less';

const BrokerBalance = ({ beaxyBalance, platformName, getStatistics, onLogout }) => {
  const [initFirstCurrency, setInitFirstCurrency] = useState({});
  const [initSecondCurrency, setInitSecondCurrency] = useState({});
  const storageFirstItem = store.get('firstCurrency');
  const storageSecondCurrency = store.get('secondCurrency');
  useEffect(() => {
    if (beaxyBalance && !!beaxyBalance.length) {
      if (!storageFirstItem) {
        setInitFirstCurrency(beaxyBalance[0]);
      } else {
        setInitFirstCurrency(storageFirstItem);
      }
      if (!storageSecondCurrency) {
        setInitSecondCurrency(beaxyBalance[1] ? beaxyBalance[1] : {});
      } else {
        setInitSecondCurrency(storageSecondCurrency);
      }
    }
    if (platformName === 'beaxy' && !beaxyBalance.length) getStatistics();
  }, [beaxyBalance]);

  const setFirstCurrency = item => {
    store.set('firstCurrency', item);
    setInitFirstCurrency(item);
  };

  const setSecondCurrency = item => {
    store.set('secondCurrency', item);
    setInitSecondCurrency(item);
  };

  function currenciesMenu(setCurrency) {
    const filteredBalance = beaxyBalance.filter(
      item =>
        item.currency !== initFirstCurrency.currency &&
        item.currency !== initSecondCurrency.currency,
    );

    const sortedBalance = sortBy(filteredBalance, 'value').reverse();
    return (
      <Menu>
        {!!sortedBalance.length ? (
          sortedBalance.map(item => (
            <Menu.Item key={`${item.id}`} onClick={() => setCurrency(item)}>
              <CurrencyItem item={item} isSmall />
            </Menu.Item>
          ))
        ) : (
          <Menu.Item>
            <FormattedMessage
              id="no_more_cryptocurrencies"
              defaultMessage="No more cryptocurrencies"
            />
          </Menu.Item>
        )}
      </Menu>
    );
  }

  return (
    <div className="BrokerBalance">
      {beaxyBalance.length ? (
        <React.Fragment>
          <Dropdown
            overlayClassName="BrokerBalance__dropdown"
            placement="bottomCenter"
            overlay={currenciesMenu(setFirstCurrency)}
            trigger={['click']}
          >
            <div>
              <CurrencyItem item={initFirstCurrency} isSmall />
              <Icon type="down" />
            </div>
          </Dropdown>
          <Dropdown
            overlayClassName="BrokerBalance__dropdown"
            placement="bottomCenter"
            overlay={currenciesMenu(setSecondCurrency)}
            trigger={['click']}
          >
            <div>
              <CurrencyItem item={initSecondCurrency} isSmall />
              <Icon type="down" />
            </div>
          </Dropdown>
          <Icon type="export" onClick={onLogout} />
        </React.Fragment>
      ) : (
        <Loading />
      )}
    </div>
  );
};

BrokerBalance.propTypes = {
  beaxyBalance: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  platformName: PropTypes.string.isRequired,
  getStatistics: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  platformName: getPlatformNameState(state),
  beaxyBalance: getUserWalletState(state),
});

const mapDispatchToProps = dispatch => ({
  getStatistics: () => dispatch(getUserStatistics()),
  onLogout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrokerBalance);
