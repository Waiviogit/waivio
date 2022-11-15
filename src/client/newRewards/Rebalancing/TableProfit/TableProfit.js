import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { getProfitTable } from '../../../../waivioApi/ApiClient';
import configProfitTable from './configProfitTable';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import EditToken from '../../../wallet/EditToken/EditToken';
import AddToken from '../../../wallet/AddToken';
import { getCryptosPriceHistory } from '../../../../store/appStore/appSelectors';

import './TableProfit.less';

const TableProfit = props => {
  const { intl, tokenList, setTableProfit } = props;
  const authUserName = useSelector(getAuthenticatedUserName);
  const [table, setTable] = useState([]);
  const [profit, setProfit] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [editToken, setEditToken] = useState(null);
  const [openAddTokenModal, setAddTokenModal] = useState(false);
  const [tokensListFiltered, setTokenList] = useState(tokenList);
  const cryptosPriceHistory = useSelector(getCryptosPriceHistory);
  const hiveRateInUsd = get(cryptosPriceHistory, 'hive.usdPriceHistory.usd', 1);

  useEffect(() => {
    if (tokenList && table) {
      const addedTokens = table.map(i => i.token);

      setTokenList(tokenList.filter(i => !addedTokens?.includes(i.symbol)));
    }
    setTableProfit(table);
  }, [table, tokenList]);

  const handleEditToken = token => {
    setEditToken(token);
  };

  const handleOpenAddToken = () => {
    setAddTokenModal(!openAddTokenModal);
  };

  const handleCancelEditToken = () => {
    setEditToken(null);
  };

  const getProfitTableInfo = async user => {
    try {
      setLoading(true);
      const result = await getProfitTable(user);

      setTable(result.table || []);
      setProfit(result.profit);

      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    getProfitTableInfo(authUserName);
  };

  useEffect(() => {
    getProfitTableInfo(authUserName);
  }, []);

  if (isLoading) return <div>loading...</div>;

  return (
    <div className="table-profit">
      <h2>Accumulated profit report</h2>
      <div>
        This report tracks the accumulated profit for the specified tokens. To add a token, specify
        the initial number of tokens and this report will track the difference with the current
        number of tokens in the account.
      </div>
      <Button onClick={handleOpenAddToken} className="table-profit__button-add-token">
        Add token
      </Button>
      <>
        <table className="DynamicTable">
          <thead>
            {configProfitTable.map(th => (
              <th key={th.id}>{th.intl && intl.formatMessage(th.intl)}</th>
            ))}
            {table.map(row => (
              // console.log(+row.current * row.rate * hiveRateInUsd);
              // console.log(+row.current);
              // console.log(row);
              <tr key={row.token}>
                <td>
                  <div>{row.token}</div>
                </td>
                <td>
                  <div>{row.initial}</div>
                  <div>({row.external})</div>
                </td>
                <td>
                  <div>{row.current}</div>
                  <div>${+row.current * row.rate * hiveRateInUsd}</div>
                </td>
                <td>
                  <a
                    onClick={() => {
                      const token = tokenList?.find(i => i.symbol === row.token);

                      handleEditToken({
                        symbol: row.token,
                        balance: token?.balance || 0,
                        rate: token?.rate || 1,
                        quantity: row.initial,
                        external: row.external,
                      });
                    }}
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
            {!table.length && (
              <tr>
                <td colSpan={4}>
                  <FormattedMessage
                    id="add_tokens_for_monitoring"
                    defaultMessage="Please add tokens for monitoring"
                  />
                </td>
              </tr>
            )}
          </thead>
        </table>
        <div className="table-profit__info">
          <div className="table-profit__info-profit">
            Accumulated profit: {table.length ? <strong>{profit}%</strong> : <span>N/A</span>}
          </div>
          <div>
            Note: The accumulated profit report will give accurate profit growth estimates only if
            there were no additional deposits or withdrawals of the specified tokens. It is also
            recommended to begin progress <br /> tracking after the initial rebalancing.
          </div>
        </div>
      </>
      {openAddTokenModal && (
        <AddToken
          handleSuccess={handleSuccess}
          tokensList={tokensListFiltered}
          handleCloseModal={handleOpenAddToken}
        />
      )}
      {editToken && (
        <EditToken
          tokensList={[editToken]}
          handleSuccess={handleSuccess}
          handleCloseModal={handleCancelEditToken}
        />
      )}
    </div>
  );
};

TableProfit.propTypes = {
  intl: PropTypes.shape(),
  tokenList: PropTypes.arrayOf(PropTypes.shape()),
  setTableProfit: PropTypes.func,
};

TableProfit.defaultProps = {
  intl: {},
  tokenList: [],
  setTableProfit: () => {},
};

export default injectIntl(TableProfit);
