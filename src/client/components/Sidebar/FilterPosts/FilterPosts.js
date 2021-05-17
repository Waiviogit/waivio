import React, { useState } from 'react';
import { Checkbox } from 'antd';
import { chunk } from 'lodash';
import PropTypes from 'prop-types';

import './FilterPosts.less';

const FilterPosts = ({ tags, setProfileFilters }) => {
  const [showMore, setShowMore] = useState(false);
  const tagsList = showMore ? tags : chunk(tags, 10)[0];

  return (
    <div className="FilterPosts">
      <div className="FilterPosts__title">
        <i className="iconfont icon-trysearchlist" /> Filter posts
      </div>
      <div className="FilterPosts__tags-list">
        {tagsList.map(tag => (
          <div key={tag.author_permlink} className="FilterPosts__tag">
            <Checkbox onChange={() => setProfileFilters(tag.author_permlink)}>
              {tag.name} ({tag.counter})
            </Checkbox>
          </div>
        ))}
        {tags.length > 9 && !showMore && (
          <div
            className="FilterPosts__showMore"
            role="presentation"
            onClick={() => setShowMore(true)}
          >
            show more
          </div>
        )}
      </div>
    </div>
  );
};

FilterPosts.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setProfileFilters: PropTypes.func.isRequired,
};

export default FilterPosts;
