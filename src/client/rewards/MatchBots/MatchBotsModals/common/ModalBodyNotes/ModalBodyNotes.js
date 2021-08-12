import * as React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import './ModalBodyNotes.less';

const ModalBodyNotes = ({ intl, onChange, textAreaValue }) => {
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(textAreaValue);
  }, []);
  const handleChange = event => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className="modalBodyNotes">
      <p className="modalBodyNotes_title">{intl.formatMessage({ id: 'match_bot_notes' })}</p>
      <Input.TextArea maxLength={255} value={value} onChange={handleChange} />
    </div>
  );
};

ModalBodyNotes.propTypes = {
  intl: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string.isRequired,
};

export default injectIntl(ModalBodyNotes);
