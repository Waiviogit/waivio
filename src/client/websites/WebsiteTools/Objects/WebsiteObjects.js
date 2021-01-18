import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty, isEqual } from 'lodash';
import Map from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import mapProvider from '../../../helpers/mapProvider';
import { getAuthenticatedUserName, getIsUsersAreas, getUserLocation } from '../../../reducers';
import { getCoordinates } from '../../../user/userActions';
import { setWebsiteObjectsCoordinates, getWebsiteObjectsCoordinates } from '../../websiteActions';
import { getCurrStyleAfterZoom } from '../../helper';
import './WebsiteObjects.less';

const WebsiteObjects = props => {
  const [currentCenter, setCurrentCenter] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(11);
  const [showMap, setShowMap] = useState(false);
  const [modalMapData, setModalMapData] = useState([]);

  useEffect(() => {
    if (isEmpty(props.userLocation)) {
      props.getCoordinates();
    }
    if (!isEqual(props.usersSelectedAreas, modalMapData)) {
      setModalMapData(props.usersSelectedAreas);
    }
  }, [props.userLocation, props.usersSelectedAreas]);

  useEffect(() => {
    props
      .getWebsiteObjectsCoordinates(props.match.params.site)
      .then(res => {
        setModalMapData(res.value);
      })
      .catch(err => console.error('Error: ', err));
  }, []);

  const lng2tile = (lon, zoom) => ((lon + 180) / 360) * zoom ** 2;
  const lat2tile = (lat, zoom) =>
    ((1 -
      Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
      2) *
    2 ** zoom;

  const latLngToPixel = (latLng, center, zoom) => {
    const tileCenterX = lng2tile(center[1], zoom);

    const tileX = lng2tile(latLng[1], zoom);

    return (tileX - tileCenterX) * 256.0 + 600 / 2;
  };

  const lonLngToPixel = (lonLng, center, zoom) => {
    const tileCenterY = lat2tile(center[0], zoom);

    const tileY = lat2tile(lonLng[0], zoom);

    return (tileY - tileCenterY) * 256.0 + 400 / 2;
  };

  const startOwnLocation = [+props.userLocation.lat, +props.userLocation.lon];
  const setMapCenter = () => (isEmpty(currentCenter) ? startOwnLocation : currentCenter);

  const setPosition = () => setCurrentCenter(startOwnLocation);
  const incrementZoom = () => setCurrentZoom(Math.round(currentZoom) + 1);
  const decrementZoom = () => setCurrentZoom(Math.round(currentZoom) - 1);

  const [currStyle, setCurrStyle] = useState({ width: 300, height: 250 });

  const currClassName = showMap ? 'WebsiteObjectsControl modal-view' : 'WebsiteObjectsControl';
  const zoomButtonsLayout = () => (
    <div className={currClassName}>
      <div className="WebsiteObjectsControl__gps">
        <div role="presentation" className="WebsiteObjectsControl__locateGPS" onClick={setPosition}>
          <img src="/images/icons/aim.png" alt="aim" className="MapOS__locateGPS-button" />
        </div>
      </div>
      <div className="WebsiteObjectsControl__zoom">
        <div
          role="presentation"
          className="WebsiteObjectsControl__zoom__button"
          onClick={incrementZoom}
        >
          +
        </div>
        <div
          role="presentation"
          className="WebsiteObjectsControl__zoom__button"
          onClick={decrementZoom}
        >
          -
        </div>
      </div>
    </div>
  );

  const saveCurrentAreas = data => {
    const params = {
      host: props.match.params.site,
      userName: props.authUserName,
      mapCoordinates: data,
    };
    props.setWebsiteObjectsCoordinates(params);
  };

  const removeArea = id => {
    const filteredAreas = modalMapData.filter(area => !isEqual(+id, area.center[0]));
    setModalMapData(filteredAreas);
    saveCurrentAreas(filteredAreas);
  };

  const handleModalOkButton = currData => {
    const width = latLngToPixel(
      [+currData.topPoint[1], +currData.topPoint[0]],
      currentCenter,
      currentZoom,
    );
    const height = lonLngToPixel(
      [+currData.bottomPoint[1], +currData.bottomPoint[0]],
      currentCenter,
      currentZoom,
    );
    setCurrStyle({ width, height });
    const data = [
      ...modalMapData,
      Object.assign(currData, { width: `${width}px`, height: `${height}px` }),
    ];
    setShowMap(!showMap);
    saveCurrentAreas(data);
  };

  const modalMap = () => {
    let currData = {};
    return (
      <Modal
        title={props.intl.formatMessage({
          id: 'website_objects_area',
          defaultMessage: 'Select area',
        })}
        closable
        onCancel={() => setShowMap(!showMap)}
        onOk={() => handleModalOkButton(currData)}
        visible={showMap}
      >
        {!isEmpty(props.userLocation) && (
          <Map
            center={setMapCenter()}
            zoom={currentZoom}
            height={400}
            provider={mapProvider}
            onBoundsChanged={data => {
              currData = {
                topPoint: [data.bounds.ne[1], data.bounds.ne[0]],
                bottomPoint: [data.bounds.sw[1], data.bounds.sw[0]],
                center: data.center,
                zoom: data.zoom,
              };
            }}
          />
        )}
      </Modal>
    );
  };

  useEffect(() => {
    getCurrStyleAfterZoom(currentZoom, setCurrStyle, currStyle);
  }, [currentZoom]);

  return (
    <div className="WebsiteObjects">
      <h1 className="WebsiteObjects__heading">
        {props.intl.formatMessage({
          id: 'website_objects_heading',
          defaultMessage: 'Select objects',
        })}
      </h1>
      <p className="WebsiteObjects__explanations">
        {props.intl.formatMessage({
          id: 'website_objects_description',
          defaultMessage:
            'All objects (restaurants, dishes, drinks) located in the areas specified on the map will appear on the website. If you want to have more control over the list of objects, you can use the Authorities to do so.',
        })}
      </p>
      <div className="MapWrap">
        <div
          role="presentation"
          className="MapWrap__new-aria-btn"
          onClick={() => setShowMap(!showMap)}
        >
          <Icon type="plus-circle" theme="filled" />
        </div>
        {!showMap && zoomButtonsLayout()}
        {!isEmpty(props.userLocation) && (
          <Map
            center={setMapCenter()}
            zoom={currentZoom}
            height={400}
            provider={mapProvider}
            onBoundsChanged={({ center, zoom }) => {
              setCurrentCenter(center);
              setCurrentZoom(Math.round(zoom));
            }}
          >
            {!isEmpty(modalMapData) &&
              modalMapData.map(area => {
                const id = area.center[0];
                return (
                  <Overlay key={id} anchor={area.center}>
                    <div
                      className="MapWrap__rect"
                      style={{ ...currStyle, width: area.width, height: area.height }}
                    >
                      <span
                        id={id}
                        role="presentation"
                        className="MapWrap__cancel"
                        onClick={event => removeArea(event.target.id)}
                      >
                        &#9746;
                      </span>
                    </div>
                  </Overlay>
                );
              })}
          </Map>
        )}
      </div>
      {showMap && modalMap()}
      <p className="WebsiteObjects__rules-selections">
        <FormattedMessage
          id="website_object_rules_of_selections"
          defaultMessage="Press {plusSymbol} to add a new area. Click & drag corners to resize. Click {cancelSymbol} to remove the area. Zoom in for controls."
          values={{
            plusSymbol: <span style={{ color: '#f87007' }}>+</span>,
            cancelSymbol: <span style={{ color: '#f87007' }}>X</span>,
          }}
        />
      </p>
    </div>
  );
};

WebsiteObjects.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
    path: PropTypes.string.isRequired,
  }).isRequired,
  userLocation: PropTypes.shape({
    lat: PropTypes.string,
    lon: PropTypes.string,
  }).isRequired,
  getCoordinates: PropTypes.func.isRequired,
  authUserName: PropTypes.string.isRequired,
  setWebsiteObjectsCoordinates: PropTypes.func.isRequired,
  getWebsiteObjectsCoordinates: PropTypes.func.isRequired,
  usersSelectedAreas: PropTypes.shape(),
};

WebsiteObjects.defaultProps = {
  usersSelectedAreas: [],
};

export default connect(
  state => ({
    userLocation: getUserLocation(state),
    authUserName: getAuthenticatedUserName(state),
    usersSelectedAreas: getIsUsersAreas(state),
  }),
  {
    getCoordinates,
    setWebsiteObjectsCoordinates,
    getWebsiteObjectsCoordinates,
  },
)(withRouter(injectIntl(WebsiteObjects)));
