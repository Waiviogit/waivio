import { Map } from 'pigeon-maps';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Icon, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { debounce, isEmpty, isEqual, noop } from 'lodash';
import Overlay from 'pigeon-overlay';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useHistory } from 'react-router';
import { injectIntl } from 'react-intl';

import { getRadius } from '../../components/Maps/mapHelper';
import mapProvider from '../../../common/helpers/mapProvider';
import { getCoordinates } from '../../../store/userStore/userActions';
import useQuery from '../../../hooks/useQuery';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import CustomMarker from '../../components/Maps/CustomMarker';
import { getObjectMap, getObjectName } from '../../../common/helpers/wObjectHelper';

import ObjectAvatar from '../../components/ObjectAvatar';
import MapControllers from '../../widgets/MapControllers/MapControllers';
import { getUserLocation } from '../../../store/userStore/userSelectors';

import './styles.less';

const RewardsMap = ({ getPoints, defaultCenter, parent, visible, onClose, intl }) => {
  const dispatch = useDispatch();
  const userName = useSelector(getAuthenticatedUserName);
  const location = useSelector(getUserLocation);
  const query = useQuery();
  const history = useHistory();
  const mapRef = useRef();
  const [fullScreen, setFullScreen] = useState(false);
  const [center, setCenter] = useState();
  const [zoom, setZoom] = useState(3);
  const [points, setPoints] = useState([]);
  const [infoboxData, setInfoboxData] = useState(null);
  const [boundsParams, setBoundsParams] = useState({
    topPoint: [],
    bottomPoint: [],
  });
  const area = query.get('area');

  const setSearchArea = () => {
    if (area) {
      query.delete('area');
      query.delete('zoom');
      query.delete('radius');
    } else {
      query.set('area', mapRef.current._lastCenter);
      query.set('zoom', zoom);
      query.set('radius', getRadius(zoom));
    }

    history.push(`?${query.toString()}`);
  };

  useEffect(() => {
    if (mapRef.current && !defaultCenter) {
      const bounce = mapRef.current.getBounds();

      if (bounce.ne[0] && bounce.sw[0]) {
        setBoundsParams({
          topPoint: [bounce.ne[1], bounce.ne[0]],
          bottomPoint: [bounce.sw[1], bounce.sw[0]],
        });
      }
    }
  }, [mapRef.current]);

  const getCurrentCoordinates = async () => {
    if (area) {
      const currArea = area.split(',');

      setCenter([+currArea[0], +currArea[1]]);
    } else {
      const { value } = await dispatch(getCoordinates());

      setCenter([value.latitude, value.longitude]);
    }
  };

  useEffect(() => {
    getCurrentCoordinates();
  }, []);

  useEffect(() => {
    if (!defaultCenter && !isEmpty(boundsParams.bottomPoint) && !isEmpty(boundsParams.topPoint)) {
      getPoints(userName, boundsParams).then(res => {
        setPoints(res.rewards);
      });
    }

    if (defaultCenter) setPoints([{ ...parent, map: getObjectMap(parent) }]);
  }, [
    boundsParams.topPoint[0],
    boundsParams.topPoint[1],
    boundsParams.bottomPoint[0],
    boundsParams.bottomPoint[1],
    history.location.pathname,
  ]);

  const handleOnBoundsChanged = useCallback(
    debounce(bounds => {
      if (
        bounds.ne[0] &&
        bounds.sw[0] &&
        !isEqual([bounds.ne[1], bounds.ne[0]], boundsParams.topPoint) &&
        !isEqual([bounds.sw[1], bounds.sw[0]], boundsParams.bottomPoint)
      ) {
        setBoundsParams({
          topPoint: [bounds.ne[1], bounds.ne[0]],
          bottomPoint: [bounds.sw[1], bounds.sw[0]],
        });
      }
    }, 500),
    [setBoundsParams, boundsParams],
  );

  const onBoundsChanged = ({ bounds, center: boundsCenter, zoom: boundsZoom }) => {
    setCenter(boundsCenter);
    setZoom(boundsZoom);
    handleOnBoundsChanged(bounds);
  };

  if (!center) return null;
  const closeModal = () => {
    if (fullScreen) setFullScreen(false);
    if (visible) onClose(false);
  };

  const body = (width = 270, height = 270) => (
    <div className="RewardsMap">
      <div className="RewardsMap__header">
        <span>
          <Icon type="compass" /> {intl.formatMessage({ id: 'map', defaultMessage: 'Map' })}
        </span>
        {!defaultCenter && (
          <button
            onClick={setSearchArea}
            className={classNames('RewardsMap__button', {
              'RewardsMap__button--selected': area,
            })}
          >
            {intl.formatMessage({ id: 'search_area', defaultMessage: 'Search area' })}
          </button>
        )}
      </div>
      <Map
        ref={mapRef}
        center={center}
        height={height}
        width={width}
        zoom={zoom}
        provider={mapProvider}
        onClick={({ event }) => {
          if (event.target.classList.value === 'overlay') {
            history.push(infoboxData.wobject.defaultShowLink);
          } else {
            setInfoboxData(null);
          }
        }}
        onBoundsChanged={onBoundsChanged}
      >
        {points?.map(i => (
          <CustomMarker
            key={i.name}
            anchor={[+i.map?.latitude, +i.map?.longitude]}
            payload={i}
            onClick={({ payload, anchor }) =>
              setInfoboxData({ wobject: payload, coordinates: anchor })
            }
            onDoubleClick={() => {
              setInfoboxData(null);
            }}
            isMarked
          />
        ))}
        {infoboxData && (
          <Overlay
            anchor={infoboxData.coordinates}
            className={'overlay'}
            style={{
              border: '1px solid',
              borderRadius: '4px',
              left: '-75px',
              top: '-75px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              zIndex: 6,
              cursor: 'pointer',
            }}
          >
            <ObjectAvatar className={'overlay'} item={infoboxData.wobject} size={35} />{' '}
            <span className={'overlay'}>{getObjectName(infoboxData.wobject)}</span>
          </Overlay>
        )}
        <MapControllers
          className={'WebsiteBodyControl'}
          decrementZoom={() => setZoom(zoom + 1)}
          incrementZoom={() => setZoom(zoom - 1)}
          successCallback={geo => {
            setCenter([geo.coords.latitude, geo.coords.longitude]);
          }}
          rejectCallback={() => setCenter([location.latitude, location.longitude])}
        />
        <div
          role="presentation"
          className="RewardsMap__mapButton RewardsMap__full"
          onClick={() => setFullScreen(!fullScreen)}
        >
          <Icon type={fullScreen ? 'fullscreen-exit' : 'fullscreen'} />
        </div>
      </Map>
    </div>
  );

  return fullScreen || visible ? (
    <Modal
      className="RewardsMap__modal"
      visible={fullScreen || visible}
      onCancel={closeModal}
      onOk={closeModal}
      footer={null}
    >
      {body('100%', `calc(100vh - 150px)`)}
    </Modal>
  ) : (
    body()
  );
};

RewardsMap.propTypes = {
  getPoints: PropTypes.func,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  defaultCenter: PropTypes.arrayOf(PropTypes.number),
  parent: PropTypes.shape({
    map: PropTypes.string,
  }),
  intl: PropTypes.shape().isRequired,
};

RewardsMap.defaultProps = {
  getPoints: noop,
  onClose: noop,
  defaultCenter: null,
  parent: null,
  visible: false,
};

export default injectIntl(RewardsMap);
