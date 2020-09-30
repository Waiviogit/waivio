import React, { useCallback, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Input, AutoComplete, Checkbox, Form, Button } from 'antd';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

import Affix from '../../../components/Utils/Affix';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';
import validateRules from '../constants/validateRules';
import { checkAvailableDomain, getParentDomainList } from '../../websiteActions';
import { getParentDomain } from '../../../reducers';

import './CreateWebsite.less';

const CreateWebsite = ({ intl, form, getDomainList, parentDomain, checkStatusAvailableDomain }) => {
  const [template, setTemplate] = useState('');
  const [availableDomain, setAvailableDomainStatus] = useState('');
  const domainNamesList = Object.keys(parentDomain);
  const setDomainStatus = () =>
    checkStatusAvailableDomain(form.getFieldValue('domain'), parentDomain[template])
      .then(() => setAvailableDomainStatus('Available'))
      .catch(e => console.log(e));

  const domainStatus = useCallback(debounce(setDomainStatus, 300), []);
  useEffect(() => {
    getDomainList();
  }, []);

  const { getFieldDecorator } = form;
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => console.log(values));
  };

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
          <Form className="CreateWebsite" onSubmit={handleSubmit}>
            <Form.Item>
              <h3>
                <span className="ant-form-item-required">
                  {intl.formatMessage({
                    id: 'select_website_template',
                    defaultMessage: 'Select website template:',
                  })}
                </span>
              </h3>
              {getFieldDecorator('autocomplete', {
                rules: validateRules.autocomplete,
              })(
                <AutoComplete onSelect={setTemplate}>
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
                })(<Input onInput={domainStatus} />)}
                <span className="CreateWebsite__domain-name">.{template}</span>
              </div>
              <span>{availableDomain}</span>
            </Form.Item>
            <p>It will be used as a second level domain name.</p>
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
              <Button type="primary" htmlType="submit">
                Create website
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
  parentDomain: PropTypes.arrayOf(PropTypes.string).isRequired,
  checkStatusAvailableDomain: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    parentDomain: getParentDomain(state),
  }),
  {
    getDomainList: getParentDomainList,
    checkStatusAvailableDomain: checkAvailableDomain,
  },
)(Form.create()(injectIntl(CreateWebsite)));
