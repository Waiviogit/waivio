import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { useRouteMatch } from 'react-router';
import { useSelector } from 'react-redux';

import { get, isEmpty, size, isNil, round } from 'lodash';
import { Checkbox, Modal, Radio } from 'antd';
import Loading from '../../Icon/Loading';
import USDDisplay from '../../Utils/USDDisplay';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import { getWebsiteConfiguration } from '../../../../store/appStore/appSelectors';
import { initialColors } from '../../../websites/constants/colors';

import './DynamicTable.less';

export const DynamicTable = ({
  header,
  bodyConfig,
  intl,
  onChange,
  onChangeRadio,
  deleteItem,
  emptyTitle,
  buttons,
  showMore,
  handleShowMore,
  disabledLink,
}) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(null);
  const configuration = useSelector(getWebsiteConfiguration);
  const mainColor = configuration.colors?.mapMarkerBody || initialColors.marker;
  const match = useRouteMatch();
  const getTdBodyType = (item, head) => {
    if (get(item, 'pending', []).includes(head.type)) return <Loading />;
    switch (head.type) {
      case 'checkbox':
        const getChecked = head.getChecked
          ? { checked: head.getChecked(item) }
          : { checked: item.checked };

        return (
          <Checkbox
            className="DynamicTable__checkbox"
            onChange={e => onChange(e, item)}
            {...(!isNil(get(item, 'checked')) || head.getChecked ? getChecked : {})}
          />
        );

      case 'radio':
        const getCanonicalChecked = { checked: item.useForCanonical };

        return (
          <Radio
            onChange={e => onChangeRadio(e, item)}
            {...(!isNil(get(item, 'useForCanonical')) ? getCanonicalChecked : {})}
          />
        );

      case 'delete':
        return (
          <a role="presentation" className="DynamicTable__delete" onClick={() => deleteItem(item)}>
            {head.name || intl.formatMessage({ id: 'delete', defaultMessage: 'Delete' })}
          </a>
        );

      case 'link':
        if (head.hideLink && head.hideLink(item)) return '-';

        return (
          <Link disabled={disabledLink} to={head.to(item, match)}>
            {head.name || item[head.id] || head?.getName(item)}
          </Link>
        );

      case 'websiteName':
        return item.status === 'active' ? (
          <a
            href={`https://${item.host || head?.getName(item)}`}
            target={'_blank'}
            rel="noreferrer"
          >
            {item[head.id] || head?.getName(item)}
          </a>
        ) : (
          <span>{item[head.id] || head?.getName(item)}</span>
        );

      case 'date':
        return moment(item[head.id]).format('DD-MMM-YYYY');

      case 'round':
        return round(item[head.id], head.precision) || 0;

      case 'currency':
        return <USDDisplay currencyDisplay={head.view} value={item[head.id]} />;

      case 'list':
        return (
          <>
            {item[head.id]?.map(i => {
              const value = head.key ? i[head.key] : i;

              return <p key={value}>{value}</p>;
            })}
          </>
        );

      case 'openModal':
        let label = item[head.id];

        switch (head.id) {
          case 'objectsPosted':
            label = item.objectsLinks?.length;
            break;
          case 'usersProcessed':
            label = item.usersProcessed;
            break;
          case 'groupPermlink':
            label = 1;
            break;
          default:
            item[head.id];
        }
        const openLink =
          head.id === 'objectsPosted' ? item.objectsLinks?.length > 0 : item[head.id];

        return (
          <React.Fragment>
            <span
              style={openLink ? { color: mainColor, cursor: 'pointer' } : {}}
              onClick={() => {
                if (openLink)
                  setModalVisible({
                    ...head.modal,
                    body: head.modal.body(item),
                  });
              }}
            >
              {Array.isArray(item[head.id]) ? item[head.id].length : label}
            </span>
          </React.Fragment>
        );

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
            <th key={th.id}>{th.intl && intl.formatMessage(th.intl, th.value)}</th>
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
      {modalVisible && (
        <Modal
          title={modalVisible.title}
          visible={modalVisible}
          onCancel={() => setModalVisible(null)}
          onOk={() => setModalVisible(null)}
          footer={null}
          className={'DynamicTable__modal'}
        >
          {modalVisible.body}
        </Modal>
      )}
    </table>
  );
};

DynamicTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  header: PropTypes.arrayOf(PropTypes.shape()),
  bodyConfig: PropTypes.arrayOf(PropTypes.shape()),
  onChange: PropTypes.func,
  onChangeRadio: PropTypes.func,
  deleteItem: PropTypes.func,
  handleShowMore: PropTypes.func,
  emptyTitle: PropTypes.string,
  showMore: PropTypes.bool,
  disabledLink: PropTypes.bool,
  buttons: PropTypes.shape({}),
};

DynamicTable.defaultProps = {
  manageInfo: {},
  header: [],
  bodyConfig: [],
  onChange: () => {},
  onChangeRadio: () => {},
  handleShowMore: () => {},
  deleteItem: () => {},
  emptyTitle: '',
  buttons: {},
  showMore: false,
};

export default injectIntl(DynamicTable);
