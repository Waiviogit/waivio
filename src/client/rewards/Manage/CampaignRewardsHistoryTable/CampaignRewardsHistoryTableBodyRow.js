import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { isEmpty } from 'lodash';

const CampaignRewardsHistoryTableBodyRow = ({ currentItem }) => {
  const payed = isEmpty(currentItem.payed) ? 0 : currentItem.payed;
  return (
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
        <td className="Campaign-rewards-history hide-element">{currentItem.completedTotal}</td>
        <td className="Campaign-rewards-history hide-element">{payed}</td>
      </tr>
    </React.Fragment>
  );
};

CampaignRewardsHistoryTableBodyRow.propTypes = {
  currentItem: PropTypes.shape().isRequired,
};

export default CampaignRewardsHistoryTableBodyRow;
