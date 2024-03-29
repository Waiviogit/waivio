import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getProfileTags } from '../../../../store/feedStore/feedSelectors';
import { getUserProfileBlogTags } from '../../../../waivioApi/ApiClient';
import { setProfileTags } from '../../../../store/feedStore/feedActions';
import './FilterPosts.less';

const FilterPosts = ({ setProfileFilters, name }) => {
  const [hasMore, setHasMore] = useState(false);
  const tags = useSelector(getProfileTags);

  const dispatch = useDispatch();
  let skip = 0;
  const limit = 10;

  useEffect(() => {
    getUserProfileBlogTags(name, { limit, skip }).then(res => {
      setHasMore(res.hasMore);
      dispatch(setProfileTags(res.tags));
    });
  }, []);

  const getMoreTags = () => {
    if (hasMore) {
      if (tags.length >= limit) {
        skip += tags.length;
      }
      getUserProfileBlogTags(name, { limit, skip }).then(res => {
        setHasMore(res.hasMore);
        dispatch(setProfileTags([...tags, ...res.tags]));
      });
    }
  };

  return (
    <>
      {!isEmpty(tags) ? (
        <div className="FilterPosts">
          <div className="FilterPosts__title">
            <i className="iconfont icon-trysearchlist" />
            <FormattedMessage id="filter_posts" defaultMessage="Filter posts" />
          </div>
          <div className="FilterPosts__tags-list">
            {tags?.map(tag => (
              <div key={tag.author_permlink} className="FilterPosts__tag">
                <Checkbox onChange={() => setProfileFilters(tag.author_permlink)}>
                  {tag.name}
                </Checkbox>{' '}
                ({tag.counter})
              </div>
            ))}
            {tags.length > 9 && hasMore && (
              <div className="FilterPosts__showMore" role="presentation" onClick={getMoreTags}>
                <FormattedMessage id="show_more" defaultMessage="show more" />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

FilterPosts.propTypes = {
  setProfileFilters: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default FilterPosts;
