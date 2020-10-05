import React, { useCallback, useEffect } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Input, AutoComplete, Checkbox, Form, Button, message } from 'antd';
import { connect } from 'react-redux';
import { debounce, get, isEmpty } from 'lodash';

import Affix from '../../../components/Utils/Affix';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';
import validateRules from '../constants/validateRules';
import { checkAvailableDomain, createNewWebsite, getParentDomainList } from '../../websiteActions';
import { getDomainAvailableStatus, getParentDomain, getWebsiteLoading } from '../../../reducers';

import './CreateWebsite.less';

const CreateWebsite = ({
  intl,
  form,
  getDomainList,
  parentDomain,
  checkStatusAvailableDomain,
  availableStatus,
  createWebsite,
  loading,
}) => {
  const { getFieldDecorator, getFieldValue } = form;
  const template = getFieldValue('parent');
  const subDomain = getFieldValue('domain');
  const domainNamesList = Object.keys(parentDomain);
  const available = get(availableStatus, 'status');
  const statusMessageClassList = available ? 'CreateWebsite__available' : 'CreateWebsite__error';
  const domainStatus = useCallback(
    debounce(
      () => checkStatusAvailableDomain(getFieldValue('domain'), parentDomain[template]),
      300,
    ),
    [template],
  );

  useEffect(() => {
    getDomainList();
  }, []);

  useEffect(() => {
    if (subDomain) domainStatus();
  }, [template]);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err && available)
        createWebsite(values)
          .then(() => form.resetFields())
          .catch(error => message.error(error));
    });
  };
  console.log(availableStatus);
  console.log(loading);
  return (
    <div className="shifted">
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'create_new_website',
            defaultMessage: 'Create new website',
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
        <div className="center">
          <MobileNavigation />
          <h1>
            <FormattedMessage id="create_new_website" defaultMessage="Create new website" />
          </h1>
          <Form className="CreateWebsite" id="CreateWebsite" onSubmit={handleSubmit}>
            <Form.Item>
              <h3>
                <span className="ant-form-item-required">
                  {intl.formatMessage({
                    id: 'select_website_template',
                    defaultMessage: 'Select website template:',
                  })}
                </span>
              </h3>
              {getFieldDecorator('parent', {
                rules: validateRules.autocomplete,
              })(
                <AutoComplete>
                  {domainNamesList.map(domain => (
                    <AutoComplete.Option key={domain} value={domain}>
                      {domain}
                    </AutoComplete.Option>
                  ))}
                </AutoComplete>,
              )}
            </Form.Item>
            <Form.Item>
              <h3>
                <span className="ant-form-item-required">
                  {intl.formatMessage({
                    id: 'name_website',
                    defaultMessage: 'Specify name for your website:',
                  })}
                </span>
              </h3>
              <div className="CreateWebsite__domain-wrap">
                {getFieldDecorator('domain', {
                  rules: validateRules.domain,
                })(<Input disabled={!template} onInput={domainStatus} />)}
                {template && <span className="CreateWebsite__domain-name">.{template}</span>}
              </div>
            </Form.Item>
            {!isEmpty(availableStatus) && (
              <span className={statusMessageClassList}>
                {intl.formatMessage(availableStatus.intl)}
              </span>
            )}
            <p>
              {intl.formatMessage({
                id: 'info_level_domain_name',
                defaultMessage: 'It will be used as a second level domain name.',
              })}
            </p>
            <Form.Item>
              {getFieldDecorator('politics', {
                rules: validateRules.politics,
              })(
                <Checkbox>
                  <span className="ant-form-item-required">
                    {intl.formatMessage({
                      id: 'website_create_alerts_info',
                      defaultMessage:
                        'I have read and agree to the terms and conditions of the Web Hosting Service Agreement',
                    })}
                  </span>
                </Checkbox>,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {intl.formatMessage({
                  id: 'create_website',
                  defaultMessage: 'Create website',
                })}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

CreateWebsite.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  getDomainList: PropTypes.func.isRequired,
  createWebsite: PropTypes.func.isRequired,
  parentDomain: PropTypes.arrayOf(PropTypes.string).isRequired,
  checkStatusAvailableDomain: PropTypes.func.isRequired,
  availableStatus: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};

CreateWebsite.defaultProps = {
  availableStatus: '',
};

export default connect(
  state => ({
    parentDomain: getParentDomain(state),
    availableStatus: getDomainAvailableStatus(state),
    loading: getWebsiteLoading(state),
  }),
  {
    getDomainList: getParentDomainList,
    checkStatusAvailableDomain: checkAvailableDomain,
    createWebsite: createNewWebsite,
  },
)(Form.create()(injectIntl(CreateWebsite)));
