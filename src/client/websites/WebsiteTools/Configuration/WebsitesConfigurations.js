import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Form, message, Modal, Avatar } from 'antd';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';

import { getWebsiteLoading } from '../../../reducers';
import ImageSetter from '../../../components/ImageSetter/ImageSetter';


export const WebsitesConfigurations = ({ intl, form, loading }) => {
  const { getFieldDecorator, getFieldValue } = form;
  const [modalsState, setModalState] = useState({});
  const handleModalState = data => setModalState(data);
  const mobileLogo = getFieldValue('mobileLogo');
  const desktopLogo = getFieldValue('desktopLogo');

  useEffect(() => {}, []);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) return values;
    });
  };

  return (
    <React.Fragment>
      <h1>
        <FormattedMessage id="website_configuration" defaultMessage="Website configuration" />
      </h1>
      <Form className="WebsitesConfigurations" id="CreateWebsite" onSubmit={handleSubmit}>
        <Form.Item>
          <h3>
            <span className="ant-form-item-required">
              {intl.formatMessage({
                id: 'desktop_logo',
                defaultMessage: 'Desktop logo',
              })}
            </span>
          </h3>
           {getFieldDecorator('desktopLogo', {})(<div className="Settings__profile-image">
             <Avatar size="large" icon="user" src={get(desktopLogo, 'src', '')} />
             <Button type="primary" onClick={() => handleModalState({
               key: 'mobileLogo',
               method: (value) => form.setFieldsValue({desktopLogo: value[0]})})}>
               {intl.formatMessage({
                 id: 'website_change_logo',
                 defaultMessage: 'Change logo',
               })}
             </Button>
           </div>, )}
        </Form.Item>
        <Form.Item>
          <h3>
            <span className="ant-form-item-required">
              {intl.formatMessage({
                id: 'mobile_logo',
                defaultMessage: 'Mobile logo',
              })}
            </span>
          </h3>
           {getFieldDecorator('mobileLogo', {})(<div className="Settings__profile-image">
             <Avatar size="large" icon="user" src={get(mobileLogo, 'src', '')} />
             <Button type="primary" onClick={() => handleModalState({
               key: 'mobileLogo',
               method: (value) => form.setFieldsValue({mobileLogo: value[0]})})}>
               {intl.formatMessage({
                 id: 'website_change_logo',
                 defaultMessage: 'Change logo',
               })}
             </Button>
           </div>, )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {intl.formatMessage({
              id: 'save',
              defaultMessage: 'Save',
            })}
          </Button>
        </Form.Item>
      </Form>
       <Modal
        wrapClassName="Settings__modal"
        title={'Choose logo'}
        closable
        onCancel={() => handleModalState({})}
        onOk={() => handleModalState({})}
        visible={!isEmpty(modalsState)}
       >
          <ImageSetter
            onImageLoaded={modalsState.method}
            onLoadingImage={() => {}}
            isRequired
          />
       </Modal>
    </React.Fragment>
  );
};

WebsitesConfigurations.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
};

WebsitesConfigurations.defaultProps = {
  availableStatus: '',
};

export default connect(
  state => ({
    loading: getWebsiteLoading(state),
  }),
  {},
)(Form.create()(injectIntl(WebsitesConfigurations)));
