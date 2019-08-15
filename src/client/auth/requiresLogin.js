import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIsAuthFetching, getIsAuthenticated, getAuthenticatedUserName } from '../reducers';
import Loading from '../components/Icon/Loading';
import Error401 from '../statics/Error401';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function requiresLogin(WrappedComponent) {
  const Component = ({ authenticated, fetching, userName, ...props }) => {
    if (fetching) {
      return (
        <div className="main-panel">
          <Loading />
        </div>
      );
    }
    if (!authenticated) {
      return <Error401 />;
    }
    return <WrappedComponent userName={userName} {...props} />;
  };

  Component.displayName = `RequiresLogin(${getDisplayName(WrappedComponent)})`;

  Component.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    fetching: PropTypes.bool.isRequired,
    userName: PropTypes.string.isRequired,
  };

  const mapStateToProps = state => ({
    fetching: getIsAuthFetching(state),
    authenticated: getIsAuthenticated(state),
    userName: getAuthenticatedUserName(state),
  });

  return connect(mapStateToProps)(Component);
}
