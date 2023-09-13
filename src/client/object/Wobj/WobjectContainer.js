import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get, isEmpty, isNil } from 'lodash';
import { withRouter } from 'react-router-dom';
import Wobj from './Wobj';
import { getAppendList } from '../../../store/appendStore/appendSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import {
  getObject as getObjectState,
  getObjectFetchingState,
  getWobjectIsFailed,
  getWobjectIsFatching,
  getWobjectNested,
} from '../../../store/wObjectStore/wObjectSelectors';
import { getLocale } from '../../../store/settingsStore/settingsSelectors';
import {
  getHelmetIcon,
  getIsSocial,
  getIsWaivio,
  getScreenSize,
  getSiteName,
  getWeightValue,
} from '../../../store/appStore/appSelectors';

import { getConfiguration } from '../../../store/websiteStore/websiteSelectors';
import {
  clearObjectFromStore,
  getNearbyObjects as getNearbyObjectsAction,
  getObject,
  getObjectFollowers as getObjectFollowersAction,
} from '../../../store/wObjectStore/wobjectsActions';
import {
  getRelatedWobjects,
  getWobjectExpertise as getWobjectExpertiseAction,
  setCatalogBreadCrumbs,
  setNestedWobject,
  setEditMode,
} from '../../../store/wObjectStore/wobjActions';
import {
  addAlbumToStore,
  clearRelatedPhoto,
  getAlbums,
  resetGallery,
} from '../../../store/galleryStore/galleryActions';
import { appendObject, getUpdates } from '../../../store/appendStore/appendActions';
import { setStoreActiveOption } from '../../../store/optionsStore/optionsActions';
import { resetBreadCrumb } from '../../../store/shopStore/shopActions';
import {
  getObjectName,
  getUpdateFieldName,
  prepareAlbumData,
  prepareAlbumToStore,
  showDescriptionPage,
} from '../../../common/helpers/wObjectHelper';
import NotFound from '../../statics/NotFound';
import OBJECT_TYPE from '../const/objectTypes';
import { objectFields } from '../../../common/constants/listOfFields';
import { login } from '../../../store/authStore/authActions';
import { getRate, getRewardFund } from '../../../store/appStore/appActions';

const WobjectContainer = props => {
  const [isEditMode, setIsEditMode] = useState(
    props.wobject.type === OBJECT_TYPE.PAGE &&
      props.authenticated &&
      !props.wobject[objectFields.pageContent],
  );
  const objectName = getObjectName(props.wobject);
  const newsFilter =
    props.match.params[1] === 'newsFilter' ? { newsFilter: props.match.params.itemId } : {};

  const toggleViewEditMode = () => {
    setIsEditMode(!isEditMode);
    props.setEditMode(!isEditMode);
  };

  const appendAlbum = () => {
    const formData = {
      galleryAlbum: 'Photos',
    };

    const data = prepareAlbumData(formData, props.authenticatedUserName, props.wobject);
    const album = prepareAlbumToStore(data);

    const { author } = props.appendObject(data);

    props.addAlbumToStore({ ...album, author });
  };

  useEffect(() => {
    props.getObject(props.match.params.name, props.authenticatedUserName).then(async res => {
      if (!props.isSocial) {
        if (
          props.isWaivio &&
          (await showDescriptionPage(res.value, props.locale)) &&
          !props.match.params[0]
        ) {
          props.history.push(`/object/${res.value.author_permlink}/description`);
        }
      }
      props.getAlbums(props.match.params.name);
      props.getNearbyObjects(props.match.params.name);
      props.getWobjectExpertise(newsFilter, props.match.params.name);
      props.getObjectFollowers({
        object: props.match.params.name,
        skip: 0,
        limit: 5,
        userName: props.authenticatedUserName,
      });
      props.getRelatedWobjects(props.match.params.name);
      if (isEmpty(props.updates) || isNil(props.updates) || isNil(props.match.params[1])) {
        const field = getUpdateFieldName(props.match.params[1]);

        props.getUpdates(props.match.params.name, field, 'createdAt');
      }
      props.setEditMode(false);
    });

    return () => {
      props.clearObjectFromStore();
      props.setCatalogBreadCrumbs([]);
      props.setNestedWobject({});
      props.clearRelatedPhoto();
      props.setStoreActiveOption({});
      props.resetBreadCrumb();
      props.resetGallery();
    };
  }, [props.match.params.name, props.locale, props.authenticatedUserName]);

  if (props.failed)
    return (
      <div className="main-panel">
        <NotFound
          item={props.match.params.name}
          title={'there_are_not_object_with_name'}
          titleDefault={'Sorry! There are no object with name {item} on Waivio'}
        />
      </div>
    );

  return (
    <Wobj
      route={props.route}
      isSocial={props.route.isSocial}
      authenticated={props.authenticated}
      failed={props.failed}
      authenticatedUserName={props.authenticatedUserName}
      location={props.location}
      wobject={props.wobject}
      nestedWobject={props.nestedWobject}
      isFetching={props.isFetching}
      history={props.history}
      isEditMode={isEditMode}
      toggleViewEditMode={toggleViewEditMode}
      objectName={objectName}
      appendAlbum={appendAlbum}
      helmetIcon={props.helmetIcon}
      siteName={props.siteName}
      isWaivio={props.isWaivio}
      supportedObjectTypes={props.supportedObjectTypes}
      weightValue={props.weightValue}
    />
  );
};

WobjectContainer.propTypes = {
  route: PropTypes.shape().isRequired,
  authenticatedUserName: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  location: PropTypes.shape({
    hash: PropTypes.string,
  }).isRequired,
  failed: PropTypes.bool,
  isFetching: PropTypes.bool,
  isSocial: PropTypes.bool,
  getObject: PropTypes.func.isRequired,
  resetBreadCrumb: PropTypes.func.isRequired,
  weightValue: PropTypes.number.isRequired,
  supportedObjectTypes: PropTypes.arrayOf(PropTypes.string),
  isWaivio: PropTypes.bool.isRequired,
  resetGallery: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  wobject: PropTypes.shape(),
  nestedWobject: PropTypes.shape(),
  updates: PropTypes.arrayOf(),
  clearObjectFromStore: PropTypes.func,
  setNestedWobject: PropTypes.func,
  setCatalogBreadCrumbs: PropTypes.func,
  locale: PropTypes.string,
  helmetIcon: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  getAlbums: PropTypes.func,
  appendObject: PropTypes.func,
  getUpdates: PropTypes.func,
  addAlbumToStore: PropTypes.func,
  clearRelatedPhoto: PropTypes.func,
  getNearbyObjects: PropTypes.func.isRequired,
  getWobjectExpertise: PropTypes.func.isRequired,
  getObjectFollowers: PropTypes.func.isRequired,
  getRelatedWobjects: PropTypes.func.isRequired,
  setStoreActiveOption: PropTypes.func.isRequired,
};

WobjectContainer.fetchData = async ({ store, match }) => {
  const res = await store.dispatch(login());

  return Promise.all([
    store.dispatch(getObject(match.params.name, res?.value?.name)),
    store.dispatch(getObjectFollowersAction({ object: match.params.name, skip: 0, limit: 5 })),
    store.dispatch(getRate()),
    store.dispatch(getRewardFund()),
    store.dispatch(getNearbyObjectsAction(match.params.name)),
    store.dispatch(
      getWobjectExpertiseAction(
        match.params[1] === 'newsFilter' ? { newsFilter: match.params.itemId } : {},
        match.params.name,
      ),
    ),
  ]);
};

const mapStateToProps = state => ({
  updates: getAppendList(state),
  authenticated: getIsAuthenticated(state),
  authenticatedUser: getAuthenticatedUser(state),
  authenticatedUserName: getAuthenticatedUserName(state),
  loaded: getWobjectIsFatching(state),
  failed: getWobjectIsFailed(state),
  locale: getLocale(state),
  wobject: getObjectState(state),
  nestedWobject: getWobjectNested(state),
  isFetching: getObjectFetchingState(state),
  screenSize: getScreenSize(state),
  helmetIcon: getHelmetIcon(state),
  isWaivio: getIsWaivio(state),
  isSocial: getIsSocial(state),
  supportedObjectTypes: get(getConfiguration(state), 'supported_object_types'),
  weightValue: getWeightValue(state, getObjectState(state).weight),
  siteName: getSiteName(state),
});

const mapDispatchToProps = {
  clearObjectFromStore,
  setEditMode,
  setCatalogBreadCrumbs,
  setNestedWobject,
  getObject,
  resetGallery,
  getAlbums,
  appendObject,
  getUpdates,
  addAlbumToStore,
  clearRelatedPhoto,
  getNearbyObjects: getNearbyObjectsAction,
  getWobjectExpertise: getWobjectExpertiseAction,
  getObjectFollowers: getObjectFollowersAction,
  getRelatedWobjects,
  setStoreActiveOption,
  resetBreadCrumb,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WobjectContainer));
