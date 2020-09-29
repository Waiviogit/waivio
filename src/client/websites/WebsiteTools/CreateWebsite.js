import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Input, AutoComplete, Checkbox, Form, Button } from 'antd';

import Affix from '../../components/Utils/Affix';
import LeftSidebar from '../../app/Sidebar/LeftSidebar';
import MobileNavigation from '../../components/Navigation/MobileNavigation/MobileNavigation';
import validateRules from './validateRules';

const CreateWebsite = ({ intl, form }) => {
  const [template, setTemplate] = useState('');
  const { getFieldDecorator } = form;
  // const handleSubmit = e => {};
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
          <Form>
            <Form.Item>
              <h3>
                <span className="ant-form-item-required">
                  {intl.formatMessage({
                    id: 'select_website_template',
                    defaultMessage: 'Select website template:',
                  })}
                </span>
              </h3>
              <div>
                <AutoComplete onSelect={setTemplate}>
                  <AutoComplete.Option key="" value="" />
                  <AutoComplete.Option key="Dining.Gifts" value="Dining.Gifts">
                    Dining.Gifts
                  </AutoComplete.Option>
                </AutoComplete>
              </div>
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
              <div>
                {getFieldDecorator('domain', {
                  rules: validateRules.domain,
                })(<Input />)}
                {template}
              </div>
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
              <Button type="submit">Create website</Button>
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
};

export default Form.create()(injectIntl(CreateWebsite));
