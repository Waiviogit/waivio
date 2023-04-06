import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ObjectCard from '../ObjectCard';
import WeightTag from '../../WeightTag';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';

const ObjectssimilarContent = ({
  isCenterContent,
  setShowModal,
  intl,
  similarObjects,
  currWobject,
  isLoading,
}) => {
  let renderCard = <RightSidebarLoading id="RightSidebarLoading" />;

  const similarObjectsArr = similarObjects.length > 5 ? similarObjects.slice(0, 5) : similarObjects;

  if (!isLoading) {
    if (!isEmpty(similarObjects)) {
      const renderObjects = similarObjectsArr?.map(item => (
        <ObjectCard
          key={item.author_permlink}
          wobject={item}
          parent={currWobject}
          showFollow={false}
          alt={<WeightTag weight={item.weight} />}
          isNewWindow={false}
          id="ObjectCard"
        />
      ));

      const renderButtons = () =>
        !isCenterContent && (
          <div className="ObjectsRelated__more">
            <a onClick={() => setShowModal(true)} id="show_more_div">
              {intl.formatMessage({ id: 'show_more', defaultMessage: 'Show more' })}
            </a>
          </div>
        );

      const handleOpenModal = () => {
        if (isCenterContent) setShowModal(true);
      };

      renderCard = (
        <div className="SidebarContentBlock" data-test="objectsRelatedComponent">
          <div className="SidebarContentBlock__title" onClick={handleOpenModal}>
            {!isCenterContent && <i className="iconfont icon-link SidebarContentBlock__icon" />}{' '}
            {intl.formatMessage({ id: 'object_field_similar', defaultMessage: 'Similar' })}
          </div>
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
  setShowModal: PropTypes.func.isRequired,
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
