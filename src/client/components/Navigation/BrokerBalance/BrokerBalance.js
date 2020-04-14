import { sortBy, find } from 'lodash';
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
import { getAuthenticatedUserName } from '../../../reducers';
import CurrencyItem from '../../../wallet/CurrencyItem/CurrencyItem';
import { getUserStatistics } from '../../../../investarena/redux/actions/platformActions';
import { disconnectBroker } from '../../../../investarena/redux/actions/brokersActions';
import { getIsBeaxyUser } from '../../../user/usersHelper';
import BrokerBalanceLoading from './BrokerBalanceLoading';
import './BrokerBalance.less';

const BrokerBalance = ({
  beaxyBalance,
  platformName,
  getStatistics,
  onLogout,
  userName,
  isMobile,
}) => {
  const [initFirstCurrency, setInitFirstCurrency] = useState({});
  const [initSecondCurrency, setInitSecondCurrency] = useState({});
  const storageFirstCurrency = store.get('firstCurrency');
  const storageSecondCurrency = store.get('secondCurrency');
  const isBeaxyUser = getIsBeaxyUser(userName);

  const getCurrencyByName = name => find(beaxyBalance, { currency: name });

  useEffect(() => {
    if (beaxyBalance && !!beaxyBalance.length) {
      if (!storageFirstCurrency) {
        setInitFirstCurrency(beaxyBalance[0]);
        store.set('firstCurrency', beaxyBalance[0].currency);
      } else {
        setInitFirstCurrency(getCurrencyByName(storageFirstCurrency));
      }
      if (!storageSecondCurrency && beaxyBalance[1]) {
        setInitSecondCurrency(beaxyBalance[1]);
        store.set('secondCurrency', beaxyBalance[1].currency);
      } else {
        setInitSecondCurrency(getCurrencyByName(storageSecondCurrency));
      }
    }
    if (platformName === 'beaxy' && !beaxyBalance.length) getStatistics();
  }, [beaxyBalance]);

  const setFirstCurrency = item => {
    store.set('firstCurrency', item.currency);
    setInitFirstCurrency(item);
  };

  const setSecondCurrency = item => {
    store.set('secondCurrency', item.currency);
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
          {!isBeaxyUser && !isMobile && <Icon type="export" onClick={onLogout} />}
        </React.Fragment>
      ) : (
        <BrokerBalanceLoading />
      )}
    </div>
  );
};

BrokerBalance.propTypes = {
  beaxyBalance: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  platformName: PropTypes.string.isRequired,
  getStatistics: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  userName: PropTypes.string,
  isMobile: PropTypes.bool,
};

BrokerBalance.defaultProps = {
  userName: '',
  isMobile: false,
};

const mapStateToProps = state => ({
  platformName: getPlatformNameState(state),
  beaxyBalance: getUserWalletState(state),
  userName: getAuthenticatedUserName(state),
});

const mapDispatchToProps = dispatch => ({
  getStatistics: () => dispatch(getUserStatistics()),
  onLogout: () => dispatch(disconnectBroker()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrokerBalance);
