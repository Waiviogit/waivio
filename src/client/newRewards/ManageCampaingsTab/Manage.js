import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, message } from 'antd';
import { Link } from 'react-router-dom';
import { isEmpty, round } from 'lodash';
import PropTypes from 'prop-types';

import { manageTableHeaderConfig } from '../constants/manageTableConfig';
import {
  getCampaingManageList,
  validateActivateCampaing,
  validateDeactivateCampaing,
} from '../../../waivioApi/ApiClient';
import { generatePermlink } from '../../../common/helpers/wObjectHelper';
import { createBody, rewardsPost } from '../../rewards/Manage/constants';
import steemConnectAPI from '../../steemConnectAPI';
import { getCurrentCurrency } from '../../../store/appStore/appSelectors';

export const Manage = ({ intl, guideName }) => {
  const currency = useSelector(getCurrentCurrency);
  const [manageList, setManageList] = useState([]);
  const campaingIsActive = status => status === 'active';

  useEffect(() => {
    getCampaingManageList(guideName).then(res => setManageList(res));
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

  const deactivateCampaing = item => {
    const deactivationPermlink = `deactivate-${rewardsPost.parent_author.replace(
      '.',
      '-',
    )}-${generatePermlink()}`;

    validateDeactivateCampaing({
      guideName,
      activationPermlink: item.activationPermlink,
      deactivationPermlink,
    }).then(res => {
      if (res.isValid) {
        const commentOp = [
          'comment',
          {
            parent_author: guideName,
            parent_permlink: item.activationPermlink,
            author: guideName,
            permlink: deactivationPermlink,
            title: 'Unactivate object for rewards',
            body: `Campaign ${item.name} was inactivated by ${guideName} `,
            json_metadata: JSON.stringify({
              waivioRewards: {
                type: 'stopCampaign',
                campaignId: item._id,
              },
            }),
          },
        ];

        setManageList(manageList.filter(manageItem => manageItem._id === item._id));
        steemConnectAPI.broadcast([commentOp]);
      } else {
        message.error(res.message);
      }
    });
  };

  const handleChangeCampaingStatus = item => {
    if (campaingIsActive(item.status)) {
      deactivateCampaing(item);
    } else {
      activateCampaing(item);
    }
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
                <Checkbox
                  checked={campaingIsActive(row.status)}
                  onChange={() => handleChangeCampaingStatus(row)}
                />
              </td>
              <td>
                <Link to={`/rewards-new/details/${row._id}`}>{row.name}</Link>
              </td>
              <td>{row.status}</td>
              <td>{row.type}</td>
              <td>{round(row.budgetUSD * currency.rate, 3)}</td>
              <td>{round(row.rewardInUSD * currency.rate, 3)}</td>
              {/* це має буть лінка яка веде на резервейшин хісторі еслі 0 то не показувать */}
              <td>{row.reserved}</td>
              <td>{row.completed}</td>
              <td>{row.remaining}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={9}>Empty</td>
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
};

export default Manage;
