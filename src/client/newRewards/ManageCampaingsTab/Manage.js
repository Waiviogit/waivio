import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { isEmpty, round } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { manageTableHeaderConfig } from '../constants/manageTableConfig';
import {
  getCampaingManageList,
  validateActivateCampaing,
  // validateDeactivateCampaing,
} from '../../../waivioApi/ApiClient';
import { generatePermlink } from '../../../common/helpers/wObjectHelper';
import steemConnectAPI from '../../steemConnectAPI';
import { getCurrentCurrency } from '../../../store/appStore/appSelectors';
import Loading from '../../components/Icon/Loading';
import { deactivateCampaing } from '../../../store/newRewards/newRewardsActions';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { createBody, rewardsPost } from './constants';
import GiveawayDetailsModal from './GiveawayDetailsModal/GiveawayDetailsModal';

export const Manage = ({ intl, guideName, setHistoryLoading }) => {
  const currency = useSelector(getCurrentCurrency);
  const dispatch = useDispatch();
  const [manageList, setManageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGiveawayDetails, setShowGiveawayDetails] = useState(false);
  const campaingIsActive = status => ['active', 'reachedLimit'].includes(status);

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
            title: `Activate ${item.type} campaign`,
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
    const title = isActive
      ? intl.formatMessage({
          id: `deactivate_campaign_${item.type}`,
          defaultMessage: `Deactivate ${item.type} campaign`,
        })
      : intl.formatMessage({
          id: `activate_campaign_${item.type}`,
          defaultMessage: `Activate ${item.type} campaign`,
        });
    const content = isActive
      ? intl.formatMessage(
          {
            id: `campaign_stopped_${item.type}`,
            defaultMessage: `The terms and conditions of the ${item.type} campaign {name} will be stopped on Hive blockchain`,
          },
          { name: item.name },
        )
      : intl.formatMessage(
          {
            id: `campaign_published_${item.type}`,
            defaultMessage: `The terms and conditions of the ${item.type} campaign {name} will be published on Hive blockchain`,
          },
          { name: item.name },
        );

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
      <h2>
        {intl.formatMessage({
          id: 'manage_page_active_and_pending_campaign',
          defaultMessage: 'Active and pending campaigns',
        })}
      </h2>
      <table className="DynamicTable">
        <thead>
          {manageTableHeaderConfig?.map(tr => (
            <tr key={tr.length}>
              {tr.map(th => {
                if (th.hideForMobile && isMobile()) return null;

                return (
                  <th rowSpan={th.rowspan} colSpan={th.colspan} key={th.intl.id}>
                    {th.intl && intl.formatMessage(th.intl, { currency: currency.type })}
                  </th>
                );
              })}
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
                    disabled={['onHold'].includes(row.status)}
                  />
                )}
              </td>
              <td>
                {row.type === 'giveaways' ? (
                  <React.Fragment>
                    {showGiveawayDetails === row._id && (
                      <GiveawayDetailsModal
                        visible={showGiveawayDetails}
                        onCancel={setShowGiveawayDetails}
                        proposition={row}
                      />
                    )}
                    <a onClick={() => setShowGiveawayDetails(row._id)}>{row.name}</a>
                  </React.Fragment>
                ) : (
                  <Link to={`/rewards/details/${row._id}`}>{row.name}</Link>
                )}
              </td>
              <td>{row.status}</td>
              <td>{row.type.replace('_', ' ')}</td>
              {!isMobile() && (
                <React.Fragment>
                  <td>{round(row.budgetUSD * currency.rate, 2)}</td>
                  <td>{round(row.rewardInUSD * currency.rate, 2)}</td>
                  <td>
                    <Link to={`/rewards/reservations?statuses=assigned&campaignNames=${row.name}`}>
                      {row.reserved || null}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/rewards/reservations?statuses=completed&campaignNames=${row.name}`}>
                      {row.completed || null}
                    </Link>
                  </td>
                  <td>{round(row.remaining, 0)}</td>
                </React.Fragment>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={9}>
              {loading ? (
                <Loading />
              ) : (
                intl.formatMessage({
                  id: 'any_campaigns_yet',
                  defaultMessage: "You don't have any campaigns yet",
                })
              )}
            </td>
          </tr>
        )}
      </table>
      <p>
        **{' '}
        {intl.formatMessage({
          id: 'only_pending_campaigns',
          defaultMessage: 'Only pending campaigns can be edited',
        })}
      </p>
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

export default injectIntl(Manage);
