import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import _ from 'lodash';
import MapOS from '../Map';
import { calculateAreaRadius } from '../mapHelper';
import './MapWrap.less';

@injectIntl
class MapWrap extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    wobjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onMarkerClick: PropTypes.func.isRequired,
    getAreaSearchData: PropTypes.func,
    userLocation: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    getAreaSearchData: () => {},
    userLocation: {},
    center: [],
  };

  state = {
    isFilterOn: false,
    center: [],
    zoom: 8,
  };

  getAreaSearchData = () => {
    const { zoom, center, isFilterOn } = this.state;
    const { getAreaSearchData } = this.props;
    if (!isFilterOn) {
      if (_.isEmpty(center)) {
        getAreaSearchData({
          radius: 500000000,
          coordinates: [+this.props.userLocation.lat, +this.props.userLocation.lon],
        });
      } else {
        getAreaSearchData({ radius: calculateAreaRadius(zoom, 270, center), coordinates: center });
      }
    } else {
      getAreaSearchData({
        radius: 0,
        coordinates: [],
      });
    }

    this.setState({ isFilterOn: !isFilterOn });
  };

  setArea = ({ center, zoom }) => {
    this.setState({ center, zoom });
  };

  render() {
    const { intl, userLocation, onMarkerClick, wobjects } = this.props;
    const { isFilterOn } = this.state;
    return (
      <div className="map-wrap">
        <div className="map-wrap__header">
          <div className="map-wrap__header-title">
            <Icon type="compass" />
            {intl.formatMessage({
              id: 'map',
              defaultMessage: 'Map',
            })}
          </div>
          <div
            role="presentation"
            className={`map-wrap__header-btn${isFilterOn ? ' active' : ''}`}
            onClick={this.getAreaSearchData}
          >
            {intl.formatMessage({
              id: 'search_area',
              defaultMessage: 'Search area',
            })}
          </div>
        </div>
        <MapOS
          wobjects={wobjects}
          heigth={268}
          userLocation={userLocation}
          onMarkerClick={onMarkerClick}
          setArea={this.setArea}
        />
      </div>
    );
  }
}
export default MapWrap;
