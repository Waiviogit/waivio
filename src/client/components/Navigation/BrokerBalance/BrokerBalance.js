import { isEqual, sortBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Icon, Menu } from 'antd';
import CurrencyItem from '../../../wallet/CurrencyItem/CurrencyItem';
import './BrokerBalance.less';

const BrokerBalance = ({ beaxyBalance }) => {
  const [initFirstCurrency, setInitFirstCurrency] = useState({});
  const [initSecondCurrency, setInitSecondCurrency] = useState({});
  const storageFirstItem = localStorage.getItem('firstCurrency');
  const storageSecondCurrency = localStorage.getItem('secondCurrency');
  useEffect(() => {
    if (!storageFirstItem) {
      setInitFirstCurrency(beaxyBalance[0]);
    } else {
      setInitFirstCurrency(JSON.parse(storageFirstItem));
    }
    if (!storageSecondCurrency) {
      setInitSecondCurrency(beaxyBalance[1] ? beaxyBalance[1] : {});
    } else {
      setInitSecondCurrency(JSON.parse(storageSecondCurrency));
    }
  }, []);

  const currenciesMenu = setCurrency => {
    const filteredBalance = beaxyBalance.filter(
      item => !isEqual(item, initFirstCurrency) && !isEqual(item, initSecondCurrency),
    );
    const sortedBalance = sortBy(filteredBalance, 'value').reverse();
    return (
      <Menu>
        {sortedBalance.map(item => (
          <Menu.Item key={`${item.id}`} onClick={() => setCurrency(item)}>
            <CurrencyItem item={item} isSmall />
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  const setFirstCurrency = item => {
    localStorage.setItem('firstCurrency', JSON.stringify(item));
    setInitFirstCurrency(item);
  };

  const setSecondCurrency = item => {
    localStorage.setItem('secondCurrency', JSON.stringify(item));
    setInitSecondCurrency(item);
  };

  const currenciesFirstMenu = currenciesMenu(setFirstCurrency);
  const currenciesSecondMenu = currenciesMenu(setSecondCurrency);
  if (beaxyBalance && !!beaxyBalance.length) {
    return (
      <React.Fragment>
        <Dropdown
          overlayClassName="BrokerBalance"
          placement="bottomCenter"
          overlay={currenciesFirstMenu}
          trigger={['click']}
        >
          <div>
            <CurrencyItem item={initFirstCurrency} isSmall />
            <Icon type="down" />
          </div>
        </Dropdown>
        <Dropdown
          overlayClassName="BrokerBalance"
          placement="bottomCenter"
          overlay={currenciesSecondMenu}
          trigger={['click']}
        >
          <div>
            <CurrencyItem item={initSecondCurrency} isSmall />
            <Icon type="down" />
          </div>
        </Dropdown>
      </React.Fragment>
    );
  }
  return null;
};

BrokerBalance.propTypes = {
  beaxyBalance: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default BrokerBalance;
