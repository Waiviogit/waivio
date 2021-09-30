import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, get } from 'lodash';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import {
  resetWebsiteFilters,
  setFilterFromQuery,
  setMapForSearch,
  setShowSearchResult,
  setWebsiteSearchType,
} from '../../../../store/searchStore/searchActions';
import SearchAllResult from '../../../search/SearchAllResult/SearchAllResult';
import {
  getObjectAvatar,
  getObjectMapInArray,
  getObjectName,
} from '../../../helpers/wObjectHelper';
import { getReservedCounter } from '../../../../store/appStore/appActions';
import { setShowReload } from '../../../../store/websiteStore/websiteActions';
import {
  getConfigurationValues,
  getHostAddress,
  getIsDiningGifts,
  getReserveCounter,
  getWebsiteLogo,
  getWebsiteMainMap,
} from '../../../../store/appStore/appSelectors';
import { getIsAuthenticated } from '../../../../store/authStore/authSelectors';
import { getUserLocation } from '../../../../store/userStore/userSelectors';
import {
  getShowSearchResult,
  getWebsiteMap,
  getWebsiteSearchString,
  getWebsiteSearchType,
  tagsCategoryIsEmpty,
} from '../../../../store/searchStore/searchSelectors';
import { getShowReloadButton } from '../../../../store/websiteStore/websiteSelectors';
import { createFilterBody, parseTagsFilters } from '../../../discoverObjects/helper';
import MainMap from '../../MainMap/MainMap';
import QuickRewardsModal from '../../../rewards/QiuckRewardsModal/QuickRewardsModal';

import './WebsiteBody.less';

const WebsiteBody = props => {
  const [hoveredCardPermlink, setHoveredCardPermlink] = useState('');
  const reservedButtonClassList = classNames('WebsiteBody__reserved', {
    'WebsiteBody__reserved--withMobileFilters': props.isActiveFilters,
  });
  const mapClassList = classNames('WebsiteBody__map', {
    WebsiteBody__hideMap: props.isShowResult,
    WebsiteBody__diningMap: props.isDining,
  });
  const bodyClassList = classNames('WebsiteBody', { WebsiteBody__isDining: props.isDining });

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

  const aboutObject = get(props, ['configuration', 'aboutObject'], {});
  const currentLogo = props.logo || getObjectAvatar(aboutObject);
  const logoLink = get(aboutObject, ['defaultShowLink'], '/');
  const description = get(aboutObject, 'description', '');
  const objName = getObjectName(aboutObject);
  const title = get(aboutObject, 'title', '') || objName;

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
        <title>{title ? `${objName} - ${title}` : objName}</title>
        <link rel="canonical" href={`https://${props.host}/`} />
        <meta property="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://${props.host}/`} />
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
        <link id="favicon" rel="icon" href={getObjectAvatar(aboutObject)} type="image/x-icon" />
      </Helmet>
      <SearchAllResult
        showReload={props.showReloadButton}
        reloadSearchList={reloadSearchList}
        searchType={props.searchType}
        handleHoveredCard={handleHoveredCard}
        setQueryInLocalStorage={setQueryInLocalStorage}
        setQueryFromSearchList={setQueryFromSearchList}
        deleteShowPanel={deleteShowPanel}
        isDining={props.isDining}
      />
      <div className={mapClassList}>
        {currentLogo && !props.isDining && (
          <Link to={logoLink}>
            <img className="WebsiteBody__logo" src={currentLogo} alt="your logo" />
          </Link>
        )}
        {!isEmpty(props.configuration) && (
          <React.Fragment>
            {Boolean(props.counter) && props.isAuth && (
              <Link to="/rewards/reserved" className={reservedButtonClassList}>
                <FormattedMessage id="reserved" defaultMessage="Reserved" />
                :&nbsp;&nbsp;&nbsp;&nbsp;{props.counter}
              </Link>
            )}
            <MainMap query={props.query} hoveredCardPermlink={hoveredCardPermlink} />
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
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  userLocation: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
  }).isRequired,
  isShowResult: PropTypes.bool.isRequired,
  isDining: PropTypes.bool,
  configuration: PropTypes.shape().isRequired,
  searchString: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
  getReservedCounter: PropTypes.func.isRequired,
  setShowReload: PropTypes.func.isRequired,
  resetWebsiteFilters: PropTypes.func.isRequired,
  setShowSearchResult: PropTypes.func.isRequired,
  setFilterFromQuery: PropTypes.func.isRequired,
  setWebsiteSearchType: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired,
  searchType: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  isActiveFilters: PropTypes.bool.isRequired,
  showReloadButton: PropTypes.bool,
  searchMap: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  isAuth: PropTypes.bool,
  query: PropTypes.shape({
    get: PropTypes.func,
    set: PropTypes.func,
    delete: PropTypes.func,
  }).isRequired,
};

WebsiteBody.defaultProps = {
  searchString: '',
  isAuth: false,
  showReloadButton: false,
  isDining: false,
};

export default connect(
  (state, ownProps) => ({
    userLocation: getUserLocation(state),
    isShowResult: getShowSearchResult(state),
    configuration: getConfigurationValues(state),
    counter: getReserveCounter(state),
    isAuth: getIsAuthenticated(state),
    query: new URLSearchParams(ownProps.location.search),
    searchString: getWebsiteSearchString(state),
    searchMap: getWebsiteMap(state),
    showReloadButton: getShowReloadButton(state),
    searchType: getWebsiteSearchType(state),
    host: getHostAddress(state),
    isActiveFilters: tagsCategoryIsEmpty(state),
    logo: getWebsiteLogo(state),
    currMap: getWebsiteMainMap(state),
    isDining: getIsDiningGifts(state),
  }),
  {
    setWebsiteSearchType,
    getReservedCounter,
    setMapForSearch,
    setShowReload,
    setFilterFromQuery,
    resetWebsiteFilters,
    setShowSearchResult,
  },
)(withRouter(WebsiteBody));
