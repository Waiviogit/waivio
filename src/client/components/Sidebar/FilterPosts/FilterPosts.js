import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';
import { getProfileTags } from '../../../../store/feedStore/feedSelectors';
import { getUserProfileBlogTags } from '../../../../waivioApi/ApiClient';
import { setProfileTags } from '../../../../store/feedStore/feedActions';
import './FilterPosts.less';
import useQuery from '../../../../hooks/useQuery';

const FilterPosts = ({ setProfileFilters, name }) => {
  const [hasMore, setHasMore] = useState(false);
  const query = useQuery();
  const queryTags = query.get('tags');
  const [filters, setFilters] = useState(queryTags?.split('/') || []);
  const tags = useSelector(getProfileTags);

  const history = useHistory();

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

  const handleTagSelect = (e, tag) => {
    setProfileFilters(tag.author_permlink);
    const isHas = filters.includes(tag.author_permlink);

    const newFilters = isHas
      ? filters?.filter(t => t !== tag.author_permlink)
      : [...filters, tag.author_permlink];

    setFilters(newFilters);
    const url = isEmpty(newFilters) ? `@${name}` : `@${name}?tags=${newFilters?.join('/')}`;

    history?.push(url);
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
                <Checkbox
                  checked={filters?.includes(tag.author_permlink)}
                  onChange={e => handleTagSelect(e, tag)}
                >
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
