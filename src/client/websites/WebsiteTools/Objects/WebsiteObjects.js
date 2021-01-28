import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import uuidv4 from 'uuid/v4';
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
  const [mapData, setMapData] = useState([]);
  const [currStyle, setCurrStyle] = useState({ width: 300, height: 250 });
  const [area, setArea] = useState({
    center: [],
    zoom: 11,
    bounds: { topPoint: [], bottomPoint: [] },
  });

  useEffect(() => {
    if (isEmpty(props.userLocation)) {
      props.getCoordinates();
    }
    if (!isEqual(props.usersSelectedAreas, mapData)) {
      setMapData(props.usersSelectedAreas);
    }
  }, [props.userLocation, props.usersSelectedAreas]);

  const [currAreaData, setCurrAreaData] = useState([]);

  useEffect(() => {
    props
      .getWebsiteObjectsCoordinates(props.match.params.site)
      .then(res => {
        const { value } = res;
        setMapData(value);
        console.log('value: ', value);
        const arr = [];

        // eslint-disable-next-line array-callback-return
        value.map(currValue => {
          const topPoint = currValue.topPoint;
          const buttonPoint = currValue.bottomPoint;
          const center = currValue.center;

          const data = {
            topLeftPoint: [topPoint[1], buttonPoint[0]],
            topMiddlePoint: [topPoint[1], (buttonPoint[0] + topPoint[0]) / 2],
            topRightPoint: [topPoint[1], topPoint[0]],
            rightMiddlePoint: [(buttonPoint[1] + topPoint[1]) / 2, topPoint[0]],
            buttonRightPoint: [buttonPoint[1], topPoint[0]],
            buttonMiddlePoint: [buttonPoint[1], (buttonPoint[0] + topPoint[0]) / 2],
            buttonLeftPoint: [buttonPoint[1], buttonPoint[0]],
            leftMiddlePoint: [(buttonPoint[1] + topPoint[1]) / 2, buttonPoint[0]],
            id: uuidv4(),
            removeAreaID: center[0],
          };
          arr.push(data);
        });
        setCurrAreaData(arr);
      })
      .catch(err => console.error('Error: ', err));
  }, []);

  useEffect(() => {
    getCurrStyleAfterZoom(area.zoom, setCurrStyle, currStyle);
  }, [area.zoom]);

  const startOwnLocation = [+props.userLocation.lat, +props.userLocation.lon];

  const setMapCenter = () => (isEmpty(area.center) ? startOwnLocation : area.center);
  const setPosition = () => setArea({ ...area, center: startOwnLocation });
  const incrementZoom = () => setArea({ ...area, zoom: area.zoom + 1 });
  const decrementZoom = () => setArea({ ...area, zoom: area.zoom - 1 });

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

  const saveCurrentAreas = data => {
    const params = {
      host: props.match.params.site,
      userName: props.authUserName,
      mapCoordinates: data,
    };
    props.setWebsiteObjectsCoordinates(params);
  };

  const removeArea = id => {
    const filteredAreas = mapData.filter(currArea => !isEqual(+id, currArea.center[0]));
    setMapData(filteredAreas);
    saveCurrentAreas(filteredAreas);
  };

  const addArea = () => {
    const data = [
      ...mapData,
      {
        topPoint: area.bounds.topPoint,
        bottomPoint: area.bounds.bottomPoint,
        center: area.center,
        zoom: area.zoom,
        width: 'empty',
        height: 'empty',
      },
    ];
    saveCurrentAreas(data);
  };

  const drawArea = (item, block, key) =>
    typeof item === 'object' && (
      <Overlay key={key} anchor={item}>
        {block}
      </Overlay>
    );

  const removeButton = id => (
    <span
      id={id}
      role="presentation"
      className="MapWrap__cancel"
      onClick={event => removeArea(event.target.id)}
    >
      &#9746;
    </span>
  );

  const rectangle = (width = '10px', margin = '0 0 0 0', height = '2px') => (
    <div className="MapWrap__area" style={{ width, height, margin, background: 'red' }} />
  );

  useEffect(() => {
    console.log('zoom: ', area.zoom);
  }, [area.zoom]);

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
        <div role="presentation" className="MapWrap__new-aria-btn" onClick={addArea}>
          <Icon type="plus-circle" theme="filled" />
        </div>
        {zoomButtonsLayout()}
        {!isEmpty(props.userLocation) && (
          <Map
            center={setMapCenter()}
            zoom={area.zoom}
            height={400}
            provider={mapProvider}
            onBoundsChanged={({ center, zoom, bounds }) => {
              setArea({
                center,
                zoom,
                bounds: {
                  topPoint: [bounds.ne[1], bounds.ne[0]],
                  bottomPoint: [bounds.sw[1], bounds.sw[0]],
                },
              });
            }}
          >
            {!isEmpty(currAreaData) &&
              currAreaData.map(data =>
                Object.values(data).map((item, index) => {
                  const removeBtn = removeButton(data.removeAreaID);
                  // const zoom = area.zoom;
                  if (index === 2) {
                    return drawArea(item, removeBtn, uuidv4());
                  }
                  return drawArea(item, rectangle(), uuidv4());
                  // switch (index) {
                  //   case 0: {
                  //     switch (zoom) {
                  //       case 18: {
                  //         return drawArea(item, rectangle('72829px'), uuidv4());
                  //       }
                  //       case 17: {
                  //         return drawArea(item, rectangle('36413px'), uuidv4());
                  //       }
                  //       case 16: {
                  //         return drawArea(item, rectangle('18220px'), uuidv4());
                  //       }
                  //       case 15: {
                  //         return drawArea(item, rectangle('9115px'), uuidv4());
                  //       }
                  //       case 14: {
                  //         return drawArea(item, rectangle('4563px'), uuidv4());
                  //       }
                  //       case 13: {
                  //         return drawArea(item, rectangle('2287px'), uuidv4());
                  //       }
                  //       case 12: {
                  //         return drawArea(item, rectangle('1148px', '0 0 0 0'), uuidv4());
                  //       }
                  //       case 11: {
                  //         return drawArea(item, rectangle('581px'), uuidv4());
                  //       }
                  //       case 10: {
                  //         return drawArea(item, rectangle('295px'), uuidv4());
                  //       }
                  //       case 9: {
                  //         return drawArea(item, rectangle('154px'), uuidv4());
                  //       }
                  //       case 8: {
                  //         return drawArea(item, rectangle('82px'), uuidv4());
                  //       }
                  //       case 7: {
                  //         return drawArea(item, rectangle('47px'), uuidv4());
                  //       }
                  //       case 6: {
                  //         return drawArea(item, rectangle('10px'), uuidv4());
                  //       }
                  //       case 5: {
                  //         return drawArea(item, rectangle('10px'), uuidv4());
                  //       }
                  //       default: {
                  //         return drawArea(item, rectangle(), uuidv4());
                  //       }
                  //     }
                  //   }
                  //   case 2: {
                  //     return drawArea(item, removeBtn, uuidv4());
                  //   }
                  //   default: {
                  //     return drawArea(item, rectangle(), uuidv4());
                  //   }
                  // }
                }),
              )}
          </Map>
        )}
      </div>
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
