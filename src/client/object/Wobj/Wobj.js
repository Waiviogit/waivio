import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import ScrollToTopOnMount from '../../components/Utils/ScrollToTopOnMount';
import { getObjectType } from '../../../common/helpers/wObjectHelper';
import SocialProduct from '../../social-gifts/SocialProduct/SocialProduct';
import WidgetContent from '../../social-gifts/WidgetContent/WidgetContent';
import ObjectNewsFeed from '../../social-gifts/FeedMasonry/ObjectNewsFeed';
import Checklist from '../../social-gifts/Checklist/Checklist';
import Loading from '../../components/Icon/Loading';
import WobjectView from './WobjectView';

const Wobj = ({
  authenticatedUserName: userName,
  wobject,
  isEditMode,
  toggleViewEditMode,
  route,
  handleFollowClick,
  appendAlbum,
  nestedWobject,
  isWaivio,
  supportedObjectTypes,
  isSocial,
  weightValue,
}) => {
  useEffect(() => {
    if (!isWaivio) {
      const objectType = getObjectType(wobject);

      if (!isEmpty(wobject) && supportedObjectTypes.includes(objectType) && window?.gtag)
        window.gtag('event', `view_${objectType}`);
    }
  }, [wobject.author_permlink]);

  const getWobjView = useCallback(() => {
    if (isEmpty(wobject)) return <Loading />;

    if (
      !isSocial ||
      !['book', 'product', 'person', 'business', 'widget', 'page', 'list', 'newsfeed'].includes(
        wobject.object_type,
      ) ||
      (isSocial && isEditMode)
    )
      return (
        <WobjectView
          authenticatedUserName={userName}
          wobject={wobject}
          isEditMode={isEditMode}
          toggleViewEditMode={toggleViewEditMode}
          route={route}
          handleFollowClick={handleFollowClick}
          appendAlbum={appendAlbum}
          nestedWobject={nestedWobject}
          weightValue={weightValue}
        />
      );

    switch (wobject?.object_type) {
      case 'book':
      case 'product':
      case 'person':
      case 'business':
        return <SocialProduct toggleViewEditMode={toggleViewEditMode} />;
      case 'widget':
        return <WidgetContent />;
      case 'page':
      case 'list':
        return <Checklist />;
      case 'newsfeed':
        return <ObjectNewsFeed />;

      default:
        return null;
    }
  }, [
    wobject,
    userName,
    isEditMode,
    toggleViewEditMode,
    route,
    handleFollowClick,
    appendAlbum,
    nestedWobject,
    toggleViewEditMode,
  ]);

  return (
    <div className="main-panel">
      <ScrollToTopOnMount />
      {getWobjView()}
    </div>
  );
};

Wobj.propTypes = {
  route: PropTypes.shape().isRequired,
  authenticatedUserName: PropTypes.string.isRequired,
  wobject: PropTypes.shape(),
  nestedWobject: PropTypes.shape(),
  supportedObjectTypes: PropTypes.arrayOf(PropTypes.string),
  isEditMode: PropTypes.bool.isRequired,
  isWaivio: PropTypes.bool.isRequired,
  isSocial: PropTypes.bool,
  toggleViewEditMode: PropTypes.func,
  handleFollowClick: PropTypes.func,
  weightValue: PropTypes.number.isRequired,
  appendAlbum: PropTypes.func,
};

Wobj.defaultProps = {
  wobject: {},
  toggleViewEditMode: () => {},
  handleFollowClick: () => {},
  appendAlbum: () => {},
  supportedObjectTypes: [],
};

export default Wobj;
