import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';

import ObjectCard from '../../ObjectCard';
import WeightTag from '../../../WeightTag';
import RightSidebarLoading from '../../../../app/Sidebar/RightSidebarLoading';

const ObjectsRelatedContent = ({
  isCenterContent,
  setShowModal,
  intl,
  objects,
  currWobject,
  isLoading,
}) => {
  let renderCard = <RightSidebarLoading id="RightSidebarLoading" />;

  if (!isLoading) {
    if (!isEmpty(objects)) {
      const renderObjects = objects.map(item => (
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
            {intl.formatMessage({ id: 'related_to_object', defaultMessage: 'Related to object' })}
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

ObjectsRelatedContent.propTypes = {
  isCenterContent: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  currWobject: PropTypes.shape().isRequired,
  objectsState: PropTypes.shape({
    objects: PropTypes.arrayOf(PropTypes.shape()),
    skip: PropTypes.number,
    hasNext: PropTypes.bool,
    isLoading: PropTypes.bool,
  }).isRequired,
  objects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  intl: PropTypes.shape().isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default injectIntl(ObjectsRelatedContent);
