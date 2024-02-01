import { Input, Button, message } from 'antd';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { parseJSON } from '../../common/helpers/parseJSON';
import { login } from '../../store/authStore/authActions';
import HAS from './hive-auth-wrapper';

import './HiveAuth.less';

const HAS_SERVER = 'wss://hive-auth.arcange.eu';
const APP_META = {
  name: 'waivio',
  description: 'waivio application',
  icon: undefined,
};

const HiveAuth = ({ setQRcodeForAuth, onCloseSingIn, text }) => {
  const [showInput, setShowInput] = useState();
  const input = useRef();
  const dispatch = useDispatch();
  const generateQrCode = evt => {
    const { account, uuid, key } = evt;
    const json = JSON.stringify({
      account,
      uuid,
      key,
      host: HAS_SERVER,
    });

    const URI = `has://auth_req/${Buffer.from(json).toString('base64')}`;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${URI}`;

    setQRcodeForAuth(url);
  };

  const authorizeUserHAS = ({ auth, challenge, cbWait }) => {
    try {
      HAS.authenticate(auth, APP_META, challenge, cbWait).then(res => {
        if (res.cmd === 'auth_ack') {
          dispatch(login());
          onCloseSingIn(false);
        }
      });
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <div className="HiveAuth">
      <img
        alt={'Hive auth'}
        className={'HiveAuth__icon'}
        src={'/images/icons/hive-auth-logo.png'}
      />
      {showInput ? (
        <React.Fragment>
          <Input ref={input} placeholder={'Enter username'} />
          <Button
            onClick={() => {
              const auth = parseJSON(Cookie.get('auth')) || { username: input.current.input.value };

              authorizeUserHAS({
                auth,
                cbWait: generateQrCode,
              });
            }}
            className="HiveAuth__signIn"
          >
            Sing in
          </Button>
        </React.Fragment>
      ) : (
        <span onClick={() => setShowInput(true)}>{text} (Beta)</span>
      )}
    </div>
  );
};

HiveAuth.propTypes = {
  setQRcodeForAuth: PropTypes.func,
  onCloseSingIn: PropTypes.func,
  text: PropTypes.string,
};

HiveAuth.defaultProps = {
  text: 'Continue with HiveAuth',
};

export default HiveAuth;
