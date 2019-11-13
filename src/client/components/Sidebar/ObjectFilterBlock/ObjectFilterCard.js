import React from 'react';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';
import ObjectCard from '../ObjectCard';
import './ObjectFilterBlock.less';

const ObjectFilterCard = ({ wobject }) => (
  <div className="ObjectFilterCard">
    <div className="ObjectFilterCard__checkbox-wrap">
      <div className="ObjectFilterCard__checkbox-wrap-item">
        <Checkbox />
      </div>
      <ObjectCard key={wobject.author_permlink} wobject={wobject} showFollow={false} />
    </div>
    <div className="ObjectFilterCard__count">{wobject.count}</div>
  </div>
);

ObjectFilterCard.propTypes = {
  wobject: PropTypes.shape().isRequired,
};

export default ObjectFilterCard;
