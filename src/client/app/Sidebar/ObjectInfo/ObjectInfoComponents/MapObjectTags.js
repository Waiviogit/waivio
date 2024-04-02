import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { Link } from 'react-router-dom';

const MapObjectTags = ({ tags }) => {
  const [showMore, setShowMore] = useState(false);

  const visibleTags = showMore ? tags : tags?.slice(0, 5);

  return (
    <React.Fragment>
      <div className="Department__title mb1">
        <FormattedMessage id="map_items_tags" formattedMessage="Tags of map items" />:{' '}
      </div>
      <div>
        {visibleTags.map(item => (
          <Tag key={`tag-${item}`} color="orange">
            <Link to={`/discover-objects/map?${item}=${item}`}>{item}</Link>
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
  tags: PropTypes.arrayOf().isRequired,
};
export default MapObjectTags;
