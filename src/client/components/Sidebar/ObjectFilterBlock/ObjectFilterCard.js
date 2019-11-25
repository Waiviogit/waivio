import React from 'react';
import { Checkbox, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ObjectCard from '../ObjectCard';
import './ObjectFilterBlock.less';

const ObjectFilterCard = ({ wobjectData, setObjectFilters }) => (
  <div className="ObjectFilterCard">
    <div className="ObjectFilterCard__checkbox-wrap">
      <div className="ObjectFilterCard__checkbox-wrap-item">
        <Checkbox onChange={() => setObjectFilters(wobjectData.author_permlink)} />
      </div>
      <ObjectCard
        key={wobjectData.wobject.author_permlink}
        wobject={wobjectData.wobject}
        showFollow={false}
      />
    </div>
    <div className="ObjectFilterCard__count">
      <Tooltip
        title={
          <FormattedMessage id="object_filter_number_of_posts" defaultMessage="Number of posts" />
        }
      >
        {wobjectData.posts_count}
      </Tooltip>
    </div>
  </div>
);

ObjectFilterCard.propTypes = {
  wobjectData: PropTypes.shape().isRequired,
  setObjectFilters: PropTypes.func.isRequired,
};

export default ObjectFilterCard;
