import React, { useState } from 'react';
import { Input, Modal } from 'antd';
import PropTypes from 'prop-types';

import './ConfigHeader.less';

const ConfigHeader = ({
  visible,
  config,
  onClose,
  handleSubmitConfig,
  loading,
  withioutMessage,
}) => {
  const [name, setName] = useState(config?.name);
  const [message, setMessage] = useState(config?.message);
  // const [startup, setStartup] = useState(config?.startup);
  const handleOk = () => handleSubmitConfig({ name, message });

  return (
    <Modal
      visible={visible}
      title="Edit website header"
      okText={'Save'}
      className="ConfigHeader"
      onOk={handleOk}
      onCancel={onClose}
      okButtonProps={{
        loading,
      }}
      cancelButtonProps={{
        disabled: loading,
      }}
    >
      <div>
        <h3>Website name:</h3>
        <Input maxLength={30} value={name} onChange={e => setName(e.target.value)} />
      </div>
      {!withioutMessage && (
        <div>
          <h3>Message:</h3>
          <Input maxLength={50} value={message} onChange={e => setMessage(e.target.value)} />
        </div>
      )}
      {/* <div> */}
      {/*  <h3>Starup page:</h3> */}
      {/*  <Select */}
      {/*    defaultValue={startup} */}
      {/*    onChange={key => setStartup(key)} */}
      {/*    className="ConfigHeader__select" */}
      {/*  > */}
      {/*    <Select.Option key={'map'}>MAP</Select.Option> */}
      {/*    <Select.Option key={'about'}>ABOUT</Select.Option> */}
      {/*  </Select> */}
      {/* </div> */}
    </Modal>
  );
};

ConfigHeader.propTypes = {
  visible: PropTypes.bool,
  config: PropTypes.shape({
    name: PropTypes.string,
    message: PropTypes.string,
  }),
  onClose: PropTypes.func,
  handleSubmitConfig: PropTypes.func,
  loading: PropTypes.bool,
  withioutMessage: PropTypes.bool,
};

export default ConfigHeader;
