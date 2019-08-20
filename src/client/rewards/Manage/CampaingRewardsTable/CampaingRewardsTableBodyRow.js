import { Checkbox, Modal } from 'antd';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './CampaingRewardsTable.less';

const CampaingRewardsTableRow = ({ currentItem, checked, activateCampaign }) => {
  const [isModalOpen, toggleModal] = useState(0);
  const activateCamp = () => {
    activateCampaign(currentItem).then(toggleModal(false));
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
          <Checkbox defaultChecked={checked} onChange={handleChangeCheckbox} />
        </td>
        <td>{currentItem.name}</td>
        <td>
          {!checked && (
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
  checked: PropTypes.bool.isRequired,
};

export default CampaingRewardsTableRow;
