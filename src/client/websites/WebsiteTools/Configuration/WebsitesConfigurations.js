import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Form, Modal, Avatar, message, Icon } from 'antd';
import { connect } from 'react-redux';
import { isEmpty, get, map } from 'lodash';
import { Map } from 'pigeon-maps';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import ImageSetter from '../../../components/ImageSetter/ImageSetter';
import { getObjectName } from '../../../helpers/wObjectHelper';
import ObjectAvatar from '../../../components/ObjectAvatar';
import mapProvider from '../../../helpers/mapProvider';
import {
  getCoordinatesForMap,
  getWebConfiguration,
  saveWebConfiguration,
} from '../../../../store/websiteStore/websiteActions';
import Loading from '../../../components/Icon/Loading';
import { getCoordinates } from '../../../../store/userStore/userActions';
import { getParsedMap } from '../../../components/Maps/mapHelper';
import CustomMarker from '../../../components/Maps/CustomMarker';
import { getPropositions } from '../../../../waivioApi/ApiClient';
import { getPropositionsForMap } from '../../../../store/mapStore/mapActions';
import MapControllers from '../../../widgets/MapControllers/MapControllers';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { getUserLocation } from '../../../../store/userStore/userSelectors';
import { getObjectsMap } from '../../../../store/mapStore/mapSelectors';
import {
  getConfiguration,
  getWebsiteLoading,
} from '../../../../store/websiteStore/websiteSelectors';
import SelectColorModal from './SelectColorModal/SelectColorModal';
import { initialColors } from '../../constants/colors';

import './WebsitesConfigurations.less';

export const WebsitesConfigurations = ({
  intl,
  loading,
  getWebConfig,
  match,
  config,
  saveWebConfig,
  location,
  getCurrentUserCoordinates,
  userLocation,
  wobjects,
  userName,
  getMapPropositions,
}) => {
  const [modalsState, setModalState] = useState({});
  const [showMap, setShowMap] = useState('');
  const [openColorsModal, setOpenColorsModal] = useState('');
  const [image, setImage] = useState('');
  const [settingMap, setSettingMap] = useState({});
  const [paramsSaving, setParamsSaving] = useState(false);
  const host = match.params.site;
  const mobileLogo = get(config, 'mobileLogo');
  const desktopLogo = get(config, 'desktopLogo');
  const aboutObj = get(config, 'aboutObject');
  const colorsList = get(config, 'colors', {});
  const { lat, lon } = userLocation;
  const isDesktopModalShow = showMap === 'desktopMap';
  const mapModalClassList = classNames('WebsitesConfigurations__modal', {
    'WebsitesConfigurations__modal--desktop': isDesktopModalShow,
  });

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

  useEffect(() => {
    getCurrentUserCoordinates();
    getWebConfig(host);
  }, [location.pathname]);

  const mapState = {
    mobileMap: get(config, 'mobileMap'),
    desktopMap: get(config, 'desktopMap'),
  };

  const handleSubmit = param => {
    setParamsSaving(true);

    return saveWebConfig(host, param).then(() => {
      setParamsSaving(false);
      setModalState({});
      setImage('');
      setShowMap('');
      setSettingMap({});
      setOpenColorsModal(false);

      message.success(
        intl.formatMessage({
          id: 'website_save_webconfig_success',
          defaultMessage: 'Website successfully updated',
        }),
      );
    });
  };

  const closeMapModal = () => {
    setShowMap('');
    setSettingMap({});
  };

  const setCoordinates = () =>
    setSettingMap({
      ...settingMap,
      center: [lat, lon],
      zoom: settingMap.zoom,
    });

  const handleSubmitLogoModal = () =>
    handleSubmit({
      [modalsState.type]: image,
    });

  const handleSubmitMap = () =>
    handleSubmit({
      [showMap]: settingMap,
    });

  const handleSubmitColors = colors =>
    handleSubmit({
      colors,
    });

  const handleModalState = key => {
    setModalState({
      type: key,
      method: value => setImage(value[0].src),
    });
  };

  const closeLogoModal = () => {
    setModalState({});
    setImage('');
  };

  const incrementZoom = () => {
    if (settingMap.zoom <= 18) {
      setSettingMap({
        ...settingMap,
        zoom: settingMap.zoom + 1,
      });
    }
  };

  const decrementZoom = () => {
    if (settingMap.zoom >= 1) {
      setSettingMap({
        ...settingMap,
        zoom: settingMap.zoom - 1,
      });
    }
  };

  const setPosition = () => setCoordinates();

  const onBoundsChanged = state =>
    setSettingMap({
      ...state,
      topPoint: state.bounds.ne,
      bottomPoint: state.bounds.sw,
    });

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

    if (isDesktopModalShow) return 'calc(100vh - 110px)';

    if (screenWidth === 375 && screenHeight === 812) {
      return 665;
    } else if (screenWidth === 414 && screenHeight === 736) {
      return 590;
    } else if (screenWidth === 375 && screenHeight === 667) {
      return 520;
    }

    return 600;
  };

  return (
    <React.Fragment>
      {!loading ? (
        <React.Fragment>
          <h1>
            <FormattedMessage id="website_configuration" defaultMessage="Website configuration" />
          </h1>
          <Form className="WebsitesConfigurations" id="WebsitesConfigurations">
            <Form.Item>
              <h3>
                {intl.formatMessage({
                  id: 'desktop_logo',
                  defaultMessage: 'Desktop logo',
                })}
              </h3>
              <div className="Settings__profile-image">
                <Avatar
                  icon="picture"
                  shape="square"
                  src={desktopLogo}
                  className="WebsitesConfigurations__avatar WebsitesConfigurations__avatar--desktop"
                />
                <Button type="primary" onClick={() => handleModalState('desktopLogo')}>
                  {intl.formatMessage({
                    id: 'website_change_logo',
                    defaultMessage: 'Change logo',
                  })}
                </Button>
              </div>
              <p>
                <FormattedMessage
                  id="desktop_logo_description"
                  defaultMessage="Desktop logo will appear on the homepage of the desktop version of the site."
                />
              </p>
            </Form.Item>
            <Form.Item>
              <h3>
                {intl.formatMessage({
                  id: 'mobile_logo',
                  defaultMessage: 'Mobile logo',
                })}
              </h3>
              <div className="Settings__profile-image">
                <Avatar
                  icon="picture"
                  shape="square"
                  src={mobileLogo}
                  className="WebsitesConfigurations__avatar WebsitesConfigurations__avatar--mobile"
                />
                <Button type="primary" onClick={() => handleModalState('mobileLogo')}>
                  {intl.formatMessage({
                    id: 'website_change_logo',
                    defaultMessage: 'Change logo',
                  })}
                </Button>
              </div>
              <p>
                <FormattedMessage
                  id="mobile_logo_description"
                  defaultMessage="Mobile logo will appear on the home page of the mobile version of the site."
                />
              </p>
            </Form.Item>
            <Form.Item>
              <h3>
                {intl.formatMessage({
                  id: 'about_object',
                  defaultMessage: 'About object:',
                })}
              </h3>
              {aboutObj ? (
                <div>
                  <div className="Transfer__search-content-wrap-current">
                    <div className="Transfer__search-content-wrap-current-user">
                      <ObjectAvatar item={aboutObj} size={40} />
                      <div className="Transfer__search-content">{getObjectName(aboutObj)}</div>
                    </div>
                    {paramsSaving ? (
                      <Icon type={'loading'} />
                    ) : (
                      <span
                        role="presentation"
                        onClick={() =>
                          handleSubmit({
                            aboutObject: null,
                          })
                        }
                        className="iconfont icon-delete"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <SearchObjectsAutocomplete
                  handleSelect={value => handleSubmit({ aboutObject: value.author_permlink })}
                />
              )}
              <p>
                <FormattedMessage
                  id="about_object_description"
                  defaultMessage="About object will be opened when visitors click on the logo on the home page."
                />
              </p>
            </Form.Item>
            <Form.Item>
              <h3>
                {intl.formatMessage({
                  id: 'desktop_map_default_view',
                  defaultMessage: 'Desktop map - default view:',
                })}
              </h3>
              <div className="WebsitesConfigurations__map">
                <Map
                  center={get(mapState, ['desktopMap', 'center'], [+lat, +lon])}
                  zoom={get(mapState, ['desktopMap', 'zoom'], 10)}
                  minZoom={get(mapState, ['desktopMap', 'zoom'], 0)}
                  maxZoom={get(mapState, ['desktopMap', 'zoom'], 0)}
                  provider={mapProvider}
                  height={200}
                  width={320}
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
              </div>
              <p>
                <FormattedMessage
                  id="desktop_map_description"
                  defaultMessage="Select the initial map focus for the desktop site."
                />
              </p>
            </Form.Item>
            <Form.Item>
              <h3>
                {intl.formatMessage({
                  id: 'mobile_map_default_view',
                  defaultMessage: 'Mobile map - default view:',
                })}
              </h3>
              <div className="WebsitesConfigurations__map">
                <Map
                  center={get(mapState, ['mobileMap', 'center'], [+lat, +lon])}
                  zoom={get(mapState, ['mobileMap', 'zoom'], 10)}
                  minZoom={get(mapState, ['mobileMap', 'zoom'], 0)}
                  maxZoom={get(mapState, ['mobileMap', 'zoom'], 0)}
                  height={200}
                  width={120}
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
              </div>
              <p>
                <FormattedMessage
                  id="mobile_map_description"
                  defaultMessage="Select the initial map focus for the mobile site."
                />
              </p>
            </Form.Item>
            <Form.Item>
              <h3>
                {intl.formatMessage({
                  id: 'website_colors',
                  defaultMessage: 'Website colors',
                })}
                :
              </h3>
              <div className="WebsitesConfigurations__colors-wrap">
                <div className="WebsitesConfigurations__colorsItem">
                  <div
                    className="WebsitesConfigurations__colors"
                    style={{ backgroundColor: colorsList.mapMarkerBody || initialColors.marker }}
                  />
                  <b>
                    {intl.formatMessage({
                      id: 'website_colors_marker',
                      defaultMessage: 'Marker color',
                    })}
                  </b>
                </div>
                <div className="WebsitesConfigurations__colorsItem">
                  <div
                    className="WebsitesConfigurations__colors"
                    style={{ backgroundColor: colorsList.mapMarkerText || initialColors.text }}
                  />
                  <b>
                    {intl.formatMessage({
                      id: 'website_colors_text',
                      defaultMessage: 'Marker text',
                    })}
                  </b>
                </div>
              </div>
              <Button type="primary" onClick={() => setOpenColorsModal(true)}>
                {intl.formatMessage({
                  id: 'select_color',
                  defaultMessage: 'Select color',
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
            okButtonProps={{
              loading: paramsSaving,
            }}
          >
            {!isEmpty(modalsState) && (
              <ImageSetter onImageLoaded={modalsState.method} isRequired isMultiple={false} />
            )}
          </Modal>
          <Modal
            wrapClassName={mapModalClassList}
            title={`Select area`}
            closable
            onCancel={closeMapModal}
            onOk={handleSubmitMap}
            visible={showMap}
            okButtonProps={{
              loading: paramsSaving,
            }}
          >
            {showMap && (
              <div className="MapWrap">
                <MapControllers
                  decrementZoom={decrementZoom}
                  incrementZoom={incrementZoom}
                  setPosition={setPosition}
                />
                <Map
                  center={
                    get(settingMap, 'center') || get(mapState, [showMap, 'center'], [+lat, +lon])
                  }
                  zoom={get(settingMap, 'zoom', 0) || get(mapState, [showMap, 'zoom'], 8)}
                  height={getCurrentScreenSize()}
                  provider={mapProvider}
                  onBoundsChanged={state => onBoundsChanged(state, showMap)}
                >
                  {markersLayout}
                </Map>
              </div>
            )}
          </Modal>
          {openColorsModal && (
            <SelectColorModal
              openColorsModal={openColorsModal}
              handleSubmitColors={handleSubmitColors}
              setOpenColorsModal={setOpenColorsModal}
              colors={colorsList}
              loading={paramsSaving}
            />
          )}
        </React.Fragment>
      ) : (
        <Loading />
      )}
    </React.Fragment>
  );
};

WebsitesConfigurations.propTypes = {
  intl: PropTypes.shape().isRequired,
  config: PropTypes.arrayOf.isRequired,
  loading: PropTypes.bool.isRequired,
  getWebConfig: PropTypes.func.isRequired,
  saveWebConfig: PropTypes.func.isRequired,
  getCurrentUserCoordinates: PropTypes.func.isRequired,
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
    getCurrentUserCoordinates: getCoordinates,
    getMapPropositions: getPropositionsForMap,
  },
)(withRouter(injectIntl(WebsitesConfigurations)));
