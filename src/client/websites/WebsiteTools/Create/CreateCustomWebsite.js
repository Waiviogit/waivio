import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { Button, Checkbox, Form, Input, Select } from 'antd';
import validateRules from '../../constants/validateRules';

const CreateCustomWebsite = ({
  intl,
  form,
  template,
  availableStatus,
  handleSubmit,
  loading,
  domainStatus,
  showingParentList,
  statusMessageClassList,
  handleSearchHost,
  onSelect,
}) => (
  <div>
    <h1>
      {intl.formatMessage({
        id: 'create_new_website_custom',
        defaultMessage: 'Create a new website with custom domain',
      })}
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
        {form.getFieldDecorator('parent', {
          rules: validateRules.autocomplete,
        })(
          <div className="CreateWebsite__parent-wrap">
            <Select
              showSearch
              onSelect={onSelect}
              onChange={handleSearchHost}
              placeholder={intl.formatMessage({
                id: 'select_template',
                defaultMessage: 'Select  template:',
              })}
            >
              {showingParentList.map(domain => (
                <Select.Option key={domain} value={domain}>
                  {domain}
                </Select.Option>
              ))}
            </Select>
          </div>,
        )}
      </Form.Item>
      <Form.Item className="CreateWebsite__padding">
        <h3>
          <span className="ant-form-item-required">
            {intl.formatMessage({
              id: 'name_website',
              defaultMessage: 'Specify name for your website:',
            })}
          </span>
        </h3>
        <div className="CreateWebsite__domain-wrap">
          {form.getFieldDecorator('domain', {
            rules: validateRules.domain,
            getValueFromEvent: e => e.target.value.toLowerCase(),
          })(
            <Input
              placeholder={intl.formatMessage({
                id: 'enter_name',
                defaultMessage: 'Enter name',
              })}
              disabled={!template}
              id="domain"
              onInput={domainStatus}
            />,
          )}
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
        {form.getFieldDecorator('politics', {
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
        <Button type="primary" htmlType="submit" loading={loading}>
          {intl.formatMessage({
            id: 'create_website',
            defaultMessage: 'Create website',
          })}
        </Button>
      </Form.Item>
    </Form>
  </div>
);

CreateCustomWebsite.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  availableStatus: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  template: PropTypes.string,
  handleSubmit: PropTypes.func,
  domainStatus: PropTypes.string,
  showingParentList: PropTypes.arrayOf(),
  statusMessageClassList: PropTypes.string,
  handleSearchHost: PropTypes.func,
  onSelect: PropTypes.func,
};

CreateCustomWebsite.defaultProps = {
  availableStatus: '',
};

export default CreateCustomWebsite;
