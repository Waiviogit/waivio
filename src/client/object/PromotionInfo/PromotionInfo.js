import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { truncate } from 'lodash';

const PromotionInfo = ({ promotion }) =>
  promotion.map(p => (
    <div key={p.id} className={'mb2'}>
      <div>
        <b>Promotion: </b>
        <span>active</span>
      </div>
      <div>
        Site:{' '}
        <span>
          {' '}
          {truncate(p.body, {
            length: 19,
            separator: '...',
          })}
        </span>
      </div>
      <div>
        From: <span>{moment(p.startDate).format('MMMM DD, YYYY')}</span>
      </div>
      <div>
        Till: <span>{moment(p.endDate).format('MMMM DD, YYYY')}</span>
      </div>
    </div>
  ));

PromotionInfo.propTypes = {
  promotion: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default PromotionInfo;
