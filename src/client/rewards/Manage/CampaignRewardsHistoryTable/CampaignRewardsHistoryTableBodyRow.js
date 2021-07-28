import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { isEmpty } from 'lodash';

const CampaignRewardsHistoryTableBodyRow = ({ currentItem, currencyInfo }) => (
  <tr>
    <td>{moment(currentItem.createdAt).format('DD-MMM-YYYY')}</td>
    <td>{moment(currentItem.expired_at).format('DD-MMM-YYYY')}</td>
    <td>
      <Link to={`/rewards/details/${currentItem._id}`} title="View">
        {currentItem.name}
      </Link>
    </td>
    <td>{currentItem.status}</td>
    <td className="Campaign-rewards-history hide-element">{currentItem.type}</td>
    <td className="Campaign-rewards-history hide-element">
      {(currentItem.reward * currencyInfo.rate).toFixed(2)}
    </td>
    <td className="Campaign-rewards-history hide-element">{currencyInfo.type}</td>
    <td className="Campaign-rewards-history hide-element">{currentItem.completedTotal}</td>
    <td className="Campaign-rewards-history hide-element">{currentItem.payed || 0}</td>
  </tr>
);

CampaignRewardsHistoryTableBodyRow.propTypes = {
  currentItem: PropTypes.shape().isRequired,
  currencyInfo: PropTypes.shape({
    type: PropTypes.string,
    rate: PropTypes.number,
  }).isRequired,
};

export default CampaignRewardsHistoryTableBodyRow;
