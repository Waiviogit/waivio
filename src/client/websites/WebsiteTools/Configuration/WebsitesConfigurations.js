import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Form, message, Modal, Avatar } from 'antd';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import Map from 'pigeon-maps';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import {getConfiguration, getWebsiteLoading} from '../../../reducers';
import ImageSetter from '../../../components/ImageSetter/ImageSetter';
import { getObjectName } from '../../../helpers/wObjectHelper';
import ObjectAvatar from '../../../components/ObjectAvatar';
import mapProvider from '../../../helpers/mapProvider';
import {getWebConfiguration} from "../../websiteActions";

import './WebsitesConfigurations.less'

export const WebsitesConfigurations = ({ intl, form, loading, getWebConfig, match, config }) => {
  const { getFieldDecorator, getFieldValue } = form;
  const [modalsState, setModalState] = useState({});
  const [showMap, setShowMap] = useState('');
  const mobileLogo = getFieldValue('mobileLogo');
  const desktopLogo = getFieldValue('desktopLogo');
  const selectedObj = getFieldValue('aboutObject');

  useEffect(() => {getWebConfig(match.params.site)}, []);

  const resetModalState = () => setModalState({});

  const handleModalState = key =>
    setModalState({
      method: value => form.setFieldsValue({ [key]: value[0].src }),
    });

  const setMapBounds = state => {
    const { center, zoom, bounds } = state;

    form.setFieldsValue({
      [showMap]: {
        topPoint: bounds.ne,
        bottomPoint: bounds.sw,
        center,
        zoom
      },
    });
  };

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
          {selectedObj ? (
            <div>
              <div className="Transfer__search-content-wrap-current">
                <div className="Transfer__search-content-wrap-current-user">
                  <ObjectAvatar item={selectedObj} size={40} />
                  <div className="Transfer__search-content">{getObjectName(selectedObj)}</div>
                </div>
                <span
                  role="presentation"
                  onClick={() => form.setFieldsValue({ aboutObject: null })}
                  className="iconfont icon-delete"
                />
              </div>
            </div>
          ) : (
            getFieldDecorator(
              'aboutObject',
              {},
            )(
              <SearchObjectsAutocomplete
                handleSelect={value => form.setFieldsValue({ aboutObject: value })}
              />,
            )
          )}
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
          {getFieldDecorator(
            'desktopMap',
            {},
          )(
            <Button type="primary" htmlType="submit" onClick={() => setShowMap('desktopMap')}>
              {intl.formatMessage({
                id: 'select_area',
                defaultMessage: 'Select area',
              })}
            </Button>,
          )}
          <p>Select the initial map focus for the desktop site.</p>
        </Form.Item>
        <Form.Item>
          <h3>
            <span className="ant-form-item-required">
              {intl.formatMessage({
                id: 'mobile_map_default_view',
                defaultMessage: 'Mobile map - default view:',
              })}
            </span>
          </h3>
          {getFieldDecorator(
            'mobileMap',
            {},
          )(
            <Button type="primary" htmlType="submit" onClick={() => setShowMap('mobileMap')}>
              {intl.formatMessage({
                id: 'select_area',
                defaultMessage: 'Select area',
              })}
            </Button>,
          )}
          <p>Select the initial map focus for the mobile site.</p>
        </Form.Item>
        <Form.Item>
          <h3>
            <span className="ant-form-item-required">
              {intl.formatMessage({
                id: 'website_colors',
                defaultMessage: 'Website colors',
              })}
            </span>
          </h3>
          <div />
          <div className="WebsitesConfigurations__colors-wrap">
            {Object.keys(get(config, 'colors', {})).map(color => <div key={color}>
            <span className="WebsitesConfigurations__colors"
                  style={{backgroundColor: '#B1357A'}} />
              <b>{color}</b>
            </div>)}
          </div>
          {getFieldDecorator('colors')(
            <Button type="primary" htmlType="submit" onClick={() => setShowMap('mobileMap')}>
              {intl.formatMessage({
                id: 'select_colors',
                defaultMessage: 'Select colors',
              })}
            </Button>,
          )}
          <p>Select the initial map focus for the mobile site.</p>
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
        title={`Select area`}
        closable
        onCancel={() => setShowMap('')}
        onOk={() => setShowMap('')}
        visible={showMap}
      >
        {showMap && (
          <Map
            center={[50.879, 4.6997]}
            zoom={12}
            height={400}
            provider={mapProvider}
            onBoundsChanged={(state) => setMapBounds(state)}
          />
        )}
      </Modal>
    </React.Fragment>
  );
};

WebsitesConfigurations.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  config: PropTypes.arrayOf.isRequired,
  loading: PropTypes.bool.isRequired,
  getWebConfig: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    })
  }).isRequired
};

WebsitesConfigurations.defaultProps = {
  availableStatus: '',
};

export default connect(
  state => ({
    loading: getWebsiteLoading(state),
    config: getConfiguration(state)
  }),
  {
    getWebConfig: getWebConfiguration
  },
)(Form.create()(injectIntl(WebsitesConfigurations)));
