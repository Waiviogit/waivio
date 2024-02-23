import { Button, message, Select, Input } from 'antd';
import Cookie from 'js-cookie';
import store from 'store';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { parseJSON } from '../../common/helpers/parseJSON';
import { login } from '../../store/authStore/authActions';
import { chechExistUser } from '../../waivioApi/ApiClient';
import Avatar from '../components/Avatar';
import HAS from './hive-auth-wrapper';

import './HiveAuth.less';

const CLEAR_OPTION = 'clear';
const HAS_SERVER = 'wss://hive-auth.arcange.eu';
const APP_META = {
  name: 'waivio',
  description: 'waivio application',
  icon: undefined,
};
const getSavedAcc = () => {
  const accounts = store.get('accounts');

  return Array.isArray(accounts) ? accounts : parseJSON(accounts);
};

const HiveAuth = ({ setQRcodeForAuth, onCloseSingIn, text, style, buttonStyle }) => {
  const [showInput, setShowInput] = useState();
  const [user, setUser] = useState('');
  const [savedAcc, setSavedAcc] = useState(getSavedAcc());
  const { location } = useHistory();

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
  const authorizeUserHAS = ({ auth, cbWait }) => {
    try {
      HAS.authenticate(
        auth,
        APP_META,
        {
          key_type: 'posting',
          challenge: JSON.stringify({
            login: auth.username,
            ts: Date.now(),
          }),
        },
        cbWait,
      ).then(res => {
        if (res.cmd === 'auth_ack') {
          const query = new URLSearchParams(location.search);
          const url = query.get('host') || location.origin;

          if (query.get('host'))
            window.location.href = `${url}/?socialProvider=hiveAuth&auth=${JSON.stringify(auth)}`;

          dispatch(login());
          onCloseSingIn(false);
        }
      });
    } catch (error) {
      message.error(error);
    }
  };

  const changeUser = useCallback(
    debounce(e => {
      setUser(e);
    }, 300),
    [],
  );

  const handleAuth = () => {
    const auth = parseJSON(Cookie.get('auth'));

    if (auth) {
      authorizeUserHAS({
        auth,
        cbWait: generateQrCode,
      });
    } else {
      const username = user.toLowerCase().trim();

      chechExistUser(username).then(result => {
        if (result) {
          const accounts = store.get('accounts') || [];

          if (!accounts.includes(username)) store.set('accounts', [username, ...accounts]);
          authorizeUserHAS({
            auth: { username },
            cbWait: generateQrCode,
          });
        } else {
          message.error('Account name not found');
        }
      });
    }
  };

  return (
    <div className="HiveAuth" style={style}>
      <img
        alt={'Hive auth'}
        className={'HiveAuth__icon'}
        src={'/images/icons/hive-auth-logo.png'}
      />
      {showInput ? (
        <React.Fragment>
          {!savedAcc ? (
            <Input
              onChange={e => changeUser(e.currentTarget.value)}
              placeholder={'Enter username'}
              name={'account'}
              autoCapitalize="off"
              autoCorrect="off"
            />
          ) : (
            <Select
              showSearch
              onSearch={value => changeUser(value)}
              name={'account'}
              placeholder={'Enter username'}
              defaultActiveFirstOption={false}
              showArrow={false}
              dropdownClassName={'HiveAuth__accList'}
              onSelect={value => {
                if (value === CLEAR_OPTION) {
                  store.remove('accounts');
                  setSavedAcc(null);
                } else setUser(value);
              }}
              filterOption={false}
              style={{ width: '100%', backgroundColor: 'white' }}
            >
              {savedAcc?.map(i => (
                <Select.Option value={i} key={i}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar username={i} size={25} />{' '}
                    <b
                      style={{
                        display: 'inline-block',
                        marginLeft: '10px',
                      }}
                    >
                      {i}
                    </b>
                  </div>
                </Select.Option>
              ))}
              <Select.Option value={'clear'}>
                <b style={{ display: 'flex', justifyContent: 'center' }}>Clear history</b>
              </Select.Option>
            </Select>
          )}
          <Button disabled={!user} onClick={handleAuth} className="HiveAuth__signIn">
            Sign in
          </Button>
        </React.Fragment>
      ) : (
        <span style={buttonStyle} onClick={() => setShowInput(true)}>
          {text}
        </span>
      )}
    </div>
  );
};

HiveAuth.propTypes = {
  setQRcodeForAuth: PropTypes.func,
  onCloseSingIn: PropTypes.func,
  text: PropTypes.string,
  style: PropTypes.shape({}),
  buttonStyle: PropTypes.shape({}),
};

HiveAuth.defaultProps = {
  text: 'Continue with HiveAuth',
  style: {},
  buttonStyle: {},
};

export default HiveAuth;
