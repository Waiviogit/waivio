import { Checkbox, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './CampaingRewardsTable.less';

const CampaingRewardsTableRow = ({ currentItem, activateCampaign }) => {
  const [isModalOpen, toggleModal] = useState(false);
  const [isLoading, setLoad] = useState(false);
  const isChecked = currentItem.status === 'active' || currentItem.status === 'payed';
  const activateCamp = () => {
    setLoad(true);
    activateCampaign(currentItem)
      .then(() => {
        toggleModal(false);
        setLoad(false);
        message.success(`Campaign '${currentItem.name}' - has been activated`);
      })
      .catch(() => {
        message.error(`Can't activate campaign'${currentItem.name}', try again later`);
      });
  };
  const handleChangeCheckbox = e => {
    if (e.target.checked) {
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
            <Link to={`/rewards/edit}`} title={'Edit'}>
              <span>Edit</span>
            </Link>
          )}
        </td>
        <td>{currentItem.status}</td>
        <td>{currentItem.type}</td>
        <td className="Campaing-rewards hide-element">{currentItem.budget.toFixed(2)}</td>
        <td className="Campaing-rewards hide-element">{currentItem.reward.toFixed(2)}</td>
        <td className="Campaing-rewards hide-element">{currentItem.reserved}</td>
        <td className="Campaing-rewards hide-element">{currentItem.payable}</td>
        <td className="Campaing-rewards hide-element">{currentItem.payed}</td>
        <td className="Campaing-rewards hide-element">{currentItem.remaining}</td>
      </tr>
      <Modal
        closable
        title={`Activate campaign?`}
        maskClosable={false}
        visible={isModalOpen}
        onOk={activateCamp}
        okButtonProps={{ disabled: isLoading, loading: isLoading }}
        cancelButtonProps={{ disabled: isLoading }}
        onCancel={() => {
          toggleModal(false);
        }}
      >
        Activate?
      </Modal>
    </React.Fragment>
  );
};

CampaingRewardsTableRow.propTypes = {
  activateCampaign: PropTypes.func.isRequired,
  currentItem: PropTypes.shape().isRequired,
};

export default CampaingRewardsTableRow;
