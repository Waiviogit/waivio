import { Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import './CampaingRewardsTable.less';

const CampaingRewardsTableRow = ({ currentItem, checked }) => (
  <tr>
    <td>
      <Checkbox defaultChecked={checked} disabled />
    </td>
    <td>{currentItem.name}</td>
    <td>
      {!checked ? (
        <Link to={`/rewards/edit}`} title={'Edit'}>
          <span>Edit</span>
        </Link>
      ) : null}
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
);

CampaingRewardsTableRow.propTypes = {
  currentItem: PropTypes.shape().isRequired,
  checked: PropTypes.bool.isRequired,
};

export default CampaingRewardsTableRow;
