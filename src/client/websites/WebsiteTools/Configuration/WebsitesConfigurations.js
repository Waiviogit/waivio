import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Form, message, Modal, Avatar } from 'antd';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import Map from "pigeon-maps";
import Marker from "pigeon-marker";
import Overlay from "pigeon-overlay";
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import { getWebsiteLoading } from '../../../reducers';
import ImageSetter from '../../../components/ImageSetter/ImageSetter';
import {getObjectName} from "../../../helpers/wObjectHelper";
import ObjectAvatar from "../../../components/ObjectAvatar";
import mapProvider from "../../../helpers/mapProvider";


export const WebsitesConfigurations = ({ intl, form, loading }) => {
  const { getFieldDecorator, getFieldValue } = form;
  const [modalsState, setModalState] = useState({});
  const [showMap, setShowMap] = useState(false);
  const mobileLogo = getFieldValue('mobileLogo');
  const desktopLogo = getFieldValue('desktopLogo');
  const selectedObj = getFieldValue('aboutObject');

  useEffect(() => {}, []);

  const resetModalState = () => setModalState({});

  const handleModalState = key =>
    setModalState({
      method: value => form.setFieldsValue({ [key]: value[0].src }),
    });

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
          {getFieldDecorator(
            'desktopLogo',
            {},
          )(
            <div className="Settings__profile-image">
              <Avatar size="large" icon="user" src={desktopLogo} />
              <Button type="primary" onClick={() => handleModalState('desktopLogo')}>
                {intl.formatMessage({
                  id: 'website_change_logo',
                  defaultMessage: 'Change logo',
                })}
              </Button>
            </div>,
          )}
          <p>Desktop logo will appear on the home page of the desktop version of the site.</p>
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
          {getFieldDecorator(
            'mobileLogo',
            {},
          )(
            <div className="Settings__profile-image">
              <Avatar size="large" icon="user" src={mobileLogo} />
              <Button type="primary" onClick={() => handleModalState('mobileLogo')}>
                {intl.formatMessage({
                  id: 'website_change_logo',
                  defaultMessage: 'Change logo',
                })}
              </Button>
            </div>,
          )}
          <p>Mobile logo will appear on the home page of the mobile version of the site.</p>
        </Form.Item>
        <Form.Item>
          <h3>
            <span className="ant-form-item-required">
              {intl.formatMessage({
                id: 'about_object',
                defaultMessage: 'About object:',
              })}
            </span>
          </h3>
          {selectedObj ? <div>
            <div className="Transfer__search-content-wrap-current">
              <div className="Transfer__search-content-wrap-current-user">
                <ObjectAvatar item={selectedObj} size={40}/>
                <div className="Transfer__search-content">{getObjectName(selectedObj)}</div>
              </div>
                <span
                  role="presentation"
                  onClick={() => form.setFieldsValue({aboutObject: null })}
                  className="iconfont icon-delete"
                />
            </div>
          </div> : getFieldDecorator(
            'aboutObject',
            {},
          )(<SearchObjectsAutocomplete handleSelect={value => form.setFieldsValue({ aboutObject: value })} />)}
          <p>About object will be opened when visitors click on the logo on the home page.</p>
        </Form.Item>
        <Form.Item>
          <h3>
            <span className="ant-form-item-required">
              {intl.formatMessage({
                id: 'desktop_map_default_view',
                defaultMessage: 'Desktop map - default view:',
              })}
            </span>
          </h3>
          <Button type="primary" htmlType="submit" onClick={() => setShowMap(true)}>
            {intl.formatMessage({
              id: 'select_area',
              defaultMessage: 'Select area',
            })}
          </Button>
          <p>Select the initial map focus for the desktop site.</p>
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
        title={`Choose logo`}
        closable
        onCancel={resetModalState}
        onOk={resetModalState}
        visible={!isEmpty(modalsState)}
      >
        {!isEmpty(modalsState) && (
          <ImageSetter onImageLoaded={modalsState.method} isRequired isMultiple={false} />
        )}
      </Modal>
      <Modal
        wrapClassName="Settings__modal"
        title={`Choose logo`}
        closable
        onCancel={() => setShowMap(false)}
        onOk={() => setShowMap(false)}
        visible={showMap}
      >
        {showMap && (
          <Map center={[50.879, 4.6997]} zoom={12} height={400} provider={mapProvider}>
            <Marker anchor={[50.874, 4.6947]} payload={1} onClick={({ event, anchor, payload }) => {console.log(event,anchor, payload)}} />
            {/* <Overlay anchor={[50.879, 4.6997]} offset={[120, 79]}> */}
            {/*  <img src='' width={240} height={158} alt='' /> */}
            {/* </Overlay> */}
          </Map>)}
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
