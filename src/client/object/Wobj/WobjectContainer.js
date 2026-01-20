import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty, isNil, has } from 'lodash';
import { withRouter } from 'react-router-dom';
import { setGoogleTagEvent } from '../../../common/helpers';
import { parseJSON } from '../../../common/helpers/parseJSON';
import {
  getObjectPosts,
  getTiktokPreviewAction,
  setFirstLoading,
} from '../../../store/feedStore/feedActions';
import { getCoordinates } from '../../../store/userStore/userActions';
import { getObjectInfo } from '../../../waivioApi/ApiClient';
import { prepareMenuItems } from '../../social-gifts/SocialProduct/SocialMenuItems/SocialMenuItems';
import Wobj from './Wobj';
import { getAppendList, getAbortController } from '../../../store/appendStore/appendSelectors';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import {
  getIsEditMode,
  getObject as getObjectState,
  getWobjectIsFailed,
  getObjectPermlinkFromState,
} from '../../../store/wObjectStore/wObjectSelectors';
import { getLocale } from '../../../store/settingsStore/settingsSelectors';
import {
  getCurrentHost,
  getIsSocial,
  getShowPostModal,
  getWeightValue,
} from '../../../store/appStore/appSelectors';

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
  setAuthors,
  resetObjState,
} from '../../../store/wObjectStore/wobjActions';
import {
  addAlbumToStore,
  clearRelatedPhoto,
  getAlbums,
  getRelatedAlbum,
  resetGallery,
} from '../../../store/galleryStore/galleryActions';
import { getUpdates, setAbortController } from '../../../store/appendStore/appendActions';
import { setStoreActiveOption } from '../../../store/optionsStore/optionsActions';
import { resetBreadCrumb } from '../../../store/shopStore/shopActions';
import {
  getUpdateFieldName,
  showDescriptionPage,
  sortListItems,
  parseWobjectField,
  isOldInstacartProgram,
  getPreferredInstacartItem,
} from '../../../common/helpers/wObjectHelper';
import NotFound from '../../statics/NotFound';
import { listOfSocialObjectTypes } from '../../../common/constants/listOfObjectTypes';

class WobjectContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clickCount: 0,
      instacardAff: null,
    };
    this.abortController = new AbortController();
  }

  componentDidMount() {
    this.getWobjInfo();
    // Set the initial abort controller in the store
    this.props.setAbortController(this.abortController);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.match.params.name !== this.props.match.params.name) {
      if (this.props.controller) this.props.controller.abort();
      if (this.abortController) this.abortController.abort();
      this.abortController = new AbortController();
      this.props.setAbortController(this.abortController);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.name !== this.props.match.params.name ||
      prevProps.locale !== this.props.locale
    ) {
      const element = document.getElementById('standard-instacart-widget-v1');

      this.props.resetObjState();
      if (element) element.remove();

      this.getWobjInfo();

      // If locale changed but wobject name didn't, we still need to update the controller
      if (
        prevProps.locale !== this.props.locale &&
        prevProps.match.params.name === this.props.match.params.name
      ) {
        if (this.abortController) this.abortController.abort();
        this.abortController = new AbortController();
        this.props.setAbortController(this.abortController);
      }
    }

    if (prevProps.showPostModal !== this.props.showPostModal) {
      if (this.props.showPostModal) {
        const element = document.getElementById('standard-instacart-widget-v1');

        if (element) element.remove();
      } else {
        const instacardAff = this.state.instacardAff ? this.state.instacardAff : null;

        this.setInstacardScript(instacardAff);
      }
    }
  }

  componentWillUnmount() {
    this.props.clearObjectFromStore();
    this.props.setCatalogBreadCrumbs([]);
    this.props.setNestedWobject({});
    this.props.clearRelatedPhoto();
    this.props.setStoreActiveOption({});
    this.props.resetBreadCrumb();
    this.props.resetGallery();
    this.props.resetWobjectExpertise();
    this.props.setEditMode(false);
    const element = document.getElementById('standard-instacart-widget-v1');

    // Abort all pending requests
    if (this.props.controller) this.props.controller.abort();
    if (this.abortController) this.abortController.abort();
    if (element) element.remove();
  }

  setInstacardScript = async instacardAff => {
    const element = document.getElementById('standard-instacart-widget-v1');

    if (element) await element.remove();

    if (instacardAff && isOldInstacartProgram(instacardAff) && typeof document !== 'undefined') {
      const fjs = document.getElementsByTagName('script')[0];
      const js = document.createElement('script');

      js.id = 'standard-instacart-widget-v1';
      js.src = 'https://widgets.instacart.com/widget-bundle-v2.js';
      js.async = true;
      js.dataset.source_origin = 'affiliate_hub';

      js.onload = () => {
        if (window.InstacartWidget) {
          window.InstacartWidget.init();

          try {
            window.InstacartWidget.on('click', () => {
              this.setState({ clickCount: this.state.clickCount + 1 });
            });
          } catch (e) {
            console.error(e);
          }
        }
      };

      await fjs.parentNode.insertBefore(js, fjs);
    }
  };

  getWobjInfo = () => {
    const name = this.props.match.params.name;
    const newsFilter =
      this.props.match.params[1] === 'newsFilter'
        ? { newsFilter: this.props.match.params.itemId }
        : {};

    this.props.setEditMode(false);
    const element = document.getElementById('standard-instacart-widget-v1');

    if (element) element.remove();

    this.props.getObject(name, this.props.authenticatedUserName).then(async res => {
      const isRecipe = res.value.object_type === 'recipe';
      const instacardAff =
        isRecipe && res?.value?.affiliateLinks
          ? getPreferredInstacartItem(res?.value?.affiliateLinks)
          : null;

      await this.setState({ instacardAff });

      if (instacardAff && isOldInstacartProgram(instacardAff) && typeof document !== 'undefined') {
        const fjs = document.getElementsByTagName('script')[0];
        const js = document.createElement('script');

        js.id = 'standard-instacart-widget-v1';
        js.src = 'https://widgets.instacart.com/widget-bundle-v2.js';
        js.async = true;
        js.dataset.source_origin = 'affiliate_hub';

        await fjs.parentNode.insertBefore(js, fjs);
      }

      if (this.props.currHost?.includes('waivio')) {
        if (
          (await showDescriptionPage(res.value, this.props.locale)) &&
          !this.props.match.params[0]
        ) {
          this.props.history.push(`/object/${res.value.author_permlink}/description`);
        }
      }

      if (this.props.isSocial && listOfSocialObjectTypes?.includes(res.value.object_type)) {
        if (
          isEmpty(this.props.updates) ||
          isNil(this.props.updates) ||
          isNil(this.props.match.params[1])
        ) {
          const field = getUpdateFieldName(this.props.match.params[1]);

          this.props.getUpdates(name, field, 'createdAt');
        }
      }
      if (
        (this.props.isSocial &&
          !['page', 'newsfeed', 'widget', 'product']?.includes(res.value.object_type)) ||
        !this.props.isSocial
      ) {
        if (res.value.map) {
          this.props.getNearbyObjects(name);
          this.props.getCoordinates();
        }

        if ((res.value.object_type !== 'map' && this.props.isSocial) || !this.props.isSocial) {
          this.props.getWobjectExpertise(newsFilter, name, true);
          this.props.getObjectFollowers({
            object: name,
            skip: 0,
            limit: 5,
            userName: this.props.authenticatedUserName,
          });
          this.props.getRelatedWobjects(name);
        }
        if (
          ((res.value.object_type !== 'map' && this.props.isSocial) || !this.props.isSocial) &&
          (isEmpty(this.props.updates) ||
            isNil(this.props.updates) ||
            isNil(this.props.match.params[1]))
        ) {
          const field = getUpdateFieldName(this.props.match.params[1]);

          this.props.getUpdates(name, field, 'createdAt');
        }
      }
      if (
        (this.props.isSocial &&
          !['page', 'newsfeed', 'widget', 'map']?.includes(res.value.object_type)) ||
        !this.props.isSocial
      ) {
        this.props.getRelatedAlbum(name);
      }
      this.props.getAlbums(name);
    });
  };

  render() {
    const name = this.props.match.params.name;
    const wobject = this.props.wobject;

    const toggleViewEditMode = () => {
      if (wobject?.object_type === 'html') {
        if (!this.props.isEdit) {
          const currentPath = this.props.location.pathname;

          if (!currentPath?.includes('/code')) {
            this.props.history.push(`/object/${name}/code`);
          }
          this.props.setEditMode(true);
          setGoogleTagEvent('click_edit_object');
        } else {
          this.props.setEditMode(false);
        }
      } else {
        this.props.setEditMode(!this.props.isEdit);
        if (!this.props.isEdit) setGoogleTagEvent('click_edit_object');
      }
    };

    if (this.props.failed)
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
        route={this.props.route}
        isSocial={this.props.route.isSocial}
        authenticatedUserName={this.props.authenticatedUserName}
        isEditMode={this.props.isEdit}
        toggleViewEditMode={toggleViewEditMode}
        weightValue={this.props.weightValue}
        showPostModal={this.props.showPostModal}
        abortController={this.abortController}
      />
    );
  }
}

WobjectContainer.propTypes = {
  route: PropTypes.shape().isRequired,
  authenticatedUserName: PropTypes.string,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  controller: PropTypes.shape(),
  location: PropTypes.shape({
    hash: PropTypes.string,
    pathname: PropTypes.string,
  }).isRequired,
  failed: PropTypes.bool,
  isSocial: PropTypes.bool,
  isEdit: PropTypes.bool,
  showPostModal: PropTypes.bool,
  wobject: PropTypes.shape(),
  getObject: PropTypes.func.isRequired,
  resetBreadCrumb: PropTypes.func.isRequired,
  resetWobjectExpertise: PropTypes.func.isRequired,
  weightValue: PropTypes.number,
  resetGallery: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  updates: PropTypes.arrayOf(PropTypes.shape({})),
  clearObjectFromStore: PropTypes.func,
  setNestedWobject: PropTypes.func,
  setCatalogBreadCrumbs: PropTypes.func,
  getCoordinates: PropTypes.func,
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
  setAbortController: PropTypes.func.isRequired,
  resetObjState: PropTypes.func.isRequired,
};

WobjectContainer.fetchData = async ({ store, match }) => {
  const objName = match.params.name;

  return Promise.allSettled([
    store.dispatch(getObject(objName)).then(async response => {
      const authors = response.value.authors
        ? response.value.authors?.map(el => parseWobjectField(el, 'body', []))
        : [];

      const authorsArray = await authors.reduce(async (acc, curr) => {
        const res = await acc;
        const permlink = curr.authorPermlink || curr.author_permlink;

        if (permlink && !has(curr, 'name')) {
          const newObj = await getObjectInfo([permlink]);

          return [...res, newObj.wobjects[0]];
        }

        return [...res, curr];
      }, []);

      let promises = [
        store.dispatch(setAuthors(authorsArray)),
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
        promises = [
          ...promises,
          store.dispatch(getAddOns(response.value.addOn?.map(obj => obj?.body))),
          store.dispatch(getSimilarObjects(objName)),
          store.dispatch(getRelatedObjectsAction(objName)),
          store.dispatch(getProductInfo(response.value)),
        ];

        if (response.value?.sortCustom?.include || response.value.menuItem) {
          const customSort = isEmpty(response.value?.sortCustom?.include)
            ? response.value.menuItem.map(i => i.permlink)
            : response.value?.sortCustom?.include;
          const items = sortListItems(prepareMenuItems(response.value.menuItem), customSort)[0];

          promises.push(store.dispatch(getMenuItemContent(parseJSON(items?.body)?.linkToObject)));
        }

        return Promise.allSettled(promises);
      }

      return Promise.allSettled(promises);
    }),
    store.dispatch(getObjectFollowersAction({ object: objName, skip: 0, limit: 5 })),
    // store.dispatch(getRate()),
    // store.dispatch(getRewardFund()),
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
  showPostModal: getShowPostModal(state),
  authenticatedUserName: getAuthenticatedUserName(state),
  wobjPermlink: getObjectPermlinkFromState(state),
  failed: getWobjectIsFailed(state),
  locale: getLocale(state),
  isSocial: getIsSocial(state),
  weightValue: getWeightValue(state, getObjectState(state).weight),
  currHost: getCurrentHost(state),
  isEdit: getIsEditMode(state),
  controller: getAbortController(state),
  wobject: getObjectState(state),
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
  getCoordinates,
  resetObjState,
  setAbortController,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WobjectContainer));
