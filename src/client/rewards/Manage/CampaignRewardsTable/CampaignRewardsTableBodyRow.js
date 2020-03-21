import { Checkbox, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { rewardPostContainerData } from '../../../rewards/rewardsHelper';
import { generatePermlink } from '../../../helpers/wObjectHelper';
import {
  validateActivationCampaign,
  validateInactivationCampaign,
} from '../../../../waivioApi/ApiClient';
import './CampaignRewardsTable.less';

const CampaignRewardsTableRow = ({
  currentItem,
  activateCampaign,
  inactivateCampaign,
  userName,
  intl,
}) => {
  const [isModalOpen, toggleModal] = useState(false);
  const [isLoading, setLoad] = useState(false);
  const [activationStatus, setActivationStatus] = useState('');
  const [activationPermlink, setActivationPermlink] = useState('');
  const isChecked = currentItem.status === 'active' || currentItem.status === 'payed';
  const isInactive =
    currentItem.status === 'inactive' ||
    currentItem.status === 'expired' ||
    currentItem.status === 'deleted';

  const activateCamp = () => {
    const generatedPermlink = `activate-${rewardPostContainerData.author}-${generatePermlink()}`;
    setActivationPermlink(generatedPermlink);
    const activationCampaignData = {
      // eslint-disable-next-line no-underscore-dangle
      campaign_id: currentItem._id,
      guide_name: userName,
      permlink: generatedPermlink,
    };
    setLoad(true);
    validateActivationCampaign(activationCampaignData)
      .then(() => {
        activateCampaign(currentItem, activationCampaignData.permlink)
          .then(() => {
            toggleModal(false);
            message.success(
              intl.formatMessage(
                {
                  id: 'manage_page_campaign_activated',
                  defaultMessage: `Campaign '${currentItem.name}' - has been activated`,
                },
                {
                  campaignName: currentItem.name,
                },
              ),
            );
            setLoad(false);
            setActivationStatus('activated');
          })
          .catch(e => {
            toggleModal(false);
            message.error(e.error_description);
            setLoad(false);
          });
      })
      .catch(e => {
        toggleModal(false);
        if (e && e.error && e.error === 'Expiration time is invalid') {
          message.error(
            intl.formatMessage({
              id: 'manage_page_expiration_time_is_invalid',
              defaultMessage: 'Expiration time is invalid! Please, check expire data.',
            }),
          );
        } else {
          message.error(
            intl.formatMessage(
              {
                id: 'manage_page_cant_activate_campaign',
                defaultMessage: `Can't activate campaign '${currentItem.name}', try again later`,
              },
              {
                campaignName: currentItem.name,
              },
            ),
          );
        }
        setLoad(false);
      });
  };

  const inactivateCamp = () => {
    const itemOnInactivate = currentItem.activation_permlink
      ? { ...currentItem }
      : { ...currentItem, activation_permlink: activationPermlink };
    const inactivationCampaignData = {
      // eslint-disable-next-line no-underscore-dangle
      campaign_permlink: currentItem.activation_permlink || activationPermlink,
      guide_name: userName,
      // eslint-disable-next-line no-underscore-dangle
      permlink: `deactivation-${currentItem._id}-${generatePermlink()}`,
    };
    setLoad(true);
    validateInactivationCampaign(inactivationCampaignData)
      .then(() => {
        inactivateCampaign(itemOnInactivate, inactivationCampaignData.permlink)
          .then(() => {
            toggleModal(false);
            message.success(
              intl.formatMessage(
                {
                  id: 'manage_page_campaign_inactivated',
                  defaultMessage: `Campaign '${currentItem.name}' - has been inactivated`,
                },
                {
                  campaignName: currentItem.name,
                },
              ),
            );
            setLoad(false);
            setActivationStatus('inactivated');
          })
          .catch(e => {
            toggleModal(false);
            message.error(e.error_description);
            setLoad(false);
          });
      })
      .catch(() => {
        toggleModal(false);
        message.error(
          intl.formatMessage(
            {
              id: 'manage_page_cant_inactivate_campaign',
              defaultMessage: `Can't inactivate campaign '${currentItem.name}', try again later`,
            },
            {
              campaignName: currentItem.name,
            },
          ),
        );
        setLoad(false);
      });
  };

  const handleChangeCheckbox = e => {
    if (e.target.checked) {
      e.preventDefault();
      toggleModal(true);
    } else {
      e.preventDefault();
      toggleModal(true);
    }
  };

  return (
    <React.Fragment>
      <tr>
        <td>
          <Checkbox
            checked={activationStatus ? activationStatus === 'activated' : isChecked}
            onChange={handleChangeCheckbox}
            disabled={activationStatus ? activationStatus === 'inactivated' : isInactive}
          />
        </td>
        <td>{currentItem.name}</td>
        <td>
          {!isChecked ? (
            // eslint-disable-next-line no-underscore-dangle
            <Link to={`/rewards/edit/${currentItem._id}`} title="Edit">
              Edit
            </Link>
          ) : (
            // eslint-disable-next-line no-underscore-dangle
            <Link to={`/rewards/edit/${currentItem._id}`} title="Edit">
              View
            </Link>
          )}
        </td>

        <td>
          {/* eslint-disable-next-line no-nested-ternary */
          activationStatus
            ? activationStatus === 'activated'
              ? intl.formatMessage({ id: 'manage_page_active', defaultMessage: 'Active' })
              : intl.formatMessage({ id: 'manage_page_inactive', defaultMessage: 'Inactive' })
            : currentItem.status}
        </td>
        <td>{currentItem.type}</td>
        <td className="Campaign-rewards hide-element">{currentItem.budget.toFixed(2)}</td>
        <td className="Campaign-rewards hide-element">{currentItem.reward.toFixed(2)}</td>
        <td className="Campaign-rewards hide-element">{currentItem.reserved}</td>
        <td className="Campaign-rewards hide-element">{currentItem.completed}</td>
        <td className="Campaign-rewards hide-element">{currentItem.remaining}</td>
      </tr>
      <Modal
        closable
        title={
          !(activationStatus ? activationStatus === 'activated' : isChecked)
            ? intl.formatMessage({
                id: 'activate_campaign',
                defaultMessage: `Activate rewards campaign`,
              })
            : intl.formatMessage({
                id: 'deactivate_campaign',
                defaultMessage: `Deactivate rewards campaign`,
              })
        }
        maskClosable={false}
        visible={isModalOpen}
        onOk={
          !(activationStatus ? activationStatus === 'activated' : isChecked)
            ? activateCamp
            : inactivateCamp
        }
        okButtonProps={{ disabled: isLoading, loading: isLoading }}
        cancelButtonProps={{ disabled: isLoading }}
        onCancel={() => {
          toggleModal(false);
        }}
      >
        {!isChecked
          ? intl.formatMessage(
              {
                id: 'campaign_terms',
                defaultMessage: `The terms and conditions of the rewards campaign ${currentItem.name} will be published on Hive blockchain`,
              },
              {
                campaignName: currentItem.name,
              },
            )
          : intl.formatMessage(
              {
                id: 'deactivate_campaign_terms',
                defaultMessage: `The terms and conditions of the rewards campaign ${currentItem.name} will be stopped on Hive blockchain`,
              },
              {
                campaignName: currentItem.name,
              },
            )}
      </Modal>
    </React.Fragment>
  );
};

CampaignRewardsTableRow.propTypes = {
  activateCampaign: PropTypes.func.isRequired,
  inactivateCampaign: PropTypes.func.isRequired,
  currentItem: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
};

export default injectIntl(CampaignRewardsTableRow);
