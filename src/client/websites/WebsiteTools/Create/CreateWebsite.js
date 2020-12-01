import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { AutoComplete, Button, Checkbox, Input, Form, message } from 'antd';
import { connect } from 'react-redux';
import { debounce, get, isEmpty } from 'lodash';

import validateRules from '../../constants/validateRules';
import { checkAvailableDomain, createNewWebsite, getParentDomainList } from '../../websiteActions';
import { getDomainAvailableStatus, getParentDomain, getWebsiteLoading } from '../../../reducers';

import './CreateWebsite.less';

export const CreateWebsite = ({
  intl,
  form,
  getDomainList,
  parentDomain,
  checkStatusAvailableDomain,
  availableStatus,
  createWebsite,
  loading,
  history,
}) => {
  const { getFieldDecorator, getFieldValue } = form;
  const [searchString, setSearchString] = useState('');
  const [saveWebsite, setWebSiteSave] = useState(false);
  const template = getFieldValue('parent');
  const subDomain = getFieldValue('domain');
  const domainNamesList = Object.keys(parentDomain);
  const showingParentList = searchString
    ? domainNamesList.filter(host => host.includes(searchString))
    : domainNamesList;
  const available = get(availableStatus, 'status');
  const statusMessageClassList = available ? 'CreateWebsite__available' : 'CreateWebsite__error';
  const domainStatus = useCallback(
    debounce(
      () => checkStatusAvailableDomain(getFieldValue('domain'), parentDomain[template]),
      300,
    ),
    [template],
  );

  const handleSearchHost = useCallback(
    debounce(value => setSearchString(value), 300),
    [],
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
      if (!err && available) {
        createWebsite(values, history)
          .then(() => form.resetFields())
          .catch(error => message.error(error));
        setWebSiteSave(true);
      }
    });
  };

  return (
    <div className="center">
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
          })(<div />)}
          <AutoComplete
            onSelect={value => {
              form.setFieldsValue({ parent: value });
            }}
            onChange={value => handleSearchHost(value)}
          >
            {showingParentList.map(domain => (
              <AutoComplete.Option key={domain} value={domain}>
                {domain}
              </AutoComplete.Option>
            ))}
          </AutoComplete>
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
            })(<Input disabled={!template} id="domain" onInput={domainStatus} />)}
            {template && <span className="CreateWebsite__domain-name">.{template}</span>}
          </div>
        </Form.Item>
        {!isEmpty(availableStatus) && (
          <span className={statusMessageClassList}>{intl.formatMessage(availableStatus.intl)}</span>
        )}
        <p>
          {intl.formatMessage({
            id: 'info_level_domain_name',
            defaultMessage: 'It will be used as a second level domain name.',
          })}
        </p>
        <Form.Item className="CreateWebsite__checkbox-wrap">
          {getFieldDecorator('politics', {
            rules: validateRules.politics,
          })(
            <Checkbox>
              <span className="ant-form-item-required">
                {intl.formatMessage({
                  id: 'website_create_alerts_info',
                  defaultMessage: 'I have read and agree to the terms and conditions of the',
                })}{' '}
                <a
                  href="https://www.waivio.com/object/snn-web-hosting-agreement/page"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {intl.formatMessage({
                    id: 'web_hosting_service',
                    defaultMessage: 'Web Hosting Service Agreement',
                  })}
                </a>
              </span>
            </Checkbox>,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saveWebsite && loading}>
            {intl.formatMessage({
              id: 'create_website',
              defaultMessage: 'Create website',
            })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

CreateWebsite.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
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
