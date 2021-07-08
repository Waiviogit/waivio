import React, { useState } from 'react';
import { Checkbox } from 'antd';
import { chunk, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getBlogFiltersList } from '../../../../store/feedStore/feedSelectors';

import './FilterPosts.less';

const FilterPosts = ({ setProfileFilters, name, tags }) => {
  if (isEmpty(tags)) return null;

  const [showMore, setShowMore] = useState(false);
  const tagsList = showMore ? tags : chunk(tags, 10)[0];

  return (
    <div className="FilterPosts">
      <div className="FilterPosts__title">
        <i className="iconfont icon-trysearchlist" />
        <FormattedMessage id="filter_posts" defaultMessage="Filter posts" />
      </div>
      <div className="FilterPosts__tags-list">
        {tagsList.map(tag => (
          <div key={tag.author_permlink} className="FilterPosts__tag">
            <Checkbox onChange={() => setProfileFilters(tag.author_permlink)}>{tag.name}</Checkbox>{' '}
            ({tag.counter})
          </div>
        ))}
        {tags.length > 9 && !showMore && (
          <div
            className="FilterPosts__showMore"
            role="presentation"
            onClick={() => setShowMore(true)}
          >
            <FormattedMessage id="show_more" defaultMessage="show more" />
          </div>
        )}
      </div>
    </div>
  );
};

FilterPosts.propTypes = {
  name: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setProfileFilters: PropTypes.func.isRequired,
};

export default connect((state, props) => ({
  tags: getBlogFiltersList(state, props.name),
}))(FilterPosts);
