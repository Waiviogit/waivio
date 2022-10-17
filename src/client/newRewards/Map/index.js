import { Map, ZoomControl } from 'pigeon-maps';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Icon } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { debounce, isEmpty, noop } from 'lodash';
import Overlay from 'pigeon-overlay';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useHistory } from 'react-router';

import { getRadius } from '../../components/Maps/mapHelper';
import mapProvider from '../../../common/helpers/mapProvider';
import { getCoordinates } from '../../../store/userStore/userActions';
import useQuery from '../../../hooks/useQuery';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import CustomMarker from '../../components/Maps/CustomMarker';
import ObjectOverlayCard from '../../components/Maps/Overlays/ObjectOverlayCard/ObjectOverlayCard';

import './styles.less';
import { getObjectMap } from '../../../common/helpers/wObjectHelper';

const RewardsMap = ({ getPoints, defaultCenter, parent }) => {
  const dispatch = useDispatch();
  const userName = useSelector(getAuthenticatedUserName);
  const query = useQuery();
  const history = useHistory();
  const mapRef = useRef();
  const [center, setCenter] = useState();
  const [points, setPoints] = useState([]);
  const [infoboxData, setInfoboxData] = useState(null);
  const [boundsParams, setBoundsParams] = useState({
    topPoint: [],
    bottomPoint: [],
  });
  const area = query.get('area');

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

  const defaultZoom = useMemo(() => {
    const zoom = query.get('zoom');

    return +zoom || 6;
  }, []);

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
  }, [boundsParams]);

  const setSearchArea = () => {
    if (area) {
      query.delete('area');
      query.delete('zoom');
      query.delete('radius');
    } else {
      query.set('area', mapRef.current._lastCenter);
      query.set('zoom', mapRef.current._lastZoom);
      query.set('radius', getRadius(mapRef.current._lastZoom));
    }

    history.push(`?${query.toString()}`);
  };

  const handleOnBoundsChanged = useCallback(
    debounce(bounds => {
      if (!isEmpty(bounds) && bounds.ne[0] && bounds.sw[0]) {
        setBoundsParams({
          topPoint: [bounds.ne[1], bounds.ne[0]],
          bottomPoint: [bounds.sw[1], bounds.sw[0]],
        });
      }
    }, 500),
    [setBoundsParams],
  );

  const onBoundsChanged = ({ bounds }) => {
    handleOnBoundsChanged(bounds);
  };

  if (!center) return null;

  return (
    <div className="RewardsMap">
      <div className="RewardsMap__header">
        <span>
          <Icon type="compass" /> Map
        </span>
        {!defaultCenter && (
          <button
            onClick={setSearchArea}
            className={classNames('RewardsMap__button', {
              'RewardsMap__button--selected': area,
            })}
          >
            Search area
          </button>
        )}
      </div>
      <Map
        ref={mapRef}
        defaultCenter={defaultCenter || center}
        height={270}
        width={270}
        zoom={defaultZoom}
        provider={mapProvider}
        onClick={() => {}}
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
            onDoubleClick={() => setInfoboxData(null)}
          />
        ))}
        {infoboxData && (
          <Overlay anchor={infoboxData.coordinates}>
            <ObjectOverlayCard wObject={infoboxData.wobject} />
          </Overlay>
        )}
        <ZoomControl />
        <div
          role="presentation"
          className="RewardsMap__locateGPS"
          onClick={() => mapRef.current.setCenterZoom(center)}
        >
          <img
            src="/images/focus.svg"
            alt="aim"
            className="MapConfigurationControl__locateGPS-button"
          />
        </div>
      </Map>
    </div>
  );
};

RewardsMap.propTypes = {
  getPoints: PropTypes.func,
  defaultCenter: PropTypes.arrayOf(PropTypes.number),
  parent: PropTypes.shape({
    map: PropTypes.string,
  }),
};

RewardsMap.defaultProps = {
  getPoints: noop,
  defaultCenter: null,
  parent: null,
};

export default RewardsMap;
