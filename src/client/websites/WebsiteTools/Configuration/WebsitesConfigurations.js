import React, { useCallback, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { AutoComplete, Button, Checkbox, Input, Form, message, Modal, Avatar } from 'antd';
import { connect } from 'react-redux';

import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';
import validateRules from '../../constants/validateRules';
import { getWebsiteLoading } from '../../../reducers';
import ImageSetter from '../../../components/ImageSetter/ImageSetter';

export const WebsitesConfigurations = ({ intl, form, loading }) => {
  const { getFieldDecorator, getFieldValue } = form;
  const [isDesktop, setIsDesktop] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);

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
             <Avatar size="large" icon="user" src={''} />
             <Button type="primary" onClick={() => {}}>
               {intl.formatMessage({
                 id: 'profile_change_avatar',
                 defaultMessage: 'Change avatar',
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
      {/* <Modal */}
      {/*  wrapClassName="Settings__modal" */}
      {/*  title={ */}
      {/*    isDesktop */}
      {/*      ? intl.formatMessage({ */}
      {/*          id: 'profile_change_avatar', */}
      {/*          defaultMessage: 'Change avatar', */}
      {/*        }) */}
      {/*      : intl.formatMessage({ */}
      {/*          id: 'profile_change_cover', */}
      {/*          defaultMessage: 'Change cover', */}
      {/*        }) */}
      {/*  } */}
      {/*  closable */}
      {/*  onCancel={isDesktop ? this.onOpenChangeAvatarModal : this.onOpenChangeCoverModal} */}
      {/*  onOk={isDesktop ? this.onOkAvatarModal : this.onOkCoverModal} */}
      {/*  okButtonProps={{ disabled: isLoadingImage }} */}
      {/*  cancelButtonProps={{ disabled: isLoadingImage }} */}
      {/*  visible={isModal} */}
      {/* > */}
      {/*  {isModal && ( */}
      {/*    <ImageSetter */}
      {/*      onImageLoaded={isDesktop ? this.getAvatar : this.getCover} */}
      {/*      onLoadingImage={this.onLoadingImage} */}
      {/*      isRequired */}
      {/*    /> */}
      {/*  )} */}
      {/* </Modal> */}
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
