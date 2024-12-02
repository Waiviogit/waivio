import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const PromotionInfo = ({ promotion }) =>
  promotion.map(p => (
    <div key={p.id}>
      <div>
        <b>Promotion:</b> <span>active</span>
      </div>
      <div>
        From <span>{moment(p.startDate).format('MMMM DD, YYYY')}</span> Till{' '}
        <span>{moment(p.endDate).format('MMMM DD, YYYY')}</span>
      </div>
    </div>
  ));

PromotionInfo.propTypes = {
  promotion: PropTypes.arrayOf().isRequired,
};

export default PromotionInfo;
