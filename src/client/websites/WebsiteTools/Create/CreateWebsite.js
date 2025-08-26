import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Input, Form, Select } from 'antd';
import { isEmpty } from 'lodash';

import validateRules from '../../constants/validateRules';
import WebsitePricing from '../WebsitePricing/WebsitePricing';
import './CreateWebsite.less';

const CreateWebsite = ({
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
}) => {
  const idProd = ['production']?.includes(process.env.NODE_ENV);

  return (
    <div>
      <h1>
        {intl.formatMessage({
          id: 'create_new_website',
          defaultMessage: 'Create a new website:',
        })}
      </h1>
      <Form className="CreateWebsite" id="CreateWebsite" onSubmit={handleSubmit}>
        <Form.Item>
          <h3>
            <span className="ant-form-item-required">
              {intl.formatMessage({
                id: 'select_website_template_top_level',
                defaultMessage: 'Select the website template and top-level domain:',
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

CreateWebsite.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  availableStatus: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  template: PropTypes.string,
  handleSubmit: PropTypes.func,
  domainStatus: PropTypes.string,
  showingParentList: PropTypes.arrayOf(PropTypes.shape()),
  statusMessageClassList: PropTypes.string,
  handleSearchHost: PropTypes.func,
  onSelect: PropTypes.func,
};

CreateWebsite.defaultProps = {
  availableStatus: '',
};

export default CreateWebsite;
