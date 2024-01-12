import { Input, Button } from 'antd';
import React, { useState } from 'react';

import './HiveAuth.less';

const HiveAuth = ({setQRcodeForAuth}) => {
  const [showInput, setShowInput] = useState();

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
          <Button onClick={setQRcodeForAuth} className="HiveAuth__signIn">Sing in</Button>
        </React.Fragment>
      ) : (
        <span onClick={() => setShowInput(true)}>Continue with HiveAuth</span>
      )}
    </div>
  );
};

export default HiveAuth;
