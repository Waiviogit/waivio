import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import WobjHeader from './WobjHeader';
import UserHeaderLoading from '../components/UserHeaderLoading';
import ObjectMenu from '../components/ObjectMenu';
import Hero from '../components/Hero';

@withRouter
class WobjMenuWrapper extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    wobject: PropTypes.shape().isRequired,
  };

  onChange = key => {
    const { match, history } = this.props;
    const section = key === 'about' ? '' : `/${key}`;
    history.push(`${match.url.replace(/\/$/, '')}${section}`);
  };

  render() {
    const { ...otherProps } = this.props;
    const current = this.props.location.pathname.split('/')[3];
    const currentKey = current || 'about';
    let fieldsCount = 0;
    if (this.props.wobject && this.props.wobject.fields)
      fieldsCount = this.props.wobject.fields.length > 0 ? this.props.wobject.fields.length - 1 : 0;
    return (
      <ObjectMenu
        defaultKey={currentKey}
        onChange={this.onChange}
        {...otherProps}
        fieldsCount={fieldsCount}
      />
    );
  }
}

const WobjHero = ({ authenticated, wobject, isFetching, username, isFollowing }) => (
  <React.Fragment>
    <Switch>
      <Route
        path="/object/@:name"
        render={() => (
          <React.Fragment>
            {isFetching ? (
              <UserHeaderLoading />
            ) : (
              <WobjHeader username={username} wobject={wobject} isFollowing={isFollowing} />
            )}
            <WobjMenuWrapper followers={wobject.followers_count || 0} wobject={wobject} />
          </React.Fragment>
        )}
      />
      <Route render={() => (authenticated ? <Hero /> : <div />)} />
    </Switch>
  </React.Fragment>
);

WobjHero.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  isFollowing: PropTypes.bool,
  wobject: PropTypes.shape(),
};

WobjHero.defaultProps = {
  isSameUser: false,
  isFollowing: false,
  isPopoverVisible: false,
  onTransferClick: () => {},
  wobject: {},
};

export default WobjHero;
