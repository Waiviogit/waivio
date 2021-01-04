import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty, isEqual, size } from 'lodash';
import Map from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import mapProvider from '../../../helpers/mapProvider';
import {
  getAuthenticatedUserName,
  getIsLoadingAreas,
  getSelectedAreas,
  getUserLocation,
} from '../../../reducers';
import { getCoordinates } from '../../../user/userActions';
import { setWebsiteObjectsCoordinates, getWebsiteObjectsCoordinates } from '../../websiteActions';
import './WebsiteObjects.less';

const WebsiteObjects = props => {
  const [currentCenter, setCurrentCenter] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(11);
  const [showMap, setShowMap] = useState(false);
  const [modalMapData, setModalMapData] = useState([]);
  const [isNewArea, setIsNewArea] = useState(false);

  useEffect(() => {
    if (isEmpty(props.userLocation)) {
      props.getCoordinates();
    }
    if (size(modalMapData) !== size(props.selectedAreas)) {
      setIsNewArea(true);
    } else {
      setIsNewArea(false);
    }
  });

  useEffect(() => {
    props
      .getWebsiteObjectsCoordinates(props.match.params.site)
      .then(res => {
        setModalMapData(res.value);
      })
      .catch(err => console.error('Error: ', err));
  }, []);

  const startOwnLocation = [+props.userLocation.lat, +props.userLocation.lon];
  const setMapCenter = () => (isEmpty(currentCenter) ? startOwnLocation : currentCenter);

  const setPosition = () => setCurrentCenter(startOwnLocation);
  const incrementZoom = () => setCurrentZoom(currentZoom + 1);
  const decrementZoom = () => setCurrentZoom(currentZoom - 1);

  const handleModalOkButton = currData => {
    setModalMapData([...modalMapData, currData]);
    setShowMap(!showMap);
  };

  const saveCurrentAreas = () => {
    const params = {
      host: props.match.params.site,
      userName: props.authUserName,
      mapCoordinates: modalMapData,
    };

    props.setWebsiteObjectsCoordinates(params).then(() => setIsNewArea(false));
  };

  const removeArea = id =>
    setModalMapData(modalMapData.filter(area => !isEqual(+id, area.center[0])));

  const zoomButtonsLayout = () => (
    <div className="WebsiteObjectsControl">
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

  const modalMap = () => {
    let currData = {};

    return (
      <Modal
        title={`Select area`}
        closable
        onCancel={() => setShowMap(!showMap)}
        onOk={() => handleModalOkButton(currData)}
        visible={showMap}
      >
        {zoomButtonsLayout()}
        {!isEmpty(props.userLocation) && (
          <Map
            center={setMapCenter()}
            zoom={currentZoom}
            height={400}
            provider={mapProvider}
            onBoundsChanged={data => {
              currData = {
                topPoint: data.bounds.ne,
                bottomPoint: data.bounds.sw,
                center: data.center,
                zoom: data.zoom,
              };
            }}
          />
        )}
      </Modal>
    );
  };

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
        {props.isLoadingAreas ? (
          <div role="presentation" className="MapWrap__loading">
            <Icon type="loading" />
          </div>
        ) : (
          isNewArea && (
            <div role="presentation" className="MapWrap__agree-areas" onClick={saveCurrentAreas}>
              <Icon type="check-circle" theme="filled" />
            </div>
          )
        )}
        {zoomButtonsLayout()}
        {!isEmpty(props.userLocation) && (
          <Map
            center={setMapCenter()}
            zoom={currentZoom}
            height={400}
            provider={mapProvider}
            onBoundsChanged={({ center, zoom }) => {
              setCurrentCenter(center);
              setCurrentZoom(zoom);
            }}
          >
            {!isEmpty(modalMapData) &&
              modalMapData.map(area => {
                const id = area.center[0];
                return (
                  <Overlay key={id} anchor={area.center}>
                    <div style={{ border: '2px solid red', width: '80px', height: '60px' }}>
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
  selectedAreas: PropTypes.shape(),
  isLoadingAreas: PropTypes.bool,
};

WebsiteObjects.defaultProps = {
  selectedAreas: [],
  isLoadingAreas: false,
};

export default connect(
  state => ({
    userLocation: getUserLocation(state),
    authUserName: getAuthenticatedUserName(state),
    selectedAreas: getSelectedAreas(state),
    isLoadingAreas: getIsLoadingAreas(state),
  }),
  {
    getCoordinates,
    setWebsiteObjectsCoordinates,
    getWebsiteObjectsCoordinates,
  },
)(withRouter(injectIntl(WebsiteObjects)));
