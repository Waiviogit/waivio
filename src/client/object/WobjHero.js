import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import WobjHeader from './WobjHeader';
import UserHeaderLoading from '../components/UserHeaderLoading';
import ObjectMenu from '../components/ObjectMenu';
import { accessTypesArr, getObjectName, haveAccess } from '../../common/helpers/wObjectHelper';
import { getIsWaivio, getUserAdministrator } from '../../store/appStore/appSelectors';
import { getObjectAlbums } from '../../store/galleryStore/gallerySelectors';

@withRouter
@connect(state => ({
  albums: getObjectAlbums(state),
  isWaivio: getIsWaivio(state),
  isAdministrator: getUserAdministrator(state),
}))
class WobjMenuWrapper extends React.Component {
  static propTypes = {
    match: PropTypes.shape(),
    location: PropTypes.shape(),
    history: PropTypes.shape(),
    wobject: PropTypes.shape().isRequired,
    albumsAndImagesCount: PropTypes.number,
    albums: PropTypes.arrayOf(PropTypes.shape()),
    isWaivio: PropTypes.bool,
    isAdministrator: PropTypes.bool,
  };

  static defaultProps = {
    albumsAndImagesCount: 0,
    match: {},
    location: {},
    history: {},
    albums: [],
    isWaivio: true,
  };

  onChange = key => {
    const { match, history } = this.props;

    history.push(`${match.url.replace(/\/$/, '')}/${key}`);
  };

  render() {
    const { ...otherProps } = this.props;
    const current = this.props.location.pathname.split('/')[3];
    const currentKey = current || 'reviews';
    const accessExtend = haveAccess(
      this.props.wobject,
      getObjectName(this.props.wobject),
      accessTypesArr[0],
    );

    return (
      <ObjectMenu
        accessExtend={accessExtend}
        defaultKey={currentKey}
        onChange={this.onChange}
        {...otherProps}
      />
    );
  }
}

const WobjHero = ({
  isEditMode,
  authenticated,
  wobject,
  isFetching,
  isFollowing,
  toggleViewEditMode,
  albumsAndImagesCount,
}) => {
  const username = getObjectName(wobject);

  return (
    <React.Fragment>
      <Switch>
        <Route
          path="/object/:name"
          render={() => (
            <React.Fragment>
              {isFetching ? (
                <UserHeaderLoading />
              ) : (
                <WobjHeader
                  isEditMode={isEditMode}
                  username={username}
                  authenticated={authenticated}
                  wobject={wobject}
                  isFollowing={isFollowing}
                  toggleViewEditMode={toggleViewEditMode}
                />
              )}
              <WobjMenuWrapper
                followers={wobject.followers_count || 0}
                wobject={wobject}
                username={username}
                albumsAndImagesCount={albumsAndImagesCount}
              />
            </React.Fragment>
          )}
        />
      </Switch>
    </React.Fragment>
  );
};

WobjHero.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool,
  isFollowing: PropTypes.bool,
  wobject: PropTypes.shape(),
  toggleViewEditMode: PropTypes.func,
  albumsAndImagesCount: PropTypes.number,
};

WobjHero.defaultProps = {
  isEditMode: false,
  isSameUser: false,
  isFollowing: false,
  isPopoverVisible: false,
  wobject: {},
  albumsAndImagesCount: 0,
  onTransferClick: () => {},
  toggleViewEditMode: () => {},
};

export default WobjHero;
