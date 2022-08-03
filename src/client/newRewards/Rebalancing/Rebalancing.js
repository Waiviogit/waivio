import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, Modal, Slider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { isEmpty, round, uniqBy } from 'lodash';
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
import { isMobile as _isMobile } from '../../../common/helpers/apiHelpers';
import apiConfig from '../../../waivioApi/routes';
import TableProfit from './TableProfit';
import requiresLogin from '../../auth/requiresLogin';

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
  const [tableProfit, setTableProfit] = useState([]);
  const [tokenList, setTokenList] = useState([]);
  const showAll = useRef(false);
  const search = useQuery();
  const isMobile = _isMobile();

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

  const getTokensList = async () => {
    try {
      setLoading(true);
      const res = await getRebalancingTable(authUserName, { showAll: true });
      const _tokensList = res.table.reduce((acc, curr) => {
        const accTmp = [...acc];

        if (curr.baseQuantity !== '0') {
          accTmp.push({ balance: curr.baseQuantity, symbol: curr.base });
        }
        if (curr.quoteQuantity !== '0') {
          accTmp.push({ balance: curr.quoteQuantity, symbol: curr.quote });
        }

        return accTmp;
      }, []);

      setTokenList(uniqBy(_tokensList, 'symbol'));
    } finally {
      setLoading(false);
    }
  };

  const getTableInfo = async () => {
    setLoading(true);

    const res = await getRebalancingTable(authUserName, { showAll: showAll.current });

    setDifferencePercent(res.differencePercent);
    setSliderValue(res.differencePercent);
    setTable(res.table.filter(row => row.baseQuantity !== '0' || row.quoteQuantity !== '0'));
    setLoading(false);
  };

  const handleChangeShowAll = () => {
    showAll.current = !showAll.current;
    getTableInfo();
  };

  useEffect(() => {
    if (search.get('username') && search.get('username') !== authUserName) showConfirm();
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

    await handlePoolChange({ percent: sliderValue });
  };

  useEffect(() => {
    getTokensList();

    const socket = new WebSocket(`wss://${apiConfig[process.env.NODE_ENV].host}/notifications-api`);

    socket.onmessage = e => {
      const data = JSON.parse(e.data);

      if (data.type === 'updateInfo') {
        getTableInfo();
      }
    };

    return () => socket.close();
  }, []);

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
      {!!tableProfit.length && (
        <div className="Rebalancing__checkbox-block">
          <Checkbox value={showAll.current} onChange={handleChangeShowAll} id="show-all" />
          <label htmlFor="show-all">Show all available pairs</label>
        </div>
      )}
      <table className="DynamicTable">
        <thead>
          {configRebalancingTable
            .filter(i => !isMobile || !i.hideOnMobile)
            .map(th => (
              <th key={th.id}>{th.intl && intl.formatMessage(th.intl)}</th>
            ))}
        </thead>
        {!isEmpty(table) ? (
          table.map(row => {
            const getValueForTd = value => (+row.baseQuantity && +row.quoteQuantity ? value : '-');

            return (
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
                {!isMobile && (
                  <>
                    <td>
                      <div>{row.baseQuantity}</div>
                      <div>{row.quoteQuantity}</div>
                    </td>
                    <td>{getValueForTd(row.holdingsRatio)}</td>
                    <td>{row.marketRatio}</td>
                  </>
                )}
                <td>{getValueForTd(`${round(row.difference, 2)}%`)}</td>
                <td>
                  {getValueForTd(
                    <a
                      onClick={async () => {
                        dispatch(setBothTokens({ symbol: row.base }, { symbol: row.quote }));
                        dispatch(toggleModalInRebalance(true, row.dbField));
                      }}
                    >
                      <div>{row.rebalanceBase}</div>
                      <div>{row.rebalanceQuote}</div>
                    </a>,
                  )}
                </td>
                <td>
                  {getValueForTd(
                    parseFloat(row.earn) > 30 ? `initial rebalancing` : `${row.earn}%`,
                  )}
                </td>
              </tr>
            );
          })
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
      {visibleSwap && <SwapTokens isRebalance />}
      <TableProfit setTableProfit={setTableProfit} tokenList={tokenList} />
    </div>
  );
};

Rebalancing.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default requiresLogin(injectIntl(Rebalancing));
