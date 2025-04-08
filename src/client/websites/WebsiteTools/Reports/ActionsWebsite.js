import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, AutoComplete, DatePicker, Button } from 'antd';
import { connect } from 'react-redux';
import { isEmpty, debounce } from 'lodash';
import classNames from 'classnames';

import DynamicTbl from '../../../components/Tools/DynamicTable/DynamicTable';
import Loading from '../../../components/Icon/Loading';
import { selectFormatDate } from '../../../wallet/WalletHelper';
import { configActionsWebsitesTableHeader } from '../../constants/tableConfig';
import { getActionsWebsiteInfo } from '../../../../store/websiteStore/websiteActions';
import { getLocale } from '../../../../store/settingsStore/settingsSelectors';
import { getActions } from '../../../../store/websiteStore/websiteSelectors';

import './ReportsWebsite.less';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { getWebsites } from '../../../../waivioApi/ApiClient';

const ActionsWebsite = ({ intl, form, reportsInfo, getActionsInfo, locale, userName }) => {
  const [searchString, setSearchString] = useState('');
  const [sites, setSites] = useState([]);
  const handleSearchHost = useCallback(
    debounce(value => setSearchString(value), 300),
    [],
  );
  const showingParentList = searchString
    ? sites.filter(host => host.includes(searchString))
    : sites;
  const { getFieldDecorator } = form;
  const formatDate = selectFormatDate(locale);

  useEffect(() => {
    getActionsInfo();
    getWebsites(userName).then(list => setSites(list.map(i => i.host)));
  }, []);
  const disabledDate = current => current > moment().endOf('day');

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const formData = {
          ...(values.host && values.host !== 'all' ? { host: values.host } : {}),
          ...(values.startDate
            ? {
                startDate: moment(values.startDate)
                  .startOf('day')
                  .unix(),
              }
            : {}),
          ...(values.endDate ? { endDate: moment(values.endDate).unix() } : {}),
        };

        getActionsInfo(formData);
      }
    });
  };

  const classNameButton = classNames({ ReportsWebsite__button: locale === 'ru-RU' });

  return (
    <React.Fragment>
      {isEmpty(reportsInfo) ? (
        <Loading />
      ) : (
        <React.Fragment>
          <h1>
            <FormattedMessage id="payments_actions_website" defaultMessage="Actions on website" />:
          </h1>
          <Form onSubmit={handleSubmit}>
            <Form.Item>
              <h3>
                <span className="ant-form-item-required">
                  {intl.formatMessage({
                    id: 'select_website_template',
                    defaultMessage: 'Select the website:',
                  })}
                </span>
              </h3>
              {getFieldDecorator('host')(
                <AutoComplete onChange={handleSearchHost}>
                  <AutoComplete.Option key={'all'}>
                    {intl.formatMessage({
                      id: 'all',
                      defaultMessage: 'All',
                    })}
                  </AutoComplete.Option>
                  {showingParentList?.map(domain => (
                    <AutoComplete.Option key={domain} value={domain}>
                      {domain}
                    </AutoComplete.Option>
                  ))}
                </AutoComplete>,
              )}
            </Form.Item>
            <h3>
              <FormattedMessage id="select_period" defaultMessage="Select the period:" />
            </h3>
            <div className="ReportsWebsite__data-piker-wrapper">
              <Form.Item>
                {intl.formatMessage({
                  id: 'table_date_from',
                  defaultMessage: 'From:',
                })}
                {getFieldDecorator('startDate')(
                  <DatePicker
                    format={formatDate}
                    placeholder={intl.formatMessage({
                      id: 'table_start_date_picker',
                      defaultMessage: 'Select start date',
                    })}
                    disabledDate={disabledDate}
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {intl.formatMessage({
                  id: 'table_date_till',
                  defaultMessage: 'Till:',
                })}
                {getFieldDecorator('endDate')(
                  <DatePicker
                    format={formatDate}
                    placeholder={intl.formatMessage({
                      id: 'table_end_date_picker',
                      defaultMessage: 'Select end date',
                    })}
                    disabledDate={disabledDate}
                  />,
                )}
              </Form.Item>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!form.isFieldsTouched(['host', 'startDate', 'endDate'])}
                className={classNameButton}
              >
                {intl.formatMessage({
                  id: 'payments_generate_report',
                  defaultMessage: 'Generate report',
                })}
              </Button>
            </Form.Item>
          </Form>
          <DynamicTbl
            header={configActionsWebsitesTableHeader}
            bodyConfig={reportsInfo?.payments}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

ActionsWebsite.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFields: PropTypes.func,
    isFieldsTouched: PropTypes.func,
  }).isRequired,
  getActionsInfo: PropTypes.func.isRequired,
  reportsInfo: PropTypes.shape({
    ownerAppNames: PropTypes.arrayOf(PropTypes.string),
    payments: PropTypes.arrayOf({}),
  }).isRequired,
  locale: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

export default connect(
  state => ({
    reportsInfo: getActions(state),
    locale: getLocale(state),
    userName: getAuthenticatedUserName(state),
  }),
  {
    getActionsInfo: getActionsWebsiteInfo,
  },
)(Form.create()(injectIntl(ActionsWebsite)));
