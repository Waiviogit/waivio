import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Modal } from 'antd';
import WobjHeader from './WobjHeader';
import UserHeaderLoading from '../components/UserHeaderLoading';
import WobjMenuWrapper from '../object/WobjMenuWrapper/WobjMenuWrapper';
import { getScreenSize } from '../reducers';

const WobjHero = ({
  isEditMode,
  authenticated,
  wobject,
  isFetching,
  username,
  isFollowing,
  toggleViewEditMode,
  albumsAndImagesCount,
}) => {
  const [isModalVisible, setModalVisibility] = useState(false);
  const screenSize = useSelector(getScreenSize);
  const isMobile = screenSize.includes('xsmall') || screenSize.includes('small');

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
                  setModalVisibility={setModalVisibility}
                  isMobile={isMobile}
                />
              )}
              {isMobile ? (
                <Modal
                  footer={null}
                  visible={isModalVisible}
                  onCancel={() => setModalVisibility(false)}
                >
                  <WobjMenuWrapper
                    followers={wobject.followers_count || 0}
                    wobject={wobject}
                    username={username}
                    albumsAndImagesCount={albumsAndImagesCount}
                    setModalVisibility={setModalVisibility}
                  />
                </Modal>
              ) : (
                <div>
                  <WobjMenuWrapper
                    followers={wobject.followers_count || 0}
                    wobject={wobject}
                    username={username}
                    albumsAndImagesCount={albumsAndImagesCount}
                    setModalVisibility={setModalVisibility}
                  />
                </div>
              )}
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
  username: PropTypes.string.isRequired,
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
