import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { isEmpty } from 'lodash';

import { Button, Checkbox, Form, Input, message, Select } from 'antd';
import validateRules from '../../constants/validateRules';
import { checkkNs } from '../../../../waivioApi/ApiClient';
import WebsitePricing from '../WebsitePricing/WebsitePricing';

const CreateCustomWebsite = ({
  intl,
  form,
  template,
  loading,
  showingParentList,
  handleSearchHost,
  onSelect,
  createWebsite,
  availableStatus,
  statusMessageClassList,
}) => {
  const idProd = ['production']?.includes(process.env.NODE_ENV);
  const history = useHistory();
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      checkkNs(form.getFieldValue('host')).then(res => {
        if (res.message) message.error(res.message);
        if (res.result) {
          createWebsite(
            {
              host: values?.host,
              parent: values?.parent,
            },
            history,
          ).then(() => form.resetFields());
        }
      });
    });
  };

  return (
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
                defaultValue={idProd ? 'social.gifts' : 'socialgifts.pp.ua'}
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
                id: 'add_domain_for_your_website',
                defaultMessage: 'Add a domain for your website:',
              })}
            </span>
          </h3>
          <div className="CreateWebsite__domain-wrap">
            {form.getFieldDecorator('host', {
              rules: validateRules.host,
              getValueFromEvent: e => e.target.value.toLowerCase(),
            })(
              <Input
                placeholder={intl.formatMessage({
                  id: 'enter_custom_domain',
                  defaultMessage: 'Enter custom domain (e.g., example.com)',
                })}
                disabled={!template}
                id="domain"
              />,
            )}
          </div>
        </Form.Item>
        {!isEmpty(availableStatus) && (
          <span className={statusMessageClassList}>{intl.formatMessage(availableStatus.intl)}</span>
        )}
        <p>
          {intl.formatMessage({
            id: 'please_review_the',
            defaultMessage: 'Please review the',
          })}{' '}
          <a
            href="https://www.waivio.com/object/qym-custom-domain/page"
            rel="noopener noreferrer"
            target="_blank"
          >
            {intl.formatMessage({
              id: 'domain_settings',
              defaultMessage: 'Domain settings and instructions',
            })}
          </a>{' '}
          {intl.formatMessage({
            id: 'before_proceeding',
            defaultMessage: 'before proceeding',
          })}
          .
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
      <WebsitePricing />
    </div>
  );
};

CreateCustomWebsite.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  availableStatus: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  template: PropTypes.string,
  createWebsite: PropTypes.func,
  showingParentList: PropTypes.arrayOf(PropTypes.shape()),
  statusMessageClassList: PropTypes.string,
  handleSearchHost: PropTypes.func,
  onSelect: PropTypes.func,
};

CreateCustomWebsite.defaultProps = {};

export default CreateCustomWebsite;
