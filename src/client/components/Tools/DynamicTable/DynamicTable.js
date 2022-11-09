import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { get, isEmpty, size, isNil, round } from 'lodash';
import { Checkbox } from 'antd';
import Loading from '../../Icon/Loading';

import './DynamicTable.less';
import USDDisplay from '../../Utils/USDDisplay';
import { isMobile } from '../../../../common/helpers/apiHelpers';

export const DynamicTable = ({
  header,
  bodyConfig,
  intl,
  onChange,
  deleteItem,
  emptyTitle,
  buttons,
  showMore,
  handleShowMore,
}) => {
  const [loading, setLoading] = useState(false);
  const getTdBodyType = (item, head) => {
    if (get(item, 'pending', []).includes(head.type)) return <Loading />;

    switch (head.type) {
      case 'checkbox':
        return (
          <Checkbox
            className="DynamicTable__checkbox"
            onChange={e => onChange(e, item)}
            {...(!isNil(get(item, 'checked')) ? { checked: item.checked } : {})}
          />
        );

      case 'delete':
        return (
          <a role="presentation" className="DynamicTable__delete" onClick={() => deleteItem(item)}>
            {intl.formatMessage({ id: 'delete', defaultMessage: 'Delete' })}
          </a>
        );

      case 'link':
        return <Link to={head.to(item)}>{item[head.id]}</Link>;

      case 'date':
        return moment(item[head.id]).format('DD-MMM-YYYY');

      case 'round':
        return round(item[head.id], head.precision) || 0;

      case 'currency':
        return <USDDisplay value={item[head.id]} />;

      default: {
        let button = get(buttons, head.id);

        if (typeof button === 'function') button = button(item);

        return (
          <React.Fragment>
            {get(item, head.id)}
            {button}
          </React.Fragment>
        );
      }
    }
  };

  const filteredHeader = header.filter(head => !(head.hideForMobile && isMobile()));

  return (
    <table className="DynamicTable">
      <thead>
        <tr>
          {filteredHeader.map(th => (
            <th key={th.id}>{th.intl && intl.formatMessage(th.intl)}</th>
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
          bodyConfig.map(item => {
            if (!item) {
              return null;
            }

            return (
              <tr key={get(item, '_id')}>
                {filteredHeader.map(head => (
                  <td key={head.id} style={head.style || {}}>
                    {head.checkShowItem
                      ? head.checkShowItem(item, getTdBodyType)
                      : getTdBodyType(item, head)}
                  </td>
                ))}
              </tr>
            );
          })
        )}
        {showMore && (
          <tr
            onClick={() => {
              setLoading(true);

              return handleShowMore().then(() => setLoading(false));
            }}
          >
            <td colSpan={size(header)} className="DynamicTable__showMore">
              {loading ? (
                <Loading />
              ) : (
                intl.formatMessage({ id: 'show_more', defaultMessage: 'Show more' })
              )}
            </td>
          </tr>
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
  handleShowMore: PropTypes.func,
  emptyTitle: PropTypes.string,
  showMore: PropTypes.bool,
  buttons: PropTypes.shape({}),
};

DynamicTable.defaultProps = {
  manageInfo: {},
  header: [],
  bodyConfig: [],
  onChange: () => {},
  handleShowMore: () => {},
  deleteItem: () => {},
  emptyTitle: '',
  buttons: {},
  showMore: false,
};

export default injectIntl(DynamicTable);
