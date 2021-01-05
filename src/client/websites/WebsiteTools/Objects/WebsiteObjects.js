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
import { getAuthenticatedUserName, getIsLoadingAreas, getUserLocation } from '../../../reducers';
import { getCoordinates } from '../../../user/userActions';
import { setWebsiteObjectsCoordinates, getWebsiteObjectsCoordinates } from '../../websiteActions';
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
  });
  console.log('currentZoom: ', currentZoom);
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
  const incrementZoom = () => setCurrentZoom(Math.round(currentZoom) + 1);
  const decrementZoom = () => setCurrentZoom(Math.round(currentZoom) - 1);

  // const getCurrentSizeArea = (zoom) => {
  //   let st = {
  //     border: '2px solid red',
  //     width: '472px',
  //     height: '400px'
  //   }
  //
  //   // width - 35.63
  //   // height - 30.90
  //
  //   if (zoom > 10 && zoom <= 11) {
  //     st = {
  //       ...st,
  //       width: '472px'
  //     };
  //   } else if (zoom > 9 && zoom <= 10) {
  //     st = {
  //       ...st,
  //       width: '356.37px'
  //     };
  //   } else if (zoom > 8 && zoom <= 9) {
  //     st = {
  //       ...st,
  //       width: '320.74px'
  //     };
  //   } else if (zoom > 7 && zoom <= 8) {
  //     st = {
  //       ...st,
  //       width: '285.11px'
  //     };
  //   } else if (zoom > 6 && zoom <= 7) {
  //     st = {
  //       ...st,
  //       width: '249.48px'
  //     };
  //   } else if (zoom > 5 && zoom <= 6) {
  //     st = {
  //       ...st,
  //       width: '213.85px'
  //     };
  //   } else if (zoom > 4 && zoom <= 5) {
  //     st = {
  //       ...st,
  //       width: '178.22px'
  //     };
  //   } else if (zoom > 3 && zoom <= 4) {
  //     st = {
  //       ...st,
  //       width: '114.87px'
  //     };
  //   } else if (zoom > 2 && zoom <= 3) {
  //     st = {
  //       ...st,
  //       width: '79.24px'
  //     };
  //   } else if (zoom > 1 && zoom <= 2) {
  //     st = {
  //       ...st,
  //       width: '43.61px'
  //     };
  //   }
  //   return st;
  // }

  let currStyle = {
    border: '2px solid red',
    width: '300px',
    height: '250px',
  };

  if (currentZoom < 4 && currentZoom > 0) {
    currStyle = {
      ...currStyle,
      transform: 'scale(0.2)',
      marginLeft: -150,
      marginTop: -140,
      // width: '114.87px'
    };
  } else if (currentZoom === 4) {
    currStyle = {
      ...currStyle,
      transform: 'scale(0.2)',
      marginLeft: -150,
      marginTop: -140,
      // width: '114.87px'
    };
  } else if (currentZoom === 5) {
    currStyle = {
      ...currStyle,
      transform: 'scale(0.3)',
      marginLeft: -150,
      marginTop: -140,
      // width: '178.22px'
    };
  } else if (currentZoom === 6) {
    currStyle = {
      ...currStyle,
      transform: 'scale(0.4)',
      marginLeft: -150,
      marginTop: -140,
      // width: '213.85px'
    };
  } else if (currentZoom === 7) {
    currStyle = {
      ...currStyle,
      transform: 'scale(0.5)',
      marginLeft: -150,
      marginTop: -140,
      // width: '249.48px'
    };
  } else if (currentZoom === 8) {
    currStyle = {
      ...currStyle,
      transform: 'scale(0.6)',
      marginLeft: -100,
      marginTop: -90,
      // width: '285.11px'
    };
  } else if (currentZoom === 9) {
    currStyle = {
      ...currStyle,
      transform: 'scale(0.7)',
      marginLeft: -70,
      marginTop: -60,
    };
  } else if (currentZoom === 10) {
    currStyle = {
      ...currStyle,
      transform: 'scale(0.8)',
      marginLeft: -50,
      marginTop: -40,
    };
  } else if (currentZoom === 11) {
    currStyle = {
      ...currStyle,
      marginLeft: 0,
      marginTop: 0,
    };
  } else if (currentZoom === 12) {
    currStyle = {
      ...currStyle,
      transform: 'scale(1.5)',
    };
  } else if (currentZoom === 13) {
    currStyle = {
      ...currStyle,
      transform: 'scale(2)',
    };
  } else if (currentZoom === 14) {
    currStyle = {
      ...currStyle,
      transform: 'scale(2.5)',
    };
  } else if (currentZoom === 15) {
    currStyle = {
      ...currStyle,
      transform: 'scale(2.5)',
    };
  } else if (currentZoom === 16) {
    currStyle = {
      ...currStyle,
      transform: 'scale(2.5)',
    };
  } else if (currentZoom === 17) {
    currStyle = {
      ...currStyle,
      transform: 'scale(2.5)',
    };
  } else if (currentZoom === 18) {
    currStyle = {
      ...currStyle,
      transform: 'scale(2.5)',
    };
  }

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

    props.setWebsiteObjectsCoordinates(params);
  };

  const removeArea = id =>
    setModalMapData(modalMapData.filter(area => !isEqual(+id, area.center[0])));

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
          <div role="presentation" className="MapWrap__agree-areas" onClick={saveCurrentAreas}>
            <Icon type="check-circle" theme="filled" />
          </div>
        )}
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
                    <div style={currStyle}>
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
  isLoadingAreas: PropTypes.bool,
};

WebsiteObjects.defaultProps = {
  isLoadingAreas: false,
};

export default connect(
  state => ({
    userLocation: getUserLocation(state),
    authUserName: getAuthenticatedUserName(state),
    isLoadingAreas: getIsLoadingAreas(state),
  }),
  {
    getCoordinates,
    setWebsiteObjectsCoordinates,
    getWebsiteObjectsCoordinates,
  },
)(withRouter(injectIntl(WebsiteObjects)));
