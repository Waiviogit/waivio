import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'lodash';
import { withRouter } from 'react-router-dom';
import { parseJSON } from '../../../common/helpers/parseJSON';
import { getObjectPosts } from '../../../store/feedStore/feedActions';
import { prepareMenuItems } from '../../social-gifts/SocialProduct/SocialMenuItems/SocialMenuItems';
import Wobj from './Wobj';
import { getAppendList } from '../../../store/appendStore/appendSelectors';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import {
  getIsEditMode,
  getObject as getObjectState,
  getWobjectIsFailed,
} from '../../../store/wObjectStore/wObjectSelectors';
import { getLocale } from '../../../store/settingsStore/settingsSelectors';
import { getCurrentHost, getIsSocial, getWeightValue } from '../../../store/appStore/appSelectors';

import {
  clearObjectFromStore,
  getNearbyObjects as getNearbyObjectsAction,
  getObject,
  getObjectFollowers as getObjectFollowersAction,
  getAddOns,
  getSimilarObjects,
  getRelatedObjects,
  getMenuItemContent,
  getProductInfo,
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
  getRelatedAlbum,
  resetGallery,
} from '../../../store/galleryStore/galleryActions';
import { getUpdates } from '../../../store/appendStore/appendActions';
import { setStoreActiveOption } from '../../../store/optionsStore/optionsActions';
import { resetBreadCrumb } from '../../../store/shopStore/shopActions';
import { getUpdateFieldName, showDescriptionPage } from '../../../common/helpers/wObjectHelper';
import NotFound from '../../statics/NotFound';
import { login } from '../../../store/authStore/authActions';
import { getRate, getRewardFund } from '../../../store/appStore/appActions';

const WobjectContainer = props => {
  const isEditMode = useSelector(getIsEditMode);
  const name = props.match.params.name;
  const newsFilter =
    props.match.params[1] === 'newsFilter' ? { newsFilter: props.match.params.itemId } : {};

  const toggleViewEditMode = () => {
    props.setEditMode(!isEditMode);
  };

  useEffect(() => {
    props.getObject(name, props.authenticatedUserName).then(async res => {
      if (props.currHost.includes('waivio')) {
        if ((await showDescriptionPage(res.value, props.locale)) && !props.match.params[0]) {
          props.history.push(`/object/${res.value.author_permlink}/description`);
        }
      }
      props.getAlbums(name);
      props.getRelatedAlbum(name);
      props.getNearbyObjects(name);
      props.getWobjectExpertise(newsFilter, name);
      props.getObjectFollowers({
        object: name,
        skip: 0,
        limit: 5,
        userName: props.authenticatedUserName,
      });
      props.getRelatedWobjects(name);
      if (isEmpty(props.updates) || isNil(props.updates) || isNil(props.match.params[1])) {
        const field = getUpdateFieldName(props.match.params[1]);

        props.getUpdates(name, field, 'createdAt');
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
      props.setEditMode(false);
    };
  }, [name, props.locale, props.authenticatedUserName]);

  if (props.failed)
    return (
      <div className="main-panel">
        <NotFound
          item={name}
          title={'there_are_not_object_with_name'}
          titleDefault={'Sorry! There are no object with name {item} on Waivio'}
        />
      </div>
    );

  return (
    <Wobj
      route={props.route}
      isSocial={props.route.isSocial}
      authenticatedUserName={props.authenticatedUserName}
      isEditMode={isEditMode}
      toggleViewEditMode={toggleViewEditMode}
      weightValue={props.weightValue}
    />
  );
};

WobjectContainer.propTypes = {
  route: PropTypes.shape().isRequired,
  authenticatedUserName: PropTypes.string.isRequired,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  location: PropTypes.shape({
    hash: PropTypes.string,
  }).isRequired,
  failed: PropTypes.bool,
  isSocial: PropTypes.bool,
  getObject: PropTypes.func.isRequired,
  resetBreadCrumb: PropTypes.func.isRequired,
  weightValue: PropTypes.number.isRequired,
  resetGallery: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  updates: PropTypes.arrayOf(),
  clearObjectFromStore: PropTypes.func,
  setNestedWobject: PropTypes.func,
  setCatalogBreadCrumbs: PropTypes.func,
  locale: PropTypes.string,
  currHost: PropTypes.string,
  getAlbums: PropTypes.func,
  getRelatedAlbum: PropTypes.func,
  getUpdates: PropTypes.func,
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
    store.dispatch(getObject(match.params.name, res?.value?.name)).then(response => {
      let promises = [
        store.dispatch(
          getObjectPosts({
            object: match.params.name,
            username: match.params.name,
            limit: 20,
            newsPermlink: response.value?.newsFeed?.permlink,
          }),
        ),

        store.dispatch(getAlbums(match.params.name)),
        store.dispatch(getRelatedAlbum(match.params.name)),
      ];

      if (response.value.object_type === 'product') {
        const items = prepareMenuItems(response.value.menuItem)[0];

        promises = [
          ...promises,
          store.dispatch(getAddOns(response.value.addOn?.map(obj => obj.body))),
          store.dispatch(getSimilarObjects(match.params.name)),
          store.dispatch(getRelatedObjects(match.params.name)),
          store.dispatch(getMenuItemContent(parseJSON(items.body).linkToObject)),
          store.dispatch(getProductInfo(response.value)),
        ];
      }

      return Promise.allSettled(promises);
    }),
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
  authenticatedUserName: getAuthenticatedUserName(state),
  failed: getWobjectIsFailed(state),
  locale: getLocale(state),
  isSocial: getIsSocial(state),
  weightValue: getWeightValue(state, getObjectState(state).weight),
  currHost: getCurrentHost(state),
});

const mapDispatchToProps = {
  clearObjectFromStore,
  setEditMode,
  setCatalogBreadCrumbs,
  setNestedWobject,
  getObject,
  resetGallery,
  getAlbums,
  getRelatedAlbum,
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
