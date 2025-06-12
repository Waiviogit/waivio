import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

import GuestSignUpForm from '../GuestSignUpForm/GuestSignUpForm';
import WebsiteSignIn from '../../../websites/WebsiteSignIn/WebsiteSignIn';

const RedirectedSignIn = props => {
  const [userData, setUserData] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const query = new URLSearchParams(props.location.search);
  const url = query.get('host');

  return (
    <div className="Wrapper">
      {isFormVisible ? (
        <Modal
          width={480}
          visible={isFormVisible}
          onCancel={() => setIsFormVisible(false)}
          footer={null}
          className={'ModalSignIn__website'}
        >
          <GuestSignUpForm userData={userData} isModalOpen={isFormVisible} url={url} />
        </Modal>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '99vw',
            marginTop: '100px',
          }}
        >
          <WebsiteSignIn
            showCloseIcon
            isSocial={props.isSocial}
            setUserData={setUserData}
            setIsFormVisible={setIsFormVisible}
            url={url}
          />
        </div>
      )}
    </div>
  );
};

RedirectedSignIn.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  isSocial: PropTypes.bool,
};

export default RedirectedSignIn;
