import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import uuidv4 from 'uuid/v4';
import { isEmpty, isEqual, map } from 'lodash';
import Map from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import mapProvider from '../../../helpers/mapProvider';
import { getAuthenticatedUserName, getIsUsersAreas, getUserLocation } from '../../../reducers';
import { getCoordinates } from '../../../user/userActions';
import { setWebsiteObjectsCoordinates, getWebsiteObjectsCoordinates } from '../../websiteActions';

import './WebsiteObjects.less';

const WebsiteObjects = props => {
  const [mapData, setMapData] = useState([]);
  const [currAreaData, setCurrAreaData] = useState([]);
  const [area, setArea] = useState({
    center: [],
    zoom: 11,
    bounds: { topPoint: [], bottomPoint: [] },
  });

  const calculatePointCoords = (isDiv, isDivFirst, isDivSecond, elem1, elem2, elem3, elem4) => {
    if (isDiv) {
      if (isDivFirst && !isDivSecond) {
        return [[elem1 + elem2] / 2, elem3];
      } else if (!isDivFirst && isDivSecond) {
        return [elem1, [elem2 + elem3] / 2];
      }
      return [(elem1 + elem2) / 2, (elem3 + elem4) / 2];
    }
    return [elem1, elem2];
  };

  useEffect(() => {
    if (isEmpty(props.userLocation)) {
      props.getCoordinates();
    }
    if (!isEqual(props.usersSelectedAreas, mapData)) {
      setMapData(props.usersSelectedAreas);
    }
  }, [props.userLocation, props.usersSelectedAreas]);

  useEffect(() => {
    props
      .getWebsiteObjectsCoordinates(props.match.params.site)
      .then(res => {
        const { value } = res;
        setMapData(value);
      })
      .catch(err => console.error('Error: ', err));
  }, []);

  useEffect(() => {
    const arrData = [];
    // eslint-disable-next-line array-callback-return
    map(mapData, currValue => {
      const topPoint = currValue.topPoint;
      const bottomPoint = currValue.bottomPoint;
      const center = currValue.center;

      // Main points
      const topLeftPoint = calculatePointCoords(false, false, false, topPoint[1], bottomPoint[0]);
      const topMiddlePoint = calculatePointCoords(
        true,
        false,
        true,
        topPoint[1],
        bottomPoint[0],
        topPoint[0],
      );
      const topRightPoint = calculatePointCoords(false, false, false, topPoint[1], topPoint[0]);
      const rightMiddlePoint = calculatePointCoords(
        true,
        true,
        false,
        bottomPoint[1],
        topPoint[1],
        topPoint[0],
      );
      const bottomRightPoint = calculatePointCoords(
        false,
        false,
        false,
        bottomPoint[1],
        topPoint[0],
      );
      const bottomMiddlePoint = calculatePointCoords(
        true,
        false,
        true,
        bottomPoint[1],
        bottomPoint[0],
        topPoint[0],
      );
      const bottomLeftPoint = calculatePointCoords(
        false,
        false,
        false,
        bottomPoint[1],
        bottomPoint[0],
      );
      const leftMiddlePoint = calculatePointCoords(
        true,
        true,
        false,
        bottomPoint[1],
        topPoint[1],
        bottomPoint[0],
      );

      // Additionally points between main points
      const topQuarterLeft = calculatePointCoords(
        true,
        true,
        true,
        topLeftPoint[0],
        topMiddlePoint[0],
        topLeftPoint[1],
        topMiddlePoint[1],
      );
      const topQuarterRight = calculatePointCoords(
        true,
        true,
        true,
        topRightPoint[0],
        topMiddlePoint[0],
        topRightPoint[1],
        topMiddlePoint[1],
      );
      const leftQuarterTop = calculatePointCoords(
        true,
        true,
        true,
        topLeftPoint[0],
        leftMiddlePoint[0],
        topLeftPoint[1],
        leftMiddlePoint[1],
      );
      const leftQuarterButton = calculatePointCoords(
        true,
        true,
        true,
        leftMiddlePoint[0],
        bottomLeftPoint[0],
        leftMiddlePoint[1],
        bottomLeftPoint[1],
      );
      const bottomQuarterLeft = calculatePointCoords(
        true,
        true,
        true,
        bottomMiddlePoint[0],
        bottomLeftPoint[0],
        bottomMiddlePoint[1],
        bottomLeftPoint[1],
      );
      const bottomQuarterRight = calculatePointCoords(
        true,
        true,
        true,
        bottomMiddlePoint[0],
        bottomRightPoint[0],
        bottomMiddlePoint[1],
        bottomRightPoint[1],
      );

      const rightQuarterTop = calculatePointCoords(
        true,
        true,
        true,
        rightMiddlePoint[0],
        topRightPoint[0],
        rightMiddlePoint[1],
        topRightPoint[1],
      );
      const rightQuarterBottom = calculatePointCoords(
        true,
        true,
        true,
        rightMiddlePoint[0],
        bottomRightPoint[0],
        rightMiddlePoint[1],
        bottomRightPoint[1],
      );

      // Additionally points between additionally points
      // Top points
      const additionallyTopLeftQuarterLeft = calculatePointCoords(
        true,
        true,
        true,
        topLeftPoint[0],
        topQuarterLeft[0],
        topLeftPoint[1],
        topQuarterLeft[1],
      );
      const additionallyTopLeftQuarterRight = calculatePointCoords(
        true,
        true,
        true,
        topQuarterLeft[0],
        topMiddlePoint[0],
        topQuarterLeft[1],
        topMiddlePoint[1],
      );
      const additionallyTopRightQuarterLeft = calculatePointCoords(
        true,
        true,
        true,
        topQuarterRight[0],
        topMiddlePoint[0],
        topQuarterRight[1],
        topMiddlePoint[1],
      );
      const additionallyTopRightQuarterRight = calculatePointCoords(
        true,
        true,
        true,
        topQuarterRight[0],
        topRightPoint[0],
        topQuarterRight[1],
        topRightPoint[1],
      );

      // Right points
      const additionallyRightTopQuarterTop = calculatePointCoords(
        true,
        true,
        true,
        topRightPoint[0],
        rightQuarterTop[0],
        topRightPoint[1],
        rightQuarterTop[1],
      );
      const additionallyRightTopQuarterBottom = calculatePointCoords(
        true,
        true,
        true,
        rightMiddlePoint[0],
        rightQuarterTop[0],
        rightMiddlePoint[1],
        rightQuarterTop[1],
      );
      const additionallyRightBottomQuarterTop = calculatePointCoords(
        true,
        true,
        true,
        rightMiddlePoint[0],
        rightQuarterBottom[0],
        rightMiddlePoint[1],
        rightQuarterBottom[1],
      );
      const additionallyRightBottomQuarterBottom = calculatePointCoords(
        true,
        true,
        true,
        rightQuarterBottom[0],
        bottomRightPoint[0],
        rightQuarterBottom[1],
        bottomRightPoint[1],
      );

      // Bottom points
      const additionallyBottomRightQuarterRight = calculatePointCoords(
        true,
        true,
        true,
        bottomQuarterRight[0],
        bottomRightPoint[0],
        bottomQuarterRight[1],
        bottomRightPoint[1],
      );
      const additionallyBottomRightQuarterLeft = calculatePointCoords(
        true,
        true,
        true,
        bottomQuarterRight[0],
        bottomMiddlePoint[0],
        bottomQuarterRight[1],
        bottomMiddlePoint[1],
      );
      const additionallyBottomLeftQuarterRight = calculatePointCoords(
        true,
        true,
        true,
        bottomQuarterLeft[0],
        bottomMiddlePoint[0],
        bottomQuarterLeft[1],
        bottomMiddlePoint[1],
      );
      const additionallyBottomLeftQuarterLeft = calculatePointCoords(
        true,
        true,
        true,
        bottomQuarterLeft[0],
        bottomLeftPoint[0],
        bottomQuarterLeft[1],
        bottomLeftPoint[1],
      );

      // Left points
      const additionallyLeftBottomQuarterBottom = calculatePointCoords(
        true,
        true,
        true,
        leftQuarterButton[0],
        bottomLeftPoint[0],
        leftQuarterButton[1],
        bottomLeftPoint[1],
      );
      const additionallyLeftBottomQuarterTop = calculatePointCoords(
        true,
        true,
        true,
        leftQuarterButton[0],
        leftMiddlePoint[0],
        leftQuarterButton[1],
        leftMiddlePoint[1],
      );
      const additionallyLeftTopQuarterBottom = calculatePointCoords(
        true,
        true,
        true,
        leftQuarterTop[0],
        leftMiddlePoint[0],
        leftQuarterTop[1],
        leftMiddlePoint[1],
      );
      const additionallyLeftTopQuarterTop = calculatePointCoords(
        true,
        true,
        true,
        leftQuarterTop[0],
        topLeftPoint[0],
        leftQuarterTop[1],
        topLeftPoint[1],
      );

      const data = {
        topLeftPoint,
        topMiddlePoint,
        topRightPoint,
        rightMiddlePoint,
        bottomRightPoint,
        bottomMiddlePoint,
        bottomLeftPoint,
        leftMiddlePoint,
        topQuarterLeft,
        topQuarterRight,
        leftQuarterTop,
        leftQuarterButton,
        bottomQuarterLeft,
        bottomQuarterRight,
        rightQuarterTop,
        rightQuarterBottom,
        additionallyTopLeftQuarterLeft,
        additionallyTopLeftQuarterRight,
        additionallyTopRightQuarterLeft,
        additionallyTopRightQuarterRight,
        additionallyRightTopQuarterTop,
        additionallyRightTopQuarterBottom,
        additionallyRightBottomQuarterTop,
        additionallyRightBottomQuarterBottom,
        additionallyBottomRightQuarterRight,
        additionallyBottomRightQuarterLeft,
        additionallyBottomLeftQuarterRight,
        additionallyBottomLeftQuarterLeft,
        additionallyLeftBottomQuarterBottom,
        additionallyLeftBottomQuarterTop,
        additionallyLeftTopQuarterBottom,
        additionallyLeftTopQuarterTop,
        id: uuidv4(),
        removeAreaID: center[0],
      };
      arrData.push(data);
    });
    setCurrAreaData(arrData);
  }, [mapData]);

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
      },
    ];
    saveCurrentAreas(data);
  };

  const getArea = (item, block, key) =>
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

  const rectangle = (width = '5px', margin = '0 0 0 0', height = '5px') => (
    <div className="MapWrap__area" style={{ width, height, margin, background: 'red' }} />
  );

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
                  if (index === 2 && area.zoom > 7) {
                    return getArea(item, removeBtn, uuidv4());
                  }
                  return getArea(item, rectangle(), uuidv4());
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
