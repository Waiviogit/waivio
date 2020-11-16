import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, AutoComplete, DatePicker, Button } from 'antd';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import Affix from '../../../components/Utils/Affix';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';
import DynamicTbl from '../../../components/Tools/DynamicTable/DynamicTable';
import Loading from '../../../components/Icon/Loading';
import { selectFormatDate } from '../../../wallet/WalletHelper';
import { configReportsWebsitesTableHeader } from '../../constants/tableConfig';
import { getReportsWebsiteInfo } from '../../websiteActions';
import { getLocale, getReports } from '../../../reducers';

import './ReportsWebsite.less';

const ReportsWebsite = ({ intl, form, getReportsInfo, reportsInfo, locale }) => {
  const { getFieldDecorator } = form;
  const formatDate = selectFormatDate(locale);

  useEffect(() => {
    getReportsInfo();
  }, []);

  const disabledDate = current => current > moment().endOf('day');

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const formData = {
          ...(values.parent && values.parent !== 'All' ? { parent: values.parent } : {}),
          ...(values.startDate
            ? {
                startDate: moment(values.startDate)
                  .startOf('day')
                  .unix(),
              }
            : {}),
          ...(values.endDate ? { endDate: moment(values.endDate).unix() } : {}),
        };

        getReportsInfo(formData);
      }
    });
  };

  return (
    <div className="shifted">
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'reports_for_websites',
            defaultMessage: 'Reports for websites:',
          })}{' '}
          - Waivio
        </title>
      </Helmet>
      <div className="settings-layout container">
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        {isEmpty(reportsInfo) ? (
          <Loading />
        ) : (
          <div className="center">
            <MobileNavigation />
            <h1>
              <FormattedMessage id="reports_for_websites" defaultMessage="Reports for websites:" />
            </h1>
            <Form onSubmit={handleSubmit}>
              <Form.Item>
                <h3>
                  <span className="ant-form-item-required">
                    {intl.formatMessage({
                      id: 'select_website_template',
                      defaultMessage: 'Select website template:',
                    })}
                  </span>
                </h3>
                {getFieldDecorator('parent')(
                  <AutoComplete>
                    <AutoComplete.Option key={'all'} value={''}>
                      {intl.formatMessage({
                        id: 'all',
                        defaultMessage: 'All',
                      })}
                    </AutoComplete.Option>
                    {reportsInfo.ownerAppNames.map(domain => (
                      <AutoComplete.Option key={domain} value={domain}>
                        {domain}
                      </AutoComplete.Option>
                    ))}
                  </AutoComplete>,
                )}
              </Form.Item>
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
                  disabled={!form.isFieldsTouched(['parent', 'startDate', 'endDate'])}
                >
                  {intl.formatMessage({
                    id: 'generate_report',
                    defaultMessage: 'Generate report',
                  })}
                </Button>
              </Form.Item>
            </Form>
            <DynamicTbl
              header={configReportsWebsitesTableHeader}
              bodyConfig={reportsInfo.payments}
            />
          </div>
        )}
      </div>
    </div>
  );
};

ReportsWebsite.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFields: PropTypes.func,
    isFieldsTouched: PropTypes.func,
  }).isRequired,
  getReportsInfo: PropTypes.func.isRequired,
  reportsInfo: PropTypes.shape({
    ownerAppNames: PropTypes.arrayOf(PropTypes.string),
    payments: PropTypes.arrayOf({}),
  }).isRequired,
  locale: PropTypes.string.isRequired,
};

export default connect(
  state => ({
    reportsInfo: getReports(state),
    locale: getLocale(state),
  }),
  {
    getReportsInfo: getReportsWebsiteInfo,
  },
)(Form.create()(injectIntl(ReportsWebsite)));
