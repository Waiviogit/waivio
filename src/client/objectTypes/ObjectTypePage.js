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
} from '../reducers';

import MapOS from '../components/Maps/Map';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import { getObjectType } from './objectTypesActions';
import './ObjectTypePage.less';
import ObjectCardView from '../objectCard/ObjectCardView';
import { getClientWObj } from '../adapters';

@injectIntl
@withRouter
@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
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
  };

  componentDidMount() {
    this.props.getObjectType(this.props.match.params.typeName);
  }

  toggleViewEditMode = () => this.setState(prevState => ({ isEditMode: !prevState.isEditMode }));

  render() {
    const { type, intl } = this.props;

    const host = global.postOrigin || 'https://waiviodev.com';
    const desc = type.body;
    const canonicalUrl = `${host}/objectType/${type.name}`;
    const url = `${host}/objectType/${type.name}`;
    const title = `Type - Waivio`;

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
            content={'https://steemit.com/images/steemit-twshare.png'}
          />
        </Helmet>
        <ScrollToTopOnMount />
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer leftContainer__user" stickPosition={72}>
              <div className="left">
                <MapOS wobjects={this.props.type.related_wobjects} />
              </div>
            </Affix>
            <div className="center">
              {type.name && (
                <div className="ObjectTypePage__title">{`${intl.formatMessage({
                  id: 'type',
                  defaultMessage: 'Type',
                })}: ${type.name}`}</div>
              )}
              {_.map(type.related_wobjects, obj => {
                const wobj = getClientWObj(obj);
                return <ObjectCardView key={wobj.id} wObject={wobj} />;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
