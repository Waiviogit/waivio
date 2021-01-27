import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Input, Form, Modal, Avatar, message } from 'antd';
import { connect } from 'react-redux';
import { isEmpty, get, map } from 'lodash';
import Map from 'pigeon-maps';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import {
  getAuthenticatedUserName,
  getConfiguration,
  getObjectsMap,
  getUserLocation,
  getWebsiteLoading,
} from '../../../reducers';
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
import Loading from '../../../components/Icon/Loading';
import { getCoordinates } from '../../../user/userActions';
import { getParsedMap } from '../../../components/Maps/mapHelper';
import CustomMarker from '../../../components/Maps/CustomMarker';
import { getPropositions } from '../../../../waivioApi/ApiClient';
import { getPropositionsForMap } from '../../../components/Maps/mapActions';
import './WebsitesConfigurations.less';

export const WebsitesConfigurations = ({
  intl,
  form,
  loading,
  getWebConfig,
  match,
  config,
  saveWebConfig,
  location,
  // eslint-disable-next-line no-shadow
  getCoordinates,
  userLocation,
  wobjects,
  userName,
  getMapPropositions,
}) => {
  const { getFieldDecorator, getFieldValue, resetFields } = form;
  const [modalsState, setModalState] = useState({});
  const [showMap, setShowMap] = useState('');
  const [showSelectColor, setShowSelectColor] = useState('');
  const [colors, setColors] = useState('');
  const [aboutObj, setAbtObject] = useState(null);
  const [image, setImage] = useState('');
  const [settingMap, setSettingMap] = useState({});

  const mobileLogo = getFieldValue('mobileLogo') || get(config, 'mobileLogo');
  const desktopLogo = getFieldValue('desktopLogo') || get(config, 'desktopLogo');

  const { center, zoom, bounds } = settingMap;
  const { lat, lon } = userLocation;

  useEffect(() => {
    if (lat && lon) {
      const reqData = {
        firstMapLoad: true,
        simplified: true,
        userName,
        match,
        area: [+lat, +lon],
      };
      getPropositions(reqData).then(data => {
        getMapPropositions(data.campaigns);
      });
    }
  }, [lat, lon]);

  const logoState = {
    mobileLogo,
    desktopLogo,
  };

  const mapState = {
    mobileMap: getFieldValue('mobileMap') || get(config, 'mobileMap'),
    desktopMap: getFieldValue('desktopMap') || get(config, 'desktopMap'),
  };

  const host = match.params.site;
  console.log('host: ', host);

  useEffect(() => {
    getCoordinates();
    getWebConfig(host).then(response => {
      setAbtObject(response.value.aboutObject);
    });
    return () => {
      setColors('');
      setAbtObject(null);
    };
  }, [location.pathname]);

  const closeMapModal = () => {
    resetFields(showMap);
    setShowMap('');
  };

  const setCoordinates = () => {
    // eslint-disable-next-line no-shadow
    const { bounds } = settingMap;
    const updateCenter = [lat, lon];
    form.setFieldsValue({
      [showMap]: {
        topPoint: bounds.ne,
        bottomPoint: bounds.sw,
        center: updateCenter,
        zoom,
      },
    });
  };

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
    // eslint-disable-next-line no-shadow
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

  const incrementZoom = () => {
    if (zoom <= 18) {
      form.setFieldsValue({
        [showMap]: {
          topPoint: bounds.ne,
          bottomPoint: bounds.sw,
          center,
          zoom: zoom + 1,
        },
      });
    }
  };

  const decrementZoom = () => {
    if (zoom >= 1) {
      form.setFieldsValue({
        [showMap]: {
          topPoint: bounds.ne,
          bottomPoint: bounds.sw,
          center,
          zoom: zoom - 1,
        },
      });
    }
  };

  const setPosition = () => {
    setCoordinates();
  };

  const onBoundsChanged = state => {
    setSettingMap(state);
    setMapBounds(state);
  };

  const zoomButtonsLayout = () => (
    <div className="MapConfigurationControl">
      <div className="MapConfigurationControl__zoom">
        <div
          role="presentation"
          className="MapConfigurationControl__zoom__button"
          onClick={incrementZoom}
        >
          +
        </div>
        <div
          role="presentation"
          className="MapConfigurationControl__zoom__button"
          onClick={decrementZoom}
        >
          -
        </div>
      </div>
      <div className="MapConfigurationControl__gps">
        <div role="presentation" className="MapConfigurationZoom__locateGPS" onClick={setPosition}>
          <img src="/images/icons/aim.png" alt="aim" className="MapOS__locateGPS-button" />
        </div>
      </div>
    </div>
  );

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
            aboutObject: get(aboutObj, 'author_permlink', ''),
          },
        };
        saveWebConfig(host, configurationObj);
        message.success(
          intl.formatMessage({
            id: 'website_save_webconfig_success',
            defaultMessage: 'Website successfully updated',
          }),
        );
      }
    });
  };

  const handleClickOk = () => {
    const formValues = form.getFieldsValue();
    setColors(getConfigFieldsValue(config.colors, formValues));
    setShowSelectColor(false);
  };

  const getMarkers = wObjects =>
    !isEmpty(wobjects) &&
    map(wObjects, wobject => {
      const parsedMap = getParsedMap(get(wobject, ['required_object'], {}));
      const latitude = get(parsedMap, ['latitude']);
      const longitude = get(parsedMap, ['longitude']);
      const isMarked =
        Boolean((wobject && wobject.campaigns) || (wobject && !isEmpty(wobject.propositions))) ||
        match.path.includes('rewards');

      return latitude && longitude ? (
        <CustomMarker
          key={`obj${wobject.author_permlink}`}
          isMarked={isMarked}
          anchor={[+latitude, +longitude]}
          payload={wobject}
        />
      ) : null;
    });

  const markersLayout = getMarkers(wobjects);

  const getCurrentScreenSize = () => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    if (screenWidth === 375 && screenHeight === 812) {
      return 665;
    } else if (screenWidth === 414 && screenHeight === 736) {
      return 595;
    } else if (screenWidth === 375 && screenHeight === 667) {
      return 520;
    }
    return 400;
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
                aboutObj ? (
                  <div>
                    <div className="Transfer__search-content-wrap-current">
                      <div className="Transfer__search-content-wrap-current-user">
                        <ObjectAvatar item={aboutObj} size={40} />
                        <div className="Transfer__search-content">{getObjectName(aboutObj)}</div>
                      </div>
                      <span
                        role="presentation"
                        onClick={() => {
                          setAbtObject(null);
                        }}
                        className="iconfont icon-delete"
                      />
                    </div>
                  </div>
                ) : (
                  <SearchObjectsAutocomplete
                    handleSelect={value => {
                      setAbtObject(value);
                    }}
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
                    center={get(mapState, ['desktopMap', 'center'], [+lat, +lon])}
                    zoom={get(mapState, ['desktopMap', 'zoom'], 10)}
                    minZoom={get(mapState, ['desktopMap', 'zoom'], 0)}
                    maxZoom={get(mapState, ['desktopMap', 'zoom'], 0)}
                    provider={mapProvider}
                    height={200}
                    width={160}
                    mouseEvents={false}
                  >
                    {markersLayout}
                  </Map>
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
                    center={get(mapState, ['mobileMap', 'center'], [+lat, +lon])}
                    zoom={get(mapState, ['mobileMap', 'zoom'], 10)}
                    minZoom={get(mapState, ['mobileMap', 'zoom'], 0)}
                    maxZoom={get(mapState, ['mobileMap', 'zoom'], 0)}
                    height={200}
                    width={160}
                    provider={mapProvider}
                    mouseEvents={false}
                  >
                    {markersLayout}
                  </Map>
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
            onCancel={closeMapModal}
            onOk={() => setShowMap('')}
            visible={showMap}
          >
            {showMap && (
              <div className="MapWrap">
                {zoomButtonsLayout()}
                <Map
                  center={get(mapState, [showMap, 'center'], [+lat, +lon])}
                  zoom={get(mapState, [showMap, 'zoom'], 8)}
                  height={getCurrentScreenSize()}
                  provider={mapProvider}
                  onBoundsChanged={state => {
                    onBoundsChanged(state);
                  }}
                >
                  {markersLayout}
                </Map>
              </div>
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
                            const val =
                              e.currentTarget.value.trim() === ''
                                ? ' '
                                : e.currentTarget.value.trim();
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
  getCoordinates: PropTypes.func.isRequired,
  getMapPropositions: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
    path: PropTypes.string.isRequired,
  }).isRequired,
  location: PropTypes.shape().isRequired,
  userLocation: PropTypes.shape().isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
  wobjects: PropTypes.shape().isRequired,
};

export default connect(
  state => ({
    loading: getWebsiteLoading(state),
    config: getConfiguration(state),
    userLocation: getUserLocation(state),
    wobjects: getObjectsMap(state),
    userName: getAuthenticatedUserName(state),
  }),
  {
    getWebConfig: getWebConfiguration,
    saveWebConfig: saveWebConfiguration,
    getMapsCoordinates: getCoordinatesForMap,
    getCoordinates,
    getMapPropositions: getPropositionsForMap,
  },
)(Form.create()(withRouter(injectIntl(WebsitesConfigurations))));
