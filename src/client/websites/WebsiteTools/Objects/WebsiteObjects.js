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
          const bottomPoint = currValue.bottomPoint;
          const center = currValue.center;

          // Main red points
          const topLeftPoint = [topPoint[1], bottomPoint[0]];
          const topMiddlePoint = [topPoint[1], (bottomPoint[0] + topPoint[0]) / 2];
          const topRightPoint = [topPoint[1], topPoint[0]];
          const rightMiddlePoint = [(bottomPoint[1] + topPoint[1]) / 2, topPoint[0]];
          const bottomRightPoint = [bottomPoint[1], topPoint[0]];
          const bottomMiddlePoint = [bottomPoint[1], (bottomPoint[0] + topPoint[0]) / 2];
          const bottomLeftPoint = [bottomPoint[1], bottomPoint[0]];
          const leftMiddlePoint = [(bottomPoint[1] + topPoint[1]) / 2, bottomPoint[0]];

          // Additionally points between main points
          const topQuarterLeft = [
            (topLeftPoint[0] + topMiddlePoint[0]) / 2,
            (topLeftPoint[1] + topMiddlePoint[1]) / 2,
          ];
          const topQuarterRight = [
            (topRightPoint[0] + topMiddlePoint[0]) / 2,
            (topRightPoint[1] + topMiddlePoint[1]) / 2,
          ];

          const leftQuarterTop = [
            (topLeftPoint[0] + leftMiddlePoint[0]) / 2,
            (topLeftPoint[1] + leftMiddlePoint[1]) / 2,
          ];
          const leftQuarterButton = [
            (leftMiddlePoint[0] + bottomLeftPoint[0]) / 2,
            (leftMiddlePoint[1] + bottomLeftPoint[1]) / 2,
          ];

          const bottomQuarterLeft = [
            (bottomMiddlePoint[0] + bottomLeftPoint[0]) / 2,
            (bottomMiddlePoint[1] + bottomLeftPoint[1]) / 2,
          ];
          const bottomQuarterRight = [
            (bottomMiddlePoint[0] + bottomRightPoint[0]) / 2,
            (bottomMiddlePoint[1] + bottomRightPoint[1]) / 2,
          ];

          const rightQuarterTop = [
            (rightMiddlePoint[0] + topRightPoint[0]) / 2,
            (rightMiddlePoint[1] + topRightPoint[1]) / 2,
          ];
          const rightQuarterBottom = [
            (rightMiddlePoint[0] + bottomRightPoint[0]) / 2,
            (rightMiddlePoint[1] + bottomRightPoint[1]) / 2,
          ];

          // Additionally points between additionally points
          // Top points
          const additionallyTopLeftQuarterLeft = [
            (topLeftPoint[0] + topQuarterLeft[0]) / 2,
            (topLeftPoint[1] + topQuarterLeft[1]) / 2,
          ];
          const additionallyTopLeftQuarterRight = [
            (topQuarterLeft[0] + topMiddlePoint[0]) / 2,
            (topQuarterLeft[1] + topMiddlePoint[1]) / 2,
          ];
          const additionallyTopRightQuarterLeft = [
            (topQuarterRight[0] + topMiddlePoint[0]) / 2,
            (topQuarterRight[1] + topMiddlePoint[1]) / 2,
          ];
          const additionallyTopRightQuarterRight = [
            (topQuarterRight[0] + topRightPoint[0]) / 2,
            (topQuarterRight[1] + topRightPoint[1]) / 2,
          ];

          // Right points
          const additionallyRightTopQuarterTop = [
            (topRightPoint[0] + rightQuarterTop[0]) / 2,
            (topRightPoint[1] + rightQuarterTop[1]) / 2,
          ];
          const additionallyRightTopQuarterBottom = [
            (rightMiddlePoint[0] + rightQuarterTop[0]) / 2,
            (rightMiddlePoint[1] + rightQuarterTop[1]) / 2,
          ];
          const additionallyRightBottomQuarterTop = [
            (rightMiddlePoint[0] + rightQuarterBottom[0]) / 2,
            (rightMiddlePoint[1] + rightQuarterBottom[1]) / 2,
          ];
          const additionallyRightBottomQuarterBottom = [
            (rightQuarterBottom[0] + bottomRightPoint[0]) / 2,
            (rightQuarterBottom[1] + bottomRightPoint[1]) / 2,
          ];

          // Bottom points
          const additionallyBottomRightQuarterRight = [
            (bottomQuarterRight[0] + bottomRightPoint[0]) / 2,
            (bottomQuarterRight[1] + bottomRightPoint[1]) / 2,
          ];
          const additionallyBottomRightQuarterLeft = [
            (bottomQuarterRight[0] + bottomMiddlePoint[0]) / 2,
            (bottomQuarterRight[1] + bottomMiddlePoint[1]) / 2,
          ];
          const additionallyBottomLeftQuarterRight = [
            (bottomQuarterLeft[0] + bottomMiddlePoint[0]) / 2,
            (bottomQuarterLeft[1] + bottomMiddlePoint[1]) / 2,
          ];
          const additionallyBottomLeftQuarterLeft = [
            (bottomQuarterLeft[0] + bottomLeftPoint[0]) / 2,
            (bottomQuarterLeft[1] + bottomLeftPoint[1]) / 2,
          ];

          // Left points
          const additionallyLeftBottomQuarterBottom = [
            (leftQuarterButton[0] + bottomLeftPoint[0]) / 2,
            (leftQuarterButton[1] + bottomLeftPoint[1]) / 2,
          ];
          const additionallyLeftBottomQuarterTop = [
            (leftQuarterButton[0] + leftMiddlePoint[0]) / 2,
            (leftQuarterButton[1] + leftMiddlePoint[1]) / 2,
          ];
          const additionallyLeftTopQuarterBottom = [
            (leftQuarterTop[0] + leftMiddlePoint[0]) / 2,
            (leftQuarterTop[1] + leftMiddlePoint[1]) / 2,
          ];
          const additionallyLeftTopQuarterTop = [
            (leftQuarterTop[0] + topLeftPoint[0]) / 2,
            (leftQuarterTop[1] + topLeftPoint[1]) / 2,
          ];

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
                    return drawArea(item, removeBtn, uuidv4());
                  }
                  return drawArea(item, rectangle(), uuidv4());
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
