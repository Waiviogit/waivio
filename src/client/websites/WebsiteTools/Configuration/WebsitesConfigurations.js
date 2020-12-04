import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Input, Form, Modal, Avatar } from 'antd';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import Map from 'pigeon-maps';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import { getConfiguration, getWebsiteLoading } from '../../../reducers';
import ImageSetter from '../../../components/ImageSetter/ImageSetter';
import { getObjectName } from '../../../helpers/wObjectHelper';
import ObjectAvatar from '../../../components/ObjectAvatar';
import mapProvider from '../../../helpers/mapProvider';
import {
  getCoordinatesForMap,
  getWebConfiguration,
  saveWebConfiguration,
} from '../../websiteActions';
import { getConfigFieldsValue } from '../../helper';

import './WebsitesConfigurations.less';
import Loading from '../../../components/Icon/Loading';

export const WebsitesConfigurations = ({
  intl,
  form,
  loading,
  getWebConfig,
  match,
  config,
  saveWebConfig,
  location,
  // getMapsCoordinates,
}) => {
  const { getFieldDecorator, getFieldValue } = form;
  const [modalsState, setModalState] = useState({});
  const [showMap, setShowMap] = useState('');
  const [showSelectColor, setShowSelectColor] = useState('');
  const [colors, setColors] = useState('');
  const [image, setImage] = useState('');
  const mobileLogo = getFieldValue('mobileLogo') || get(config, 'mobileLogo');
  const desktopLogo = getFieldValue('desktopLogo') || get(config, 'desktopLogo');
  const logoState = {
    mobileLogo,
    desktopLogo,
  };
  const mapState = {
    mobileMap: getFieldValue('mobileMap') || get(config, 'mobileMap'),
    desktopMap: getFieldValue('desktopMap') || get(config, 'desktopMap'),
  };
  const aboutObject = getFieldValue('aboutObject') || get(config, 'aboutObject');
  const host = match.params.site;

  useEffect(() => {
    getWebConfig(host);
    return () => {
      setColors('');
    };
  }, [location.pathname]);

  // useEffect(() => {
  //   if (!isEmpty(config)) getMapsCoordinates(get(mapState, ['desktopMap', 'center']), 38000);
  // }, [config]);

  const handleSubmitLogoModal = () => {
    form.setFieldsValue({
      [modalsState.type]: image,
    });
    setModalState({});
    setImage('');
  };

  const handleModalState = key => {
    setModalState({
      type: key,
      method: value => setImage(value[0].src),
    });
  };

  const closeLogoModal = () => {
    const key = modalsState.type;

    form.setFieldsValue({ [key]: logoState[key] });
    setModalState({});
    setImage('');
  };

  const getSelectedColor = type => `${get(colors, [type]) || get(config, ['colors', type], '')}`;

  const setMapBounds = state => {
    const { center, zoom, bounds } = state;

    form.setFieldsValue({
      [showMap]: {
        topPoint: bounds.ne,
        bottomPoint: bounds.sw,
        center,
        zoom,
      },
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const configuration = getConfigFieldsValue(config.configurationFields, values);
        const configurationObj = {
          configuration: {
            ...config,
            ...configuration,
            colors: {
              ...config.colors,
              ...colors,
            },
            aboutObject: get(aboutObject, 'author_permlink', ''),
          },
        };
        saveWebConfig(host, configurationObj);
      }
    });
  };

  const handleClickOk = () => {
    const formValues = form.getFieldsValue();
    setColors(getConfigFieldsValue(config.colors, formValues));
    setShowSelectColor(false);
  };

  return (
    <React.Fragment>
      {!loading ? (
        <React.Fragment>
          <h1>
            <FormattedMessage id="website_configuration" defaultMessage="Website configuration" />
          </h1>
          <Form
            className="WebsitesConfigurations"
            id="WebsitesConfigurations"
            onSubmit={handleSubmit}
          >
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
              {getFieldDecorator('aboutObject')(
                aboutObject ? (
                  <div>
                    <div className="Transfer__search-content-wrap-current">
                      <div className="Transfer__search-content-wrap-current-user">
                        <ObjectAvatar item={aboutObject} size={40} />
                        <div className="Transfer__search-content">{getObjectName(aboutObject)}</div>
                      </div>
                      <span
                        role="presentation"
                        onClick={() => form.setFieldsValue({ aboutObject: null })}
                        className="iconfont icon-delete"
                      />
                    </div>
                  </div>
                ) : (
                  <SearchObjectsAutocomplete
                    handleSelect={value => form.setFieldsValue({ aboutObject: value })}
                  />
                ),
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
                <div className="WebsitesConfigurations__map">
                  <Map
                    center={get(mapState, ['desktopMap', 'center'], [])}
                    zoom={get(mapState, ['desktopMap', 'zoom'], 0)}
                    minZoom={get(mapState, ['desktopMap', 'zoom'], 0)}
                    maxZoom={get(mapState, ['desktopMap', 'zoom'], 0)}
                    provider={mapProvider}
                    height={200}
                    width={160}
                  />
                  <Button type="primary" onClick={() => setShowMap('desktopMap')}>
                    {intl.formatMessage({
                      id: 'select_area',
                      defaultMessage: 'Select area',
                    })}
                  </Button>
                </div>,
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
                <div className="WebsitesConfigurations__map">
                  <Map
                    center={get(mapState, ['mobileMap', 'center'], [])}
                    zoom={get(mapState, ['mobileMap', 'zoom'], 0)}
                    minZoom={get(mapState, ['mobileMap', 'zoom'], 0)}
                    maxZoom={get(mapState, ['mobileMap', 'zoom'], 0)}
                    height={200}
                    width={160}
                    provider={mapProvider}
                  />
                  <Button type="primary" onClick={() => setShowMap('mobileMap')}>
                    {intl.formatMessage({
                      id: 'select_area',
                      defaultMessage: 'Select area',
                    })}
                  </Button>
                </div>,
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
                {Object.keys(get(config, 'colors', {})).map(color => (
                  <div key={color}>
                    <span
                      className="WebsitesConfigurations__colors"
                      style={{ backgroundColor: `#${getSelectedColor(color)}` }}
                    />
                    <b>{color}</b>
                  </div>
                ))}
              </div>
              <Button type="primary" onClick={() => setShowSelectColor(true)}>
                {intl.formatMessage({
                  id: 'select_colors',
                  defaultMessage: 'Select colors',
                })}
              </Button>
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
            onCancel={closeLogoModal}
            onOk={handleSubmitLogoModal}
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
                center={get(mapState, [showMap, 'center'], [50.879, 4.6997])}
                zoom={get(mapState, [showMap, 'zoom'], 6)}
                height={400}
                provider={mapProvider}
                onBoundsChanged={state => setMapBounds(state)}
              />
            )}
          </Modal>
          <Modal
            wrapClassName="Settings__modal"
            title={`Select color`}
            closable
            onCancel={() => {
              setShowSelectColor(false);
            }}
            onOk={handleClickOk}
            visible={showSelectColor}
          >
            {showSelectColor &&
              Object.keys(get(config, 'colors', {})).map(color => (
                <div className="WebsitesConfigurations__select-color" key={color}>
                  {color}:{' '}
                  <span>
                    #
                    {getFieldDecorator(color)(
                      <Input.Group>
                        <Input
                          type="text"
                          defaultValue={getSelectedColor(color)}
                          onChange={e => {
                            const val = e.currentTarget.value === '' ? ' ' : e.currentTarget.value;
                            form.setFieldsValue({
                              [color]: val,
                            });
                          }}
                        />
                      </Input.Group>,
                    )}
                  </span>
                </div>
              ))}
          </Modal>
        </React.Fragment>
      ) : (
        <Loading />
      )}
    </React.Fragment>
  );
};

WebsitesConfigurations.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  config: PropTypes.arrayOf.isRequired,
  loading: PropTypes.bool.isRequired,
  getWebConfig: PropTypes.func.isRequired,
  saveWebConfig: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape().isRequired,
};

export default connect(
  state => ({
    loading: getWebsiteLoading(state),
    config: getConfiguration(state),
  }),
  {
    getWebConfig: getWebConfiguration,
    saveWebConfig: saveWebConfiguration,
    getMapsCoordinates: getCoordinatesForMap,
  },
)(Form.create()(withRouter(injectIntl(WebsitesConfigurations))));
