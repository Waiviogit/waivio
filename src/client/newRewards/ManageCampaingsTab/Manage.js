import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { isEmpty, round } from 'lodash';
import PropTypes from 'prop-types';

import { manageTableHeaderConfig } from '../constants/manageTableConfig';
import {
  getCampaingManageList,
  validateActivateCampaing,
  // validateDeactivateCampaing,
} from '../../../waivioApi/ApiClient';
import { generatePermlink } from '../../../common/helpers/wObjectHelper';
import { createBody, rewardsPost } from '../../rewards/Manage/constants';
import steemConnectAPI from '../../steemConnectAPI';
import { getCurrentCurrency } from '../../../store/appStore/appSelectors';
import Loading from '../../components/Icon/Loading';
import { deactivateCampaing } from '../../../store/newRewards/newRewardsActions';

export const Manage = ({ intl, guideName, setHistoryLoading }) => {
  const currency = useSelector(getCurrentCurrency);
  const dispatch = useDispatch();
  const [manageList, setManageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const campaingIsActive = status => status === 'active';

  useEffect(() => {
    getCampaingManageList(guideName).then(res => {
      setManageList(res);
      setLoading(false);
    });
  }, []);

  const activateCampaing = item => {
    const permlink = `activate-${rewardsPost.parent_author.replace(
      '.',
      '-',
    )}-${generatePermlink()}`;

    validateActivateCampaing({ guideName, _id: item._id, permlink }).then(res => {
      if (res.isValid) {
        const commentOp = [
          'comment',
          {
            ...rewardsPost,
            author: guideName,
            permlink,
            title: 'Activate rewards campaign',
            body: createBody(item),
            json_metadata: JSON.stringify({
              waivioRewards: { type: 'activateCampaign', campaignId: item._id },
            }),
          },
        ];
        const copyManageList = [...manageList];
        const itemIndex = copyManageList.findIndex(manageItem => item._id === manageItem._id);

        copyManageList.splice(itemIndex, 1, {
          ...copyManageList[itemIndex],
          status: 'active',
          activationPermlink: permlink,
        });

        setManageList(copyManageList);
        steemConnectAPI.broadcast([commentOp]);
      } else {
        message.error(res.message);
      }
    });
  };

  const handleDeactivateCampaing = item => {
    const copyManageList = [...manageList];
    const itemIndex = copyManageList.findIndex(manageItem => item._id === manageItem._id);

    copyManageList.splice(itemIndex, 1, {
      ...copyManageList[itemIndex],
      loading: true,
    });
    setManageList(copyManageList);
    dispatch(deactivateCampaing(item, guideName)).then(() => {
      setManageList(manageList.filter(manageItem => manageItem._id !== item._id));
      setHistoryLoading(true);
    });
  };

  const handleChangeCampaingStatus = item => {
    if (campaingIsActive(item.status)) {
      handleDeactivateCampaing(item);
    } else {
      activateCampaing(item);
    }
  };

  const showConfirm = item => {
    const isActive = campaingIsActive(item.status);
    const title = isActive ? 'Deactivate rewards campaign' : 'Activate rewards campaign';
    const content = isActive
      ? `The terms and conditions of the rewards campaign ${item.name} will be stopped on Hive blockchain`
      : `The terms and conditions of the rewards campaign ${item.name} will be published on Hive blockchain`;

    Modal.confirm({
      title,
      content,
      onOk() {
        handleChangeCampaingStatus(item);
      },
    });
  };

  return (
    <div>
      <h2>Active and pending campaigns</h2>
      <table className="DynamicTable">
        <thead>
          {manageTableHeaderConfig.map(tr => (
            <tr key={tr.length}>
              {tr.map(th => (
                <th rowSpan={th.rowspan} colSpan={th.colspan} key={th.intl.id}>
                  {th.intl && intl.formatMessage(th.intl, { currency: currency.type })}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {!isEmpty(manageList) ? (
          manageList.map(row => (
            <tr key={row._id}>
              <td>
                {row.loading ? (
                  <Loading />
                ) : (
                  <Checkbox
                    checked={campaingIsActive(row.status)}
                    onChange={() => showConfirm(row)}
                  />
                )}
              </td>
              <td>
                <Link to={`/rewards-new/details/${row._id}`}>{row.name}</Link>
              </td>
              <td>{row.status}</td>
              <td>{row.type}</td>
              <td>{round(row.budgetUSD * currency.rate, 2)}</td>
              <td>{round(row.rewardInUSD * currency.rate, 2)}</td>
              <td>
                <Link to={`/rewards-new/reservations?statuses=assigned&campaignNames=${row.name}`}>
                  {row.reserved || null}
                </Link>
              </td>
              <td>
                <Link to={`/rewards-new/reservations?statuses=completed&campaignNames=${row.name}`}>
                  {row.completed || null}
                </Link>
              </td>
              <td>{round(row.remaining, 0)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={9}>{loading ? <Loading /> : "You don't have any campaigns yet"}</td>
          </tr>
        )}
      </table>
      <p>** Only pending campaigns can be edited</p>
    </div>
  );
};

Manage.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  guideName: PropTypes.string.isRequired,
  setHistoryLoading: PropTypes.func.isRequired,
};

export default Manage;
