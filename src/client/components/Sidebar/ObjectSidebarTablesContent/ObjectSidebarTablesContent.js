import React from 'react';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ObjectCard from '../ObjectCard';
import WeightTag from '../../WeightTag';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';

const ObjectsSidebarTablesContent = ({
  isCenterContent,
  objects,
  title,
  linkTo,
  icon,
  isLoading,
}) => {
  let renderCard = <RightSidebarLoading id="RightSidebarLoading" />;
  const moreObjects = objects?.length > 5;
  const ObjectsArr = moreObjects ? objects?.slice(0, 5) : objects;

  if (!isLoading) {
    if (!isEmpty(objects)) {
      const renderObjects = ObjectsArr?.map(item => (
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
            <Link to={linkTo} id="show_more_div">
              <FormattedMessage id="show_more" defaultMessage="Show more" />
            </Link>
          </div>
        );

      renderCard = (
        <div className="SidebarContentBlock" data-test="objectsRelatedComponent">
          <Link to={linkTo} className="SidebarContentBlock__title">
            {!isCenterContent && icon} {title}
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

ObjectsSidebarTablesContent.propTypes = {
  isCenterContent: PropTypes.bool.isRequired,
  linkTo: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.object]),
  objects: PropTypes.arrayOf(PropTypes.shape()),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.object]),
  isLoading: PropTypes.bool,
};

export default ObjectsSidebarTablesContent;
