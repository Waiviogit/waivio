import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getObjectTypeState,
  getScreenSize,
} from '../reducers';

import MapOS from '../components/Maps/Map';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import { getObjectType } from './objectTypesActions';
import './ObjectTypePage.less';
import ObjectTypeFiltersPanel from './ObjectTypeFiltersPanel/ObjectTypeFiltersPanel';
import ObjectTypeFiltersTags from './ObjectTypeFiltersTags/ObjectTypeFiltersTags';
import ListObjectsByType from '../objectCard/ListObjectsByType/ListObjectsByType';

@injectIntl
@withRouter
@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    screenSize: getScreenSize(state),
    type: getObjectTypeState(state, ownProps.match.params.typeName),
  }),
  {
    getObjectType,
  },
)
export default class ObjectTypePage extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    getObjectType: PropTypes.func.isRequired,
    type: PropTypes.shape(),
    screenSize: PropTypes.string.isRequired,
  };

  static defaultProps = {
    authenticatedUserName: '',
    loaded: false,
    failed: false,
    getObjectType: () => {},
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
  };

  componentDidMount() {
    this.props.getObjectType(this.props.match.params.typeName);
  }

  setFilterValue = (filter, key) => {
    const activefilters = this.state.activefilters;
    if (_.includes(activefilters[key], filter)) {
      activefilters[key] = activefilters[key].filter(value => value !== filter);
    } else activefilters[key].push(filter);
    this.setState({ activefilters });
  };

  toggleViewEditMode = () => this.setState(prevState => ({ isEditMode: !prevState.isEditMode }));

  render() {
    const { type, intl, screenSize } = this.props;

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
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer leftContainer__user" stickPosition={72}>
              <div className="left">
                <MapOS wobjects={type.related_wobjects} heigth={200} />
                <ObjectTypeFiltersPanel
                  activefilters={this.state.activefilters}
                  setFilterValue={this.setFilterValue}
                />
              </div>
            </Affix>
            <div className="center">
              {type.name && (
                <div className="ObjectTypePage__title">{`${intl.formatMessage({
                  id: 'type',
                  defaultMessage: 'Type',
                })}: ${type.name}`}</div>
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
              <ListObjectsByType
                limit={25}
                wobjects={type.related_wobjects}
                typeName={this.props.match.params.typeName}
                showSmallVersion={screenSize === 'xsmall'}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
