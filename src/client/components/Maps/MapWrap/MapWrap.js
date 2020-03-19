import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import _ from 'lodash';
import MapOS from '../Map';
import { getRadius } from '../mapHelper';
import Loading from '../../Icon/Loading';
import './MapWrap.less';

@injectIntl
class MapWrap extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    wobjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onMarkerClick: PropTypes.func.isRequired,
    getAreaSearchData: PropTypes.func,
    userLocation: PropTypes.shape().isRequired,
    customControl: PropTypes.node,
    onCustomControlClick: PropTypes.func,
    setMapArea: PropTypes.func.isRequired,
  };

  static defaultProps = {
    getAreaSearchData: () => {},
    userLocation: {},
    center: [],
    customControl: null,
    onCustomControlClick: () => {},
  };

  state = {
    center: [],
    zoom: 8,
    radius: 72000,
  };

  getAreaSearchData = () => {
    const { zoom, center } = this.state;
    const { getAreaSearchData } = this.props;
    if (_.isEmpty(center)) {
      getAreaSearchData({
        radius: 500000000,
        coordinates: [+this.props.userLocation.lat, +this.props.userLocation.lon],
      });
    } else {
      getAreaSearchData({ radius: getRadius(zoom), coordinates: center });
    }
  };

  setArea = ({ center, zoom }) => {
    this.setState({ center, zoom });
  };

  handleCustomControlClick = () => {
    const { zoom, center } = this.state;
    const { onCustomControlClick } = this.props;
    if (_.isEmpty(center)) {
      onCustomControlClick({
        radius: 500000000,
        coordinates: [+this.props.userLocation.lat, +this.props.userLocation.lon],
      });
    } else {
      onCustomControlClick({ radius: getRadius(zoom), coordinates: center });
    }
  };

  render() {
    const { intl, userLocation, onMarkerClick, wobjects, customControl, setMapArea } = this.props;
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
            className={'map-wrap__header-btn'}
            onClick={this.getAreaSearchData}
          >
            {intl.formatMessage({
              id: 'search_area',
              defaultMessage: 'Search area',
            })}
          </div>
        </div>
        {_.isEmpty(userLocation) ? (
          <div
            className="ant-card-loading-block flex justify-center items-center"
            style={{ height: 268, width: '100%' }}
          >
            <Loading />
          </div>
        ) : (
          <MapOS
            wobjects={wobjects}
            heigth={268}
            width={270}
            userLocation={userLocation}
            onMarkerClick={onMarkerClick}
            setArea={this.setArea}
            customControl={customControl}
            onCustomControlClick={this.handleCustomControlClick}
            setMapArea={setMapArea}
          />
        )}
      </div>
    );
  }
}
export default MapWrap;
