import moment from 'moment';
import * as React from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import './ModalBodyDate.less';

const ModalBodyDate = ({ intl, onChange, value }) => {
  const disableDate = currentDate => !currentDate.isSameOrAfter(moment());

  return (
    <div className="modalBodyDate">
      <p className="modalBodyDate_title">{intl.formatMessage({ id: 'matchBot_expiry_date' })}</p>
      <DatePicker allowClear={false} onChange={onChange} disabledDate={disableDate} value={value} />
    </div>
  );
};

ModalBodyDate.propTypes = {
  intl: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape().isRequired,
};

export default injectIntl(ModalBodyDate);
