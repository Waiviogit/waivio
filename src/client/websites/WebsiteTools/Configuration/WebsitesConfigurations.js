import React, { useCallback, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { AutoComplete, Button, Checkbox, Input, Form, message, Modal, Avatar } from 'antd';
import { connect } from 'react-redux';
import { debounce, get, isEmpty } from 'lodash';

import Affix from '../../../components/Utils/Affix';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';
import validateRules from '../../constants/validateRules';
import { getWebsiteLoading } from '../../../reducers';
import ImageSetter from '../../../components/ImageSetter/ImageSetter';

export const WebsitesConfigurations = ({ intl, form, loading }) => {
  const { getFieldDecorator, getFieldValue } = form;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {}, []);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) return values;
    });
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
              {getFieldDecorator('desktopLogo', {})()}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('profile_image')(
                <div className="Settings__profile-image">
                  <Avatar size="large" icon="user" src={''} />
                  <Button type="primary" onClick={this.onOpenChangeAvatarModal}>
                    {intl.formatMessage({
                      id: 'profile_change_avatar',
                      defaultMessage: 'Change avatar',
                    })}
                  </Button>
                </div>,
              )}
            </Form.Item>
            <p>
              {intl.formatMessage({
                id: 'info_level_domain_name',
                defaultMessage: 'It will be used as a second level domain name.',
              })}
            </p>
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
      <Modal
        wrapClassName="Settings__modal"
        title={
          isDesktop
            ? intl.formatMessage({
                id: 'profile_change_avatar',
                defaultMessage: 'Change avatar',
              })
            : intl.formatMessage({
                id: 'profile_change_cover',
                defaultMessage: 'Change cover',
              })
        }
        closable
        onCancel={isDesktop ? this.onOpenChangeAvatarModal : this.onOpenChangeCoverModal}
        onOk={isDesktop ? this.onOkAvatarModal : this.onOkCoverModal}
        okButtonProps={{ disabled: isLoadingImage }}
        cancelButtonProps={{ disabled: isLoadingImage }}
        visible={isModal}
      >
        {isModal && (
          <ImageSetter
            onImageLoaded={isDesktop ? this.getAvatar : this.getCover}
            onLoadingImage={this.onLoadingImage}
            isRequired
          />
        )}
      </Modal>
    </div>
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
