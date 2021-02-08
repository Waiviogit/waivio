import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { get, isEmpty, size } from 'lodash';
import { Checkbox } from 'antd';
import Loading from '../../Icon/Loading';

import './DynamicTable.less';

export const DynamicTable = ({ header, bodyConfig, intl, onChange, deleteItem, emptyTitle }) => {
  const getTdBodyType = (item, head) => {
    if (get(item, 'pending', []).includes(head.type))
      return <Loading data-test={`loading/${item.host}`} />;

    switch (head.type) {
      case 'checkbox':
        return (
          <Checkbox
            className="DynamicTable__checkbox"
            data-key={`check/${item.host}`}
            checked={item.checked}
            onChange={e => onChange(e, item)}
          />
        );

      case 'delete':
        return (
          <a role="presentation" className="DynamicTable__delete" onClick={() => deleteItem(item)}>
            {intl.formatMessage({ id: 'delete', defaultMessage: 'Delete' })}
          </a>
        );

      default:
        return get(item, head.id);
    }
  };

  return (
    <table className="DynamicTable">
      <thead>
        <tr>
          {header.map(th => (
            <th key={th.id}>{intl.formatMessage(th.intl)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isEmpty(bodyConfig) ? (
          <tr>
            <td colSpan={size(header)}>
              {emptyTitle ||
                intl.formatMessage({
                  id: 'empty_dynamic_table',
                  defaultMessage: "You haven't had any payments yet",
                })}
            </td>
          </tr>
        ) : (
          bodyConfig.map(item => (
            <tr key={get(item, '_id')}>
              {header.map(head => (
                <td key={head.id} style={head.style || {}}>
                  {head.checkShowItem
                    ? head.checkShowItem(item, getTdBodyType)
                    : getTdBodyType(item, head)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

DynamicTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  header: PropTypes.arrayOf(PropTypes.shape()),
  bodyConfig: PropTypes.arrayOf(PropTypes.shape()),
  onChange: PropTypes.func,
  deleteItem: PropTypes.func,
  emptyTitle: PropTypes.string,
};

DynamicTable.defaultProps = {
  manageInfo: {},
  header: [],
  bodyConfig: [],
  onChange: () => {},
  deleteItem: () => {},
  emptyTitle: '',
};

export default injectIntl(DynamicTable);
