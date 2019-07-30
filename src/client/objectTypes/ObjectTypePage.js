import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
  getObjectTypeState,
  getobjectTypesState,
  getScreenSize,
  getUserLocation,
} from '../reducers';

import MapOS from '../components/Maps/Map';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import { clearType, getObjectType } from './objectTypeActions';
import { getObjectTypes } from './objectTypesActions';
import './ObjectTypePage.less';
import ObjectTypeFiltersPanel from './ObjectTypeFiltersPanel/ObjectTypeFiltersPanel';
import ObjectTypeFiltersTags from './ObjectTypeFiltersTags/ObjectTypeFiltersTags';
import ListObjectsByType from '../objectCard/ListObjectsByType/ListObjectsByType';
import { getCoordinates } from '../user/userActions';
import Loading from '../components/Icon/Loading';
import ObjectTypesNavigation from './ObjectTypesNavigation/ObjectTypesNavigation';

@injectIntl
@withRouter
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    screenSize: getScreenSize(state),
    type: getObjectTypeState(state),
    userLocation: getUserLocation(state),
    objectTypes: getobjectTypesState(state),
  }),
  {
    getObjectType,
    getObjectTypes,
    getCoordinates,
    clearType,
  },
)
export default class ObjectTypePage extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    getObjectType: PropTypes.func.isRequired,
    getObjectTypes: PropTypes.func.isRequired,
    getCoordinates: PropTypes.func.isRequired,
    objectTypes: PropTypes.shape().isRequired,
    clearType: PropTypes.func.isRequired,
    type: PropTypes.shape(),
    userLocation: PropTypes.shape(),
    screenSize: PropTypes.string.isRequired,
  };

  static defaultProps = {
    authenticatedUserName: '',
    loaded: false,
    failed: false,
    userLocation: {},
    type: {},
  };

  state = {
    isEditMode: false,
    isMapFullScreen: false,
    relatedWobjects: [],
    activefilters: {
      map: [],
      tagCloud: [],
      ratings: [],
    },
    withMap: false,
    isLoading: true,
  };

  componentDidMount() {
    this.props.getObjectType(this.props.match.params.typeName, 0, {});
    if (_.isEmpty(this.props.objectTypes)) this.props.getObjectTypes(100, 0, 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.typeName !== this.props.match.params.typeName)
      this.props.getObjectType(nextProps.match.params.typeName, 0, {});
    if (!_.isEmpty(nextProps.type)) {
      if (
        !_.isEmpty(this.state.activefilters.map) &&
        !_.isEmpty(nextProps.type.filters.map) &&
        !this.state.withMap
      ) {
        this.setState({ filters: nextProps.type.filters, isLoading: false });
        this.getObjectTypeWithMap(nextProps);
      } else this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    this.props.clearType();
  }

  getObjectTypeWithMap = props => {
    if (!_.size(this.props.userLocation)) {
      this.props.getCoordinates();
    } else if (!this.state.withMap) {
      props.getObjectType(props.match.params.typeName, 0, {
        map: {
          coordinates: [+props.userLocation.lat, +props.userLocation.lon],
          radius: 50000,
        },
      });
      this.setState({ withMap: true });
    }
  };

  setFilterValue = (filter, key) => {
    const activefilters = this.state.activefilters;
    if (_.includes(activefilters[key], filter)) {
      if (key === 'map') {
        delete activefilters.map;
        this.props.getObjectType(this.props.match.params.typeName, 0, activefilters);
        this.setState({ activefilters, withMap: false });
      } else {
        const requestData = activefilters;
        if (_.includes(activefilters.map, 'map')) {
          requestData.map = {
            coordinates: [+this.props.userLocation.lat, +this.props.userLocation.lon],
            radius: 50000,
          };
        }
        this.props.getObjectType(this.props.match.params.typeName, 0, requestData);
        this.setState({ activefilters });
      }
    } else if (key === 'map') {
      this.getObjectTypeWithMap(this.props);
      activefilters[key] = [filter];
      this.setState({ activefilters });
    } else {
      this.props.getObjectType(this.props.match.params.typeName, 0, activefilters);
      activefilters[key].push(filter);
      this.setState({ activefilters });
    }
    this.setState({ activefilters });
  };

  toggleViewEditMode = () => this.setState(prevState => ({ isEditMode: !prevState.isEditMode }));

  render() {
    const { type, intl, screenSize, objectTypes } = this.props;

    const host = global.postOrigin || 'https://waiviodev.com';
    const desc = type.body;
    const canonicalUrl = `${host}/objectType/${type.name}`;
    const url = `${host}/objectType/${type.name}`;
    const title = `Type - ${type.name || ''}`;

    return (
      <div className="ObjectTypePage">
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={canonicalUrl} />
          <meta property="description" content={desc} />
          <meta property="og:title" content={title} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="Waivio" />
          <meta property="twitter:card" content={'summary'} />
          <meta property="twitter:site" content={'@waivio'} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={desc} />
          <meta
            property="twitter:image"
            content={
              'https://cdn.steemitimages.com/DQmVRiHgKNWhWpDXSmD7ZK4G48mYkLMPcoNT8VzgXNWZ8aN/image.png'
            }
          />
        </Helmet>
        <ScrollToTopOnMount />
        <div className="feed-layout container">
          <Affix className="leftContainer leftContainer__user" stickPosition={72}>
            <div className="left">
              <ObjectTypesNavigation
                objectTypes={objectTypes}
                typeName={this.props.match.params.typeName}
              />
            </div>
          </Affix>
          <div className="center">
            {type.name && (
              <div className="ObjectTypePage__title">
                {`${intl.formatMessage({
                  id: 'type',
                  defaultMessage: 'Type',
                })}: ${type.name}`}
              </div>
            )}
            {(_.size(this.state.activefilters.tagCloud) > 0 ||
              _.size(this.state.activefilters.ratings) > 0 ||
              _.size(this.state.activefilters.map) > 0) && (
              <div className="ObjectTypePage__tags">
                {intl.formatMessage({
                  id: 'filters',
                  defaultMessage: 'Filters',
                })}
                :
                <ObjectTypeFiltersTags
                  activefilters={this.state.activefilters}
                  setFilterValue={this.setFilterValue}
                />
              </div>
            )}
            {/* eslint-disable-next-line no-nested-ternary */}
            {!_.isEmpty(this.props.type.related_wobjects) ? (
              <ListObjectsByType
                limit={25}
                getObjectType={this.props.getObjectType}
                wobjects={this.props.type.related_wobjects}
                typeName={this.props.match.params.typeName}
                showSmallVersion={screenSize === 'xsmall'}
              />
            ) : !this.state.isLoading ? (
              <div>
                {`${intl.formatMessage({
                  id: 'noTypeObjects',
                  defaultMessage: 'No data meets the criteria',
                })}`}
              </div>
            ) : (
              <Loading center />
            )}
          </div>
          <Affix className="rightContainer leftContainer__user" stickPosition={72}>
            <div className="right">
              {this.state.withMap &&
                !_.isEmpty(type.related_wobjects) &&
                !_.isEmpty(this.props.userLocation) && (
                  <MapOS
                    wobjects={this.props.type.related_wobjects}
                    heigth={268}
                    userLocation={this.props.userLocation}
                  />
                )}
              <ObjectTypeFiltersPanel
                filters={type.filters}
                activefilters={this.state.activefilters}
                setFilterValue={this.setFilterValue}
              />
            </div>
          </Affix>
          <Affix className="rightContainer leftContainer__user" stickPosition={72}>
            <div className="right">
              {this.state.withMap &&
                !_.isEmpty(type.related_wobjects) &&
                !_.isEmpty(this.props.userLocation) && (
                  <MapOS
                    wobjects={this.props.type.related_wobjects}
                    heigth={268}
                    userLocation={this.props.userLocation}
                  />
                )}
              <ObjectTypeFiltersPanel
                filters={type.filters}
                activefilters={this.state.activefilters}
                setFilterValue={this.setFilterValue}
              />
            </div>
          </Affix>
        </div>
      </div>
    );
  }
}
