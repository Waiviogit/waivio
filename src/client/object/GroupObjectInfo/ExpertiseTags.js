import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getObjectInfo } from '../../../waivioApi/ApiClient';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import ObjectCard from '../../components/Sidebar/ObjectCard';

const ExpertiseTags = ({ groupExpertise, authorPermlink }) => {
  const [showMore, setShowMore] = useState(false);
  const [objects, setObjects] = useState([]);
  const locale = useSelector(getUsedLocale);

  useEffect(() => {
    getObjectInfo(groupExpertise, locale).then(res => setObjects(res.wobjects));
  }, [groupExpertise.length, authorPermlink]);

  const visibleTags = showMore ? objects : objects?.slice(0, 5);

  return (
    <div className={'ExpertiseTags'}>
      <div className="Department__title mb1">
        <FormattedMessage id="expertise_tags" formattedMessage="Expertise tags" />:{' '}
      </div>
      <div>
        {visibleTags.map(item => (
          <ObjectCard key={item.authorPermlink} wobject={item} showFollow={false} />
        ))}
        {objects.length > 5 && !showMore && (
          <span role="presentation" className="show-more" onClick={() => setShowMore(true)}>
            <FormattedMessage id="show_more" defaultMessage="Show more" />
          </span>
        )}
      </div>
    </div>
  );
};

ExpertiseTags.propTypes = {
  groupExpertise: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  authorPermlink: PropTypes.string.isRequired,
};

export default ExpertiseTags;
