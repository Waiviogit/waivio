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
  const isChecked = currentItem.status === 'active' || currentItem.status === 'payed';
  const validateActivationData = {
    // eslint-disable-next-line no-underscore-dangle
    campaign_id: currentItem._id,
    guide_name: userName,
    permlink: `activate-${rewardPostContainerData.author}-${generatePermlink()}`,
  };

  const validateInactivationData = {
    // eslint-disable-next-line no-underscore-dangle
    campaign_permlink: currentItem.activation_permlink,
    guide_name: userName,
    // eslint-disable-next-line no-underscore-dangle
    permlink: `deactivation-${currentItem._id}-${generatePermlink()}`,
  };

  const activateCamp = () => {
    setLoad(true);
    validateActivationCampaign(validateActivationData)
      .then(() => {
        activateCampaign(currentItem, validateActivationData.permlink).then(() => {
          toggleModal(false);
          message.success(`Campaign '${currentItem.name}' - has been activated`);
          setLoad(false);
        });
      })
      .catch(() => {
        message.error(`Can't activate campaign'${currentItem.name}', try again later`);
        setLoad(false);
      });
  };

  const inactivateCamp = () => {
    toggleModal(false);
    validateInactivationCampaign(validateInactivationData)
      .then(() => {
        inactivateCampaign(currentItem, validateInactivationData.permlink).then(() => {
          toggleModal(false);
          message.success(`Campaign '${currentItem.name}' - has been inactivated`);
          setLoad(false);
        });
      })
      .catch(() => {
        message.error(`Can't activate campaign'${currentItem.name}', try again later`);
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
          <Checkbox checked={isChecked} onChange={handleChangeCheckbox} />
        </td>
        <td>{currentItem.name}</td>
        <td>
          {!isChecked && (
            <Link to={`/rewards/edit}`} title="Edit">
              <span>Edit</span>
            </Link>
          )}
        </td>
        <td>{currentItem.status}</td>
        <td>{currentItem.type}</td>
        <td className="Campaign-rewards hide-element">{currentItem.budget.toFixed(2)}</td>
        <td className="Campaign-rewards hide-element">{currentItem.reward.toFixed(2)}</td>
        <td className="Campaign-rewards hide-element">{currentItem.reserved}</td>
        <td className="Campaign-rewards hide-element">{currentItem.payable}</td>
        <td className="Campaign-rewards hide-element">{currentItem.remaining}</td>
      </tr>
      <Modal
        closable
        title={
          !isChecked
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
        onOk={!isChecked ? activateCamp : inactivateCamp}
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
                defaultMessage: `The terms and conditions of the rewards campaign ${currentItem.name} will be published on Steem blockchain`,
              },
              {
                campaignName: currentItem.name,
              },
            )
          : intl.formatMessage(
              {
                id: 'deactivate_campaign_terms',
                defaultMessage: `The terms and conditions of the rewards campaign ${currentItem.name} will be stopped on Steem blockchain`,
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
