import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { get } from 'lodash';
import { Checkbox } from 'antd';

import './DynamicTable.less';
import Loading from "../../Icon/Loading";

const DynamicTable = ({ header, bodyConfig, intl, onChange }) => {
  const checkLoading = (item, key) => {
    const value = get(item, key);

    return value === 'loading' ? <Loading /> : value;
  };
  const getTdBodyType = (item, head) => {
    switch (head.type) {
      case 'checkbox':
        return <Checkbox checked={item.checked} onChange={e => onChange(e, item)} />;

      default:
        return checkLoading(item, head.id);
    }
  };

  return (
    <table className="DynamicTable">
      <thead>
        {header.map(th => (
          <th key={th.id}>{intl.formatMessage(th.intl)}</th>
        ))}
      </thead>
      <tbody>
        {bodyConfig.map(item => (
          <tr key={get(item, '_id')}>
            {header.map(head => (
              <td key={head.id}>{getTdBodyType(item, head)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

DynamicTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  header: PropTypes.arrayOf(PropTypes.shape()),
  bodyConfig: PropTypes.arrayOf(PropTypes.shape()),
  onChange: PropTypes.func,
};

DynamicTable.defaultProps = {
  manageInfo: {},
  header: [],
  bodyConfig: [],
  onChange: () => {},
};

export default injectIntl(DynamicTable);
