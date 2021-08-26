import React, { useState } from 'react';
import PropTypes from 'prop-types';

import GuestSignUpForm from '../GuestSignUpForm/GuestSignUpForm';
import WebsiteSignIn from '../../../websites/WebsiteSignIn/WebsiteSignIn';

const RedirectedSignIn = props => {
  const [userData, setUserData] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const query = new URLSearchParams(props.location.search);
  const url = query.get('host');
  const urlObj = new URL(url);

  return (
    <div className="Wrapper">
      {isFormVisible ? (
        <GuestSignUpForm userData={userData} isModalOpen={isFormVisible} url={urlObj} />
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            marginTop: '100px',
          }}
        >
          <WebsiteSignIn setUserData={setUserData} setIsFormVisible={setIsFormVisible} />
        </div>
      )}
    </div>
  );
};

RedirectedSignIn.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default RedirectedSignIn;
