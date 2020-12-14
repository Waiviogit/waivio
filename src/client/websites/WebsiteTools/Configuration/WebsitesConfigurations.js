import React, { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Input, Form, Modal, Avatar, message } from 'antd';
import { connect } from 'react-redux';
import { isEmpty, get, map } from 'lodash';
import Map from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import {
  getConfiguration,
  getObjectsMap,
  getUserLocation,
  getWebsiteLoading,
} from '../../../reducers';
import ImageSetter from '../../../components/ImageSetter/ImageSetter';
import { getObjectAvatar, getObjectName } from '../../../helpers/wObjectHelper';
import ObjectAvatar from '../../../components/ObjectAvatar';
import mapProvider from '../../../helpers/mapProvider';
import {
  getCoordinatesForMap,
  getWebConfiguration,
  saveWebConfiguration,
} from '../../websiteActions';
import { getConfigFieldsValue } from '../../helper';
import Loading from '../../../components/Icon/Loading';
import { getParsedMap, getRadius } from '../../../components/Maps/mapHelper';
import CustomMarker from '../../../components/Maps/CustomMarker';
import DEFAULTS from '../../../object/const/defaultValues';
import { getCoordinates } from '../../../user/userActions';
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
  wobjects,
  // eslint-disable-next-line react/prop-types
  getMapsCoordinates,
  // eslint-disable-next-line no-shadow
  getCoordinates,
  userLocation,
}) => {
  const { getFieldDecorator, getFieldValue } = form;
  const [modalsState, setModalState] = useState({});
  const [showMap, setShowMap] = useState('');
  const [showSelectColor, setShowSelectColor] = useState('');
  const [colors, setColors] = useState('');
  const [aboutObj, setAbtObject] = useState(null);
  const [image, setImage] = useState('');
  const [settingMap, setSettingMap] = useState({});
  const [infoboxData, setInfoboxData] = useState(null);

  const mobileLogo = getFieldValue('mobileLogo') || get(config, 'mobileLogo');
  const desktopLogo = getFieldValue('desktopLogo') || get(config, 'desktopLogo');

  const { center, zoom, bounds } = settingMap;

  const latitude = +userLocation.lat;
  const longitude = +userLocation.lon;

  const logoState = {
    mobileLogo,
    desktopLogo,
  };

  const mapState = {
    mobileMap: getFieldValue('mobileMap') || get(config, 'mobileMap'),
    desktopMap: getFieldValue('desktopMap') || get(config, 'desktopMap'),
  };

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

  const onBoundsChanged = state => {
    // eslint-disable-next-line no-shadow
    const [lat, lon] = state.center;

    // eslint-disable-next-line no-shadow
    const reqGetMapsCoordinates = (latitude, longitude) => {
      const radius = getRadius(get(mapState, ['desktopMap', 'zoom'], 10));
      getMapsCoordinates([+latitude, +longitude], radius).then(result => {
        console.log('-- result --', result);
      });
    };

    useCallback(() => {
      reqGetMapsCoordinates(lat, lon);
    }, [lat, lon]);

    setSettingMap(state);
    setMapBounds(state);
  };

  const host = match.params.site;

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

  const setCoordinates = () => {
    // eslint-disable-next-line no-shadow
    const { bounds } = settingMap;
    // eslint-disable-next-line react/prop-types,no-shadow
    const center = [latitude, longitude];
    form.setFieldsValue({
      [showMap]: {
        topPoint: bounds.ne,
        bottomPoint: bounds.sw,
        center,
        zoom,
      },
    });
  };

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

  const handleMarkerClick = ({ payload, anchor }) => {
    if (infoboxData && infoboxData.coordinates === anchor) {
      setInfoboxData(null);
    }
    setInfoboxData({ wobject: payload, coordinates: anchor });
  };

  const closeInfobox = () => {
    setInfoboxData(null);
  };

  const goToWebsite = wobjPermlink => {
    const campaignParent = get(match, ['params', 'campaignParent']);
    const filterKey = get(match, ['params', 'filterKey']);
    history.push(
      campaignParent ? `/object/${wobjPermlink}` : `/rewards/${filterKey}/${wobjPermlink}`,
    );
  };

  const getMarkers = () =>
    !isEmpty(wobjects) &&
    map(wobjects, wobject => {
      const parsedMap = getParsedMap(wobject);
      const latVal = get(parsedMap, ['latitude']);
      const lngVal = get(parsedMap, ['longitude']);
      const isMarked =
        Boolean((wobject && wobject.campaigns) || (wobject && !isEmpty(wobject.propositions))) ||
        // eslint-disable-next-line react/prop-types
        match.path.includes('rewards');

      return latVal && lngVal ? (
        <CustomMarker
          key={`obj${wobject.author_permlink}`}
          isMarked={isMarked}
          anchor={[+latVal, +lngVal]}
          payload={wobject}
          onClick={handleMarkerClick}
          onDoubleClick={closeInfobox}
        />
      ) : null;
    });

  const getOverlayLayout = () => {
    const defaultAvatar = DEFAULTS.AVATAR;
    const wobj = infoboxData.wobject;
    const avatar = getObjectAvatar(wobj);
    const wobjPermlink = get(infoboxData, ['wobject', 'author_permlink']);

    return (
      <Overlay anchor={infoboxData.coordinates} offset={[-12, 35]}>
        <div
          role="presentation"
          className="MapOS__overlay-wrap"
          onMouseLeave={closeInfobox}
          onClick={() => goToWebsite(wobjPermlink)}
        >
          <img src={avatar || defaultAvatar} width={35} height={35} alt="" />
          <div role="presentation" className="MapOS__overlay-wrap-name">
            {getObjectName(wobj)}
          </div>
        </div>
      </Overlay>
    );
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

  const markersLayout = getMarkers(wobjects);

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
                    center={get(mapState, ['desktopMap', 'center'], [latitude, longitude])}
                    zoom={get(mapState, ['desktopMap', 'zoom'], 10)}
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
                    center={get(mapState, ['mobileMap', 'center'], [latitude, longitude])}
                    zoom={get(mapState, ['mobileMap', 'zoom'], 10)}
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
              <div className="MapWrap">
                {zoomButtonsLayout()}
                <Map
                  center={get(mapState, [showMap, 'center'], [latitude, longitude])}
                  zoom={get(mapState, [showMap, 'zoom'], 8)}
                  height={400}
                  provider={mapProvider}
                  onBoundsChanged={state => {
                    onBoundsChanged(state);
                  }}
                />
                {markersLayout}
                {infoboxData && getOverlayLayout()}
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape().isRequired,
  wobjects: PropTypes.shape().isRequired,
  userLocation: PropTypes.shape().isRequired,
};

export default connect(
  state => ({
    loading: getWebsiteLoading(state),
    config: getConfiguration(state),
    wobjects: getObjectsMap(state),
    userLocation: getUserLocation(state),
  }),
  {
    getWebConfig: getWebConfiguration,
    saveWebConfig: saveWebConfiguration,
    getMapsCoordinates: getCoordinatesForMap,
    getCoordinates,
  },
)(Form.create()(withRouter(injectIntl(WebsitesConfigurations))));
