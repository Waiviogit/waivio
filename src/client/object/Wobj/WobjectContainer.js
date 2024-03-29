import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'lodash';
import { withRouter } from 'react-router-dom';
import { parseJSON } from '../../../common/helpers/parseJSON';
import {
  getObjectPosts,
  getTiktokPreviewAction,
  setFirstLoading,
} from '../../../store/feedStore/feedActions';
import { prepareMenuItems } from '../../social-gifts/SocialProduct/SocialMenuItems/SocialMenuItems';
import Wobj from './Wobj';
import { getAppendList } from '../../../store/appendStore/appendSelectors';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import {
  getIsEditMode,
  getObject as getObjectState,
  getWobjectIsFailed,
  getObjectPermlinkFromState,
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
  getMenuItemContent,
  getProductInfo,
  getRelatedObjectsAction,
} from '../../../store/wObjectStore/wobjectsActions';
import {
  getRelatedWobjects,
  getWobjectExpertise as getWobjectExpertiseAction,
  setCatalogBreadCrumbs,
  setNestedWobject,
  setEditMode,
  resetWobjectExpertise,
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
import {
  getUpdateFieldName,
  showDescriptionPage,
  sortListItems,
} from '../../../common/helpers/wObjectHelper';
import NotFound from '../../statics/NotFound';
import { getRate, getRewardFund } from '../../../store/appStore/appActions';
import { listOfSocialObjectTypes } from '../../../common/constants/listOfObjectTypes';

const WobjectContainer = props => {
  const isEditMode = useSelector(getIsEditMode);
  const name = props.match.params.name;
  const newsFilter =
    props.match.params[1] === 'newsFilter' ? { newsFilter: props.match.params.itemId } : {};
  const toggleViewEditMode = () => {
    props.setEditMode(!isEditMode);
  };

  useEffect(() => {
    if (name !== props.wobjPermlink || props.locale !== 'en-US') {
      props.getObject(name, props.authenticatedUserName).then(async res => {
        if (props.currHost?.includes('waivio')) {
          if ((await showDescriptionPage(res.value, props.locale)) && !props.match.params[0]) {
            props.history.push(`/object/${res.value.author_permlink}/description`);
          }
        }

        if (props.isSocial && listOfSocialObjectTypes?.includes(res.value.object_type)) {
          if (isEmpty(props.updates) || isNil(props.updates) || isNil(props.match.params[1])) {
            const field = getUpdateFieldName(props.match.params[1]);

            props.getUpdates(name, field, 'createdAt');
          }
        }
        if (
          (props.isSocial &&
            !['page', 'newsfeed', 'widget', 'product']?.includes(res.value.object_type)) ||
          !props.isSocial
        ) {
          props.getNearbyObjects(name);
          props.getWobjectExpertise(newsFilter, name, true);
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
        }
        if (
          (props.isSocial && !['page', 'newsfeed', 'widget']?.includes(res.value.object_type)) ||
          !props.isSocial
        ) {
          props.getAlbums(name);
          props.getRelatedAlbum(name);
        }
      });
    }

    return () => {
      props.clearObjectFromStore();
      props.setCatalogBreadCrumbs([]);
      props.setNestedWobject({});
      props.clearRelatedPhoto();
      props.setStoreActiveOption({});
      props.resetBreadCrumb();
      props.resetGallery();
      props.resetWobjectExpertise();
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
  authenticatedUserName: PropTypes.string,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  location: PropTypes.shape({
    hash: PropTypes.string,
  }).isRequired,
  failed: PropTypes.bool,
  isSocial: PropTypes.bool,
  getObject: PropTypes.func.isRequired,
  resetBreadCrumb: PropTypes.func.isRequired,
  resetWobjectExpertise: PropTypes.func.isRequired,
  weightValue: PropTypes.number.isRequired,
  resetGallery: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  updates: PropTypes.arrayOf(PropTypes.shape({})),
  clearObjectFromStore: PropTypes.func,
  setNestedWobject: PropTypes.func,
  setCatalogBreadCrumbs: PropTypes.func,
  locale: PropTypes.string,
  wobjPermlink: PropTypes.string,
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
  const objName = match.params.name;

  return Promise.allSettled([
    store.dispatch(getObject(objName)).then(response => {
      let promises = [
        store
          .dispatch(
            getObjectPosts({
              object: objName,
              username: objName,
              limit: 30,
              newsPermlink: response.value?.newsFeed?.permlink,
            }),
          )
          .then(resp =>
            Promise.all([
              store.dispatch(getTiktokPreviewAction(resp.value)),
              store.dispatch(setFirstLoading(false)),
            ]),
          ),
      ];

      if (listOfSocialObjectTypes?.includes(response.value.object_type)) {
        const customSort = isEmpty(response.value?.sortCustom?.include)
          ? response.value.menuItem.map(i => i.permlink)
          : response.value?.sortCustom?.include;
        const items = sortListItems(prepareMenuItems(response.value.menuItem), customSort)[0];

        promises = [
          ...promises,
          store.dispatch(getAddOns(response.value.addOn?.map(obj => obj?.body))),
          store.dispatch(getSimilarObjects(objName)),
          store.dispatch(getRelatedObjectsAction(objName)),
          store.dispatch(getMenuItemContent(parseJSON(items?.body)?.linkToObject)),
          store.dispatch(getProductInfo(response.value)),
        ];
      }

      return Promise.allSettled(promises);
    }),
    store.dispatch(getObjectFollowersAction({ object: objName, skip: 0, limit: 5 })),
    store.dispatch(getRate()),
    store.dispatch(getRewardFund()),
    store.dispatch(getNearbyObjectsAction(objName)),
    store.dispatch(getAlbums(objName)),
    store.dispatch(getRelatedAlbum(objName)),
    store.dispatch(
      getWobjectExpertiseAction(
        match.params[1] === 'newsFilter' ? { newsFilter: match.params.itemId } : {},
        objName,
        true,
      ),
    ),
  ]);
};

const mapStateToProps = state => ({
  updates: getAppendList(state),
  authenticatedUserName: getAuthenticatedUserName(state),
  wobjPermlink: getObjectPermlinkFromState(state),
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
  resetWobjectExpertise,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WobjectContainer));
