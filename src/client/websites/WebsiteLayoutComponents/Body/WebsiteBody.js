import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, get } from 'lodash';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import classNames from 'classnames';
import { connect } from 'react-redux';
import {
  resetWebsiteFilters,
  setFilterFromQuery,
  setShowSearchResult,
  setWebsiteSearchType,
} from '../../../../store/searchStore/searchActions';
import SearchAllResult from '../../../search/SearchAllResult/SearchAllResult';
import {
  getObjectAvatar,
  getObjectMapInArray,
  getObjectName,
} from '../../../../common/helpers/wObjectHelper';
import { getReservedCounter } from '../../../../store/appStore/appActions';
import {
  getWebsiteObjWithCoordinates,
  resetSocialSearchResult,
  setShowReload,
} from '../../../../store/websiteStore/websiteActions';
import {
  getConfigurationValues,
  getHostAddress,
  getReserveCounter,
  getWebsiteLogo,
} from '../../../../store/appStore/appSelectors';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../../store/authStore/authSelectors';
import {
  getShowSearchResult,
  getWebsiteSearchString,
  getWebsiteSearchType,
  tagsCategoryIsEmpty,
} from '../../../../store/searchStore/searchSelectors';
import { getShowReloadButton } from '../../../../store/websiteStore/websiteSelectors';
import { createFilterBody, parseTagsFilters } from '../../../discoverObjects/helper';
import MainMap from '../../MainMap/MainMap';
import { useSeoInfo } from '../../../../hooks/useSeoInfo';
import { getObject } from '../../../../store/wObjectStore/wObjectSelectors';
import { getObject as getObjectAction } from '../../../../store/wObjectStore/wobjectsActions';
import { getCoordinates } from '../../../../store/userStore/userActions';
import { getMapLoading } from '../../../../store/mapStore/mapSelectors';
import './WebsiteBody.less';

const WebsiteBody = props => {
  const [hoveredCardPermlink, setHoveredCardPermlink] = useState('');
  const { canonicalUrl } = useSeoInfo();
  const reservedButtonClassList = classNames('WebsiteBody__reserved', {
    'WebsiteBody__reserved--withMobileFilters': props.isActiveFilters,
  });
  const mapClassList = classNames('WebsiteBody__map WebsiteBody__diningMap', {
    WebsiteBody__hideMap: props.isShowResult,
  });
  const bodyClassList = classNames('WebsiteBody WebsiteBody__isDining');

  useEffect(() => {
    const query = props.location.search;

    if (props.isAuth) props.getReservedCounter();
    if (query) {
      const filterBody = createFilterBody(parseTagsFilters(query));
      const type = props.query.get('type');

      if (type) props.setWebsiteSearchType(type);
      if (!isEmpty(filterBody)) props.setFilterFromQuery(filterBody);
    }

    return () => {
      props.resetWebsiteFilters();
      props.setShowSearchResult(false);
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(props.currObj)) {
      props.getCoordinates();
    }

    return () => {
      props.resetSocialSearchResult();
    };
  }, [props.currObj.author_permlink]);

  const aboutObject = get(props, ['configuration', 'aboutObject'], {});
  const currentLogo = props.logo || getObjectAvatar(aboutObject);
  const description = get(aboutObject, 'description', '');
  const objName = getObjectName(aboutObject);
  const title = props.isSocial
    ? getObjectName(props.currObj)
    : get(aboutObject, 'title', '') || objName;
  const websiteTitle = title ? `${objName} - ${title}` : objName;

  const reloadSearchList = () => props.setShowReload(false);

  const handleHoveredCard = permlink => setHoveredCardPermlink(permlink);

  const setQueryFromSearchList = obj => {
    const objMap = getObjectMapInArray(obj);

    props.query.set('permlink', obj.author_permlink);
    if (objMap) props.query.set('center', objMap);
    if (props.searchString) props.query.set('searchString', props.searchString);
  };

  const setQueryInLocalStorage = () => localStorage.setItem('query', props.query.toString());

  const deleteShowPanel = () => {
    if (props.query.get('showPanel')) {
      props.query.delete('showPanel');
      props.history.push(`?${props.query.toString()}`);
    }
  };

  return (
    <div className={bodyClassList}>
      <Helmet>
        <title>{props.isSocial ? title : websiteTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={currentLogo} />
        <meta property="og:image:url" content={currentLogo} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content={currentLogo ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:site" content={`@${objName}`} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" property="twitter:image" content={currentLogo} />
        <meta property="og:site_name" content={objName} />
        <link rel="image_src" href={currentLogo} />
        <link id="favicon" rel="icon" href={currentLogo} type="image/x-icon" />
      </Helmet>
      {((props.isSocial && !props.loading) || !props.isSocial) && (
        <SearchAllResult
          isSocial={props.isSocial}
          permlink={props.permlink}
          showReload={props.showReloadButton}
          reloadSearchList={reloadSearchList}
          searchType={props.searchType}
          handleHoveredCard={handleHoveredCard}
          setQueryInLocalStorage={setQueryInLocalStorage}
          setQueryFromSearchList={setQueryFromSearchList}
          deleteShowPanel={deleteShowPanel}
        />
      )}
      <div className={mapClassList}>
        {!isEmpty(props.configuration) && (
          <React.Fragment>
            {Boolean(props.counter) &&
              props.isAuth &&
              (!props.isSocial || (props.isSocial && !props.loading)) && (
                <Link to="/rewards/reserved" className={reservedButtonClassList}>
                  <FormattedMessage id="reserved" defaultMessage="Reserved" />
                  :&nbsp;&nbsp;&nbsp;&nbsp;{props.counter}
                </Link>
              )}
            <MainMap
              permlink={props.permlink}
              locale={Cookie.get('language')}
              isSocial={props.isSocial}
              loading={props.loading}
              query={props.query}
              hoveredCardPermlink={hoveredCardPermlink}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

WebsiteBody.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    site: PropTypes.string,
    params: PropTypes.shape(),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape(),
  }).isRequired,
  isShowResult: PropTypes.bool.isRequired,
  configuration: PropTypes.shape().isRequired,
  searchString: PropTypes.string.isRequired,
  getReservedCounter: PropTypes.func.isRequired,
  setShowReload: PropTypes.func.isRequired,
  resetWebsiteFilters: PropTypes.func.isRequired,
  setShowSearchResult: PropTypes.func.isRequired,
  getCoordinates: PropTypes.func,
  setFilterFromQuery: PropTypes.func.isRequired,
  setWebsiteSearchType: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired,
  searchType: PropTypes.string.isRequired,
  logo: PropTypes.string,
  permlink: PropTypes.string,
  currObj: PropTypes.shape(),
  resetSocialSearchResult: PropTypes.func,
  isActiveFilters: PropTypes.bool.isRequired,
  showReloadButton: PropTypes.bool,
  isSocial: PropTypes.bool,
  isAuth: PropTypes.bool,
  loading: PropTypes.bool,
  query: PropTypes.shape({
    get: PropTypes.func,
    set: PropTypes.func,
    delete: PropTypes.func,
  }).isRequired,
};

WebsiteBody.defaultProps = {
  searchString: '',
  logo: '',
  isAuth: false,
  showReloadButton: false,
};

export default connect(
  (state, ownProps) => ({
    isShowResult: getShowSearchResult(state),
    configuration: getConfigurationValues(state),
    counter: getReserveCounter(state),
    isAuth: getIsAuthenticated(state),
    query: new URLSearchParams(ownProps.location?.search),
    searchString: getWebsiteSearchString(state),
    showReloadButton: getShowReloadButton(state),
    searchType: getWebsiteSearchType(state),
    host: getHostAddress(state),
    isActiveFilters: tagsCategoryIsEmpty(state),
    logo: getWebsiteLogo(state),
    authUserName: getAuthenticatedUserName(state),
    // locale: getUsedLocale(state),
    currObj: getObject(state),
    loading: getMapLoading(state),
  }),
  {
    setWebsiteSearchType,
    getReservedCounter,
    setShowReload,
    setFilterFromQuery,
    resetWebsiteFilters,
    setShowSearchResult,
    getObjectAction,
    getWebsiteObjWithCoordinates,
    resetSocialSearchResult,
    getCoordinates,
  },
)(withRouter(WebsiteBody));
