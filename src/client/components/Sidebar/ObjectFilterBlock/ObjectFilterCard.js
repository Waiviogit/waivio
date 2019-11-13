import React from 'react';
import { Checkbox, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
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
    <div className="ObjectFilterCard__count">
      <Tooltip
        title={
          <FormattedMessage id="object_filter_number_of_posts" defaultMessage="Number of posts" />
        }
      >
        {wobject.count}
      </Tooltip>
    </div>
  </div>
);

ObjectFilterCard.propTypes = {
  wobject: PropTypes.shape().isRequired,
};

export default ObjectFilterCard;
