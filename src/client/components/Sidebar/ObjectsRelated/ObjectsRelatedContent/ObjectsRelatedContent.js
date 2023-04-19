import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import ObjectCard from '../../ObjectCard';
import WeightTag from '../../../WeightTag';
import RightSidebarLoading from '../../../../app/Sidebar/RightSidebarLoading';

const ObjectsRelatedContent = ({
  isCenterContent,
  intl,
  relatedObjects,
  currWobject,
  isLoading,
}) => {
  let renderCard = <RightSidebarLoading id="RightSidebarLoading" />;
  const moreObjects = relatedObjects.length > 5;
  const renderedObjects = moreObjects ? relatedObjects.slice(0, 5) : relatedObjects;
  const relatedPermlinks = currWobject?.related?.map(obj => obj.body) || [];

  if (!isLoading) {
    if (!isEmpty(renderedObjects)) {
      const renderObjects = renderedObjects?.map(item => (
        <ObjectCard
          key={item.author_permlink}
          wobject={item}
          parent={relatedPermlinks.includes(item.author_permlink) ? {} : currWobject}
          showFollow={false}
          alt={<WeightTag weight={item.weight} />}
          isNewWindow={false}
          id="ObjectCard"
        />
      ));

      const renderButtons = () =>
        !isCenterContent && (
          <div className="ObjectsRelated__more">
            <Link to={`/object/${currWobject.author_permlink}/related`} id="show_more_div">
              {intl.formatMessage({ id: 'show_more', defaultMessage: 'Show more' })}
            </Link>
          </div>
        );

      renderCard = (
        <div className="SidebarContentBlock" data-test="objectsRelatedComponent">
          <Link
            to={`/object/${currWobject.author_permlink}/related`}
            className="SidebarContentBlock__title"
          >
            {!isCenterContent && <i className="iconfont icon-link SidebarContentBlock__icon" />}{' '}
            {intl.formatMessage({ id: 'related_to_object', defaultMessage: 'Related to object' })}
          </Link>
          <div className="SidebarContentBlock__content">{renderObjects}</div>
          {renderButtons()}
        </div>
      );
    } else {
      renderCard = null;
    }
  }

  return renderCard;
};

ObjectsRelatedContent.propTypes = {
  isCenterContent: PropTypes.bool.isRequired,
  currWobject: PropTypes.shape().isRequired,
  relatedObjects: PropTypes.arrayOf(PropTypes.shape()),
  objectsState: PropTypes.shape({
    objects: PropTypes.arrayOf(PropTypes.shape()),
    skip: PropTypes.number,
    hasNext: PropTypes.bool,
    isLoading: PropTypes.bool,
  }).isRequired,
  intl: PropTypes.shape().isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default injectIntl(ObjectsRelatedContent);
