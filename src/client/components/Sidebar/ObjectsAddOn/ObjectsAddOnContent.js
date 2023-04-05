import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ObjectCard from '../ObjectCard';
import WeightTag from '../../WeightTag';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';

const ObjectsAddOnContent = ({
  isCenterContent,
  setShowModal,
  intl,
  addOnObjects,
  currWobject,
  isLoading,
}) => {
  let renderCard = <RightSidebarLoading id="RightSidebarLoading" />;

  const addOnObjectsArr = addOnObjects.length > 5 ? addOnObjects.slice(0, 5) : addOnObjects;

  if (!isLoading) {
    if (!isEmpty(addOnObjects)) {
      const renderObjects = addOnObjectsArr?.map(item => (
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
            {!isCenterContent && (
              <img
                src={'/images/icons/add-on-icon.svg'}
                style={{ width: '18px', height: '18px' }}
                alt="add on icon"
                className=" icon-link SidebarContentBlock__icon"
              />
            )}{' '}
            {intl.formatMessage({ id: 'object_field_add-on', defaultMessage: 'Add-on' })}
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

ObjectsAddOnContent.propTypes = {
  isCenterContent: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  currWobject: PropTypes.shape().isRequired,
  addOnObjects: PropTypes.arrayOf(PropTypes.shape()),
  objectsState: PropTypes.shape({
    objects: PropTypes.arrayOf(PropTypes.shape()),
    skip: PropTypes.number,
    hasNext: PropTypes.bool,
    isLoading: PropTypes.bool,
  }).isRequired,
  intl: PropTypes.shape().isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default injectIntl(ObjectsAddOnContent);
