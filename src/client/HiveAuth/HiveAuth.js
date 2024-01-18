import { Input, Button } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import HAS from './hive-auth-wrapper';

import './HiveAuth.less';

const HAS_SERVER = 'wss://hive-auth.arcange.eu';
const APP_META = {
  name: 'waivio',
  description: 'waivio application',
  icon: undefined,
};

const HiveAuth = ({ setQRcodeForAuth }) => {
  const [showInput, setShowInput] = useState();
  const generateQrCode = evt => {
    const { account, uuid, key } = evt;
    const json = JSON.stringify({
      account,
      uuid,
      key,
      host: HAS_SERVER,
    });

    // const URI = `has://auth_req/${btoa(json)}`;
    const URI = `has://auth_req/${Buffer.from(json).toString('base64')}`;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${URI}`;

    // todo frontend show QR CODE
    return url;
  };
  const authorizeUserHAS = async ({ auth, challenge, cbWait }) => {
    try {
      if (auth.expire > Date.now()) {
        return { result: auth };
      }
      const authResp = await HAS.authenticate(auth, APP_META, challenge, cbWait);

      // do we need authResp?
      return { result: auth };
    } catch (error) {
      // if error  handle timeout authorization
      return { error };
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
          <Input placeholder={'Enter username'} />
          <Button
            onClick={() => {
              (async () => {
                const auth = new HAS.Auth('flowmaster');

                const { result, error } = await authorizeUserHAS({
                  auth,
                  cbWait: generateQrCode,
                });

                console.log();
              })();
              setQRcodeForAuth();
            }}
            className="HiveAuth__signIn"
          >
            Sing in
          </Button>
        </React.Fragment>
      ) : (
        <span onClick={() => setShowInput(true)}>Continue with HiveAuth</span>
      )}
    </div>
  );
};

HiveAuth.propTypes = {
  setQRcodeForAuth: PropTypes.func,
};

export default HiveAuth;
