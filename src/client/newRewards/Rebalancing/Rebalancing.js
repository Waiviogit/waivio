import React, { useEffect, useState } from 'react';
import { Checkbox, Modal, Slider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { isEmpty, round } from 'lodash';
import PropTypes from 'prop-types';

import configRebalancingTable from './configRebalancingTable';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getRebalancingTable, setRebalancingTableItem } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import { setBothTokens, toggleModalInRebalance } from '../../../store/swapStore/swapActions';
import SwapTokens from '../../wallet/SwapTokens/SwapTokens';
import { getVisibleModal } from '../../../store/swapStore/swapSelectors';
import useQuery from '../../../hooks/useQuery';
import { logout } from '../../../store/authStore/authActions';

import './Rebalancing.less';

const Rebalancing = ({ intl }) => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const visibleSwap = useSelector(getVisibleModal);
  const dispatch = useDispatch();
  const [openSliderModal, setOpenSliderModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [differencePercent, setDifferencePercent] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [table, setTable] = useState([]);
  const search = useQuery();

  const showConfirm = () => {
    Modal.confirm({
      title: "You're in the wrong account. Do you want to continue?",
      okText: 'Logout',
      cancelText: 'Proceed',
      onOk() {
        dispatch(logout());
      },
    });
  };

  const getTableInfo = async () => {
    setLoading(true);

    const res = await getRebalancingTable(authUserName);

    setDifferencePercent(res.differencePercent);
    setSliderValue(res.differencePercent);
    setTable(res.table);
    setLoading(false);
  };

  useEffect(() => {
    if (search.get('username') !== authUserName) showConfirm();
    getTableInfo();
  }, []);

  const handlePoolChange = ({ field, percent }) => {
    const body = table.reduce(
      (acc, curr) => {
        acc[curr.dbField] = curr.dbField === field ? !curr.active : curr.active;

        return acc;
      },
      { differencePercent: percent || differencePercent },
    );

    setRebalancingTableItem(authUserName, body).then(() => {
      getTableInfo();
    });
  };

  const handleChangeDiffPersent = async () => {
    setDifferencePercent(sliderValue);
    setOpenSliderModal(false);

    await handlePoolChange();
  };

  return (
    <div className="Rebalancing table-wrap">
      <h1>Rebalancing:</h1>
      <p>
        Users can increase their crypto holdings by making arbitrages between their personal
        holdings and the open market. One of the main differences between arbitrage and trading is
        that each arbitrage transaction is profitable at the time of execution.
        <p>
          {' '}
          Arbitrage in the open markets is a highly competitive business. But when you arbitrage
          using your private holdings, there is no competition, since you have exclusive access to
          your own funds.
        </p>
      </p>
      <p>
        Waivio offers a rebalancing tool to make this arbitrage process simple and straightforward.
        Users review and approve each transaction manually using their active private keys. All
        token swaps are processed via Hive-Engine.com decentralized exchange. Waivio does not have
        access to users funds or keys.
      </p>
      <p>
        <b>Disclaimer:</b> The Rebalancing service is provided on as-is / as-available basis.
      </p>
      <hr />
      <h3>Notifications:</h3>
      <p>
        Notifications are sent when the difference between the balance of personal crypto holdings
        and the open market exceeds the set value.
      </p>
      <p>
        Alert me when the difference exceeds: {differencePercent}% (
        <a onClick={() => setOpenSliderModal(true)}>change</a>)
      </p>
      <table className="DynamicTable">
        <thead>
          {configRebalancingTable.map(th => (
            <th key={th.id}>{th.intl && intl.formatMessage(th.intl)}</th>
          ))}
        </thead>
        {!isEmpty(table) ? (
          table.map(row => (
            <tr key={row._id}>
              <td>
                <Checkbox
                  checked={row.active}
                  onChange={() => {
                    handlePoolChange({ field: row.dbField });
                  }}
                />
              </td>
              <td>
                <div>{row.base}</div>
                <div>{row.quote}</div>
              </td>
              <td>
                <div>{round(row.baseQuantity, 3)}</div>
                <div>{round(row.quoteQuantity, 3)}</div>
              </td>
              <td>{round(row.holdingsRatio, 5) || '-'}</td>
              <td>{round(row.marketRatio, 5) || '-'}</td>
              <td>{+row.difference ? `${round(row.difference, 2)}%` : '-'}</td>
              <td>
                {+row.rebalanceBase.split(' ')[1] ? (
                  <a
                    onClick={async () => {
                      dispatch(setBothTokens(row.base, row.quote));
                      dispatch(toggleModalInRebalance(true, row.dbField));
                    }}
                  >
                    <div>{row.rebalanceBase}</div>
                    <div>{row.rebalanceQuote}</div>
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td>{+row.earn ? `${round(row.earn, 2)}%` : '-'}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={9}>{loading ? <Loading /> : "You don't have any records yet"}</td>
          </tr>
        )}
      </table>
      <Modal
        title={'Change sensitivity for alerts'}
        visible={openSliderModal}
        onCancel={() => setOpenSliderModal(false)}
        onOk={handleChangeDiffPersent}
      >
        <Slider
          min={0}
          value={sliderValue}
          marks={{
            1: `1%`,
            25: `25%`,
            50: `50%`,
            75: `75%`,
            100: `100%`,
          }}
          onChange={value => setSliderValue(value)}
        />{' '}
      </Modal>
      {visibleSwap && <SwapTokens />}
    </div>
  );
};

Rebalancing.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(Rebalancing);
