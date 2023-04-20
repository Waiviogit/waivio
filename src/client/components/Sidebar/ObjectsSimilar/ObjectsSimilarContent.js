import React from 'react';
import { isEmpty } from 'lodash';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ObjectCard from '../ObjectCard';
import WeightTag from '../../WeightTag';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';

const ObjectssimilarContent = ({
  isCenterContent,
  intl,
  similarObjects,
  currWobject,
  isLoading,
}) => {
  let renderCard = <RightSidebarLoading id="RightSidebarLoading" />;
  const moreObjects = similarObjects.length > 5;
  const similarObjectsArr = moreObjects ? similarObjects.slice(0, 5) : similarObjects;

  if (!isLoading) {
    if (!isEmpty(similarObjects)) {
      const renderObjects = similarObjectsArr?.map(item => (
        <ObjectCard
          key={item.author_permlink}
          wobject={item}
          showFollow={false}
          alt={<WeightTag weight={item.weight} />}
          isNewWindow={false}
          id="ObjectCard"
        />
      ));

      const renderButtons = () =>
        !isCenterContent && (
          <div className="ObjectsRelated__more">
            <Link to={`/object/${currWobject.author_permlink}/similar`} id="show_more_div">
              {intl.formatMessage({ id: 'show_more', defaultMessage: 'Show more' })}
            </Link>
          </div>
        );

      renderCard = (
        <div className="SidebarContentBlock" data-test="objectsRelatedComponent">
          <Link
            to={`/object/${currWobject.author_permlink}/similar`}
            className="SidebarContentBlock__title"
          >
            {!isCenterContent && (
              <Icon type="block" className="iconfont icon-link SidebarContentBlock__icon" />
            )}{' '}
            {intl.formatMessage({ id: 'object_field_similar', defaultMessage: 'Similar' })}
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

ObjectssimilarContent.propTypes = {
  isCenterContent: PropTypes.bool.isRequired,
  currWobject: PropTypes.shape().isRequired,
  similarObjects: PropTypes.arrayOf(PropTypes.shape()),
  objectsState: PropTypes.shape({
    objects: PropTypes.arrayOf(PropTypes.shape()),
    skip: PropTypes.number,
    hasNext: PropTypes.bool,
    isLoading: PropTypes.bool,
  }).isRequired,
  intl: PropTypes.shape().isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default injectIntl(ObjectssimilarContent);
