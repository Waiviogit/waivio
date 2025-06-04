import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, DatePicker, Button, Select } from 'antd';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import { useHistory } from 'react-router';

import DynamicTbl from '../../../components/Tools/DynamicTable/DynamicTable';
import Loading from '../../../components/Icon/Loading';
import { selectFormatDate } from '../../../wallet/WalletHelper';
import { configActionsWebsitesTableHeader } from '../../constants/tableConfig';
import {
  getActionsWebsiteInfo,
  getMoreActionsWebsiteInfo,
} from '../../../../store/websiteStore/websiteActions';
import { getLocale } from '../../../../store/settingsStore/settingsSelectors';
import { getActions } from '../../../../store/websiteStore/websiteSelectors';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { getAllActiveSites, getWebsites } from '../../../../waivioApi/ApiClient';
import './ReportsWebsite.less';

const ActionsWebsite = ({
  isAdmin = false,
  intl,
  form,
  reportsInfo,
  getActionsInfo,
  locale,
  userName,
  getMoreActionsInfo,
}) => {
  const limit = 20;
  const [sites, setSites] = useState([]);
  const [data, setFormData] = useState({});
  const [loadingMore, setLoadingMore] = useState(false);
  const { getFieldDecorator, resetFields, getFieldValue } = form;
  const formatDate = selectFormatDate(locale);
  const history = useHistory();

  useEffect(() => {
    setFormData({});
  }, [getFieldValue('host')]);
  useEffect(() => {
    resetFields();
    getActionsInfo(isAdmin, { skip: 0, limit });
    isAdmin
      ? getAllActiveSites().then(list => setSites(list.map(i => i.host)))
      : getWebsites(userName).then(list => setSites(list.map(i => i.host)));
  }, [history.location.pathname]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      await getMoreActionsInfo(isAdmin, {
        skip: reportsInfo.payments.length,
        limit,
        ...data,
      });
    } finally {
      setLoadingMore(false);
    }
  };
  const disabledDate = current => current > moment().endOf('day');

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const formData = {
          skip: 0,
          limit,
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
        setFormData(formData);
        getActionsInfo(isAdmin, formData);
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
                    id: 'select_website',
                    defaultMessage: 'Select the website:',
                  })}
                </span>
              </h3>
              {getFieldDecorator('host')(
                <Select showSearch>
                  <Select.Option key={'all'}>
                    {intl.formatMessage({
                      id: 'all',
                      defaultMessage: 'All',
                    })}
                  </Select.Option>
                  {sites?.map(domain => (
                    <Select.Option key={domain} value={domain}>
                      {domain}
                    </Select.Option>
                  ))}
                </Select>,
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
            loading={loadingMore}
            handleShowMore={loadMore}
            showMore={reportsInfo.hasMore}
            header={configActionsWebsitesTableHeader}
            bodyConfig={reportsInfo?.payments}
          />
          <br />
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
    resetFields: PropTypes.func,
    getFieldValue: PropTypes.func,
  }).isRequired,
  getActionsInfo: PropTypes.func.isRequired,
  getMoreActionsInfo: PropTypes.func.isRequired,
  reportsInfo: PropTypes.shape({
    ownerAppNames: PropTypes.arrayOf(PropTypes.string),
    payments: PropTypes.arrayOf({}),
    hasMore: PropTypes.bool,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool,
};

export default connect(
  state => ({
    reportsInfo: getActions(state),
    locale: getLocale(state),
    userName: getAuthenticatedUserName(state),
  }),
  {
    getActionsInfo: getActionsWebsiteInfo,
    getMoreActionsInfo: getMoreActionsWebsiteInfo,
  },
)(Form.create()(injectIntl(ActionsWebsite)));
