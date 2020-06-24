import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

const CampaignRewardsHistoryTableBodyRow = ({ currentItem }) => (
  <React.Fragment>
    <tr>
      <td>{moment(currentItem.createdAt).format('DD-MMM-YYYY')}</td>
      <td>{moment(currentItem.expired_at).format('DD-MMM-YYYY')}</td>
      <td>
        {/* eslint-disable-next-line no-underscore-dangle */}
        <Link to={`/rewards/details/${currentItem._id}`} title="View">
          {currentItem.name}
        </Link>
      </td>
      <td>{currentItem.status}</td>
      <td className="Campaign-rewards-history hide-element">{currentItem.type}</td>
      <td className="Campaign-rewards-history hide-element">{currentItem.reward.toFixed(2)}</td>
      <td className="Campaign-rewards-history hide-element">USD</td>
      <td className="Campaign-rewards-history hide-element">{currentItem.completed}</td>
      <td className="Campaign-rewards-history hide-element">{currentItem.payed}</td>
    </tr>
  </React.Fragment>
);

CampaignRewardsHistoryTableBodyRow.propTypes = {
  currentItem: PropTypes.shape().isRequired,
};

export default CampaignRewardsHistoryTableBodyRow;
