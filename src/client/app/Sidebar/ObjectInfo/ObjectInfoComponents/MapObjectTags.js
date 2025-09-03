import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { Link } from 'react-router-dom';

const MapObjectTags = ({ tags }) => {
  const [showMore, setShowMore] = useState(false);

  const visibleTags = showMore ? tags : tags?.slice(0, 5);
  const getItemName = tag => tag?.name || tag?.default_name || tag?.author_permlink;

  return (
    <React.Fragment>
      <div className="Department__title mb1">
        <FormattedMessage id="map_items_tags" formattedMessage="Tags of map items" />:{' '}
      </div>
      <div>
        {visibleTags.map(item => (
          <Tag
            key={`tag-${item.author_permlink}`}
            color="orange"
            style={{ whiteSpace: 'break-spaces' }}
          >
            <Link to={`/discover-objects/map?${getItemName(item)}=${getItemName(item)}`}>
              {getItemName(item)}
            </Link>
          </Tag>
        ))}
        {tags.length > 5 && !showMore && (
          <span role="presentation" className="show-more" onClick={() => setShowMore(true)}>
            <FormattedMessage id="show_more" defaultMessage="Show more" />
          </span>
        )}
      </div>
    </React.Fragment>
  );
};

MapObjectTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
export default MapObjectTags;
