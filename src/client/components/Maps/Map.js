import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import React from 'react';
import Map from 'pigeon-maps';
import { Icon, Modal } from 'antd';
import Marker from 'pigeon-marker/react';
import Overlay from 'pigeon-overlay';
import classNames from 'classnames';
import { getClientWObj } from '../../adapters';
import { getInnerFieldWithMaxWeight } from '../../object/wObjectHelper';
import { mapFields, objectFields } from '../../../common/constants/listOfFields';
import Loading from '../Icon/Loading';
import { getIsMapModalOpen, getSuitableLanguage } from '../../reducers';
import { setMapFullscreenMode } from './mapActions';
import './Map.less';
import mapProvider from '../../helpers/mapProvider';

const defaultCoords = {
  centerLat: 37.0902,
  centerLng: 95.0235,
};
@connect(
  state => ({
    isFullscreenMode: getIsMapModalOpen(state),
    usedLocale: getSuitableLanguage(state),
  }),
  {
    setMapFullscreenMode,
  },
)
class MapOS extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      infoboxData: false,
      markersLayout: this.getMarkers(props),
      zoom: 8,
      center: [+this.props.userLocation.lat, +this.props.userLocation.lon],
      isInitial: true,
    };

    this.onBoundsChanged = this.onBoundsChanged.bind(this);
    this.showUserPosition = this.showUserPosition.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.zoomButtonsLayout = this.zoomButtonsLayout.bind(this);
  }

  componentDidMount() {
    const { zoom, center } = this.state;
    const { getMapAreaData } = this.props;
    getMapAreaData(zoom, center);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.wobjects, this.props.wobjects)) {
      this.setState({
        markersLayout: this.getMarkers(nextProps),
        // center: [+this.props.userLocation.lat, +this.props.userLocation.lon],
      });
    }
  }

  componentDidUpdate( prevProps, prevState) {
    const { zoom, center } = this.state;
    if ((prevState.zoom !== zoom) || (!_.isEqual(prevState.center, center))) {
      const { getMapAreaData  } = this.props;
      getMapAreaData(zoom, center);
    }
  }

  onBoundsChanged = ({ center, zoom }) => {
    const { setArea } = this.props;
    setArea({ center, zoom });
    this.setState({ center, zoom });
  };

  getMarkers = props =>
    !_.isEmpty(props.wobjects)
      ? _.map(props.wobjects, wobject => {
          const lat = getInnerFieldWithMaxWeight(wobject, objectFields.map, mapFields.latitude);
          const lng = getInnerFieldWithMaxWeight(wobject, objectFields.map, mapFields.longitude);
          return lat && lng ? (
            <Marker
              key={`obj${wobject.author_permlink}`}
              anchor={[+lat, +lng]}
              payload={wobject}
              onMouseOver={this.handleMarkerClick}
              onMouseOut={this.closeInfobox}
              onClick={() => {
                props.onMarkerClick(wobject.author_permlink);
              }}
            />
          ) : null;
        })
      : null;

  getOverlayLayout = () => {
    const wobj = getClientWObj(this.state.infoboxData.wobject, this.props.usedLocale);
    return (
      <Overlay anchor={this.state.infoboxData.coordinates} offset={[-12, 35]}>
        <div role="presentation" className="MapOS__overlay-wrap">
          <img src={wobj.avatar} width={35} height={35} alt="" />
          <div className="MapOS__overlay-wrap-name">{wobj.name}</div>
        </div>
      </Overlay>
    );
  };

  setPosition = () => {
    this.setCoordinates();
  };

  setCoordinates = () => {
    if (navigator && navigator.geolocation) {
      const positionGPS = navigator.geolocation.getCurrentPosition(this.showUserPosition);
      if (positionGPS) {
        this.setState({ center: positionGPS });
      }
    }
  };

  showUserPosition = position => {
    this.setState({ center: [position.coords.latitude, position.coords.longitude] });
  };

  handleMarkerClick = ({ payload, anchor }) => {
    if (this.state.infoboxData && this.state.infoboxData.coordinates === anchor) {
      this.setState({ infoboxData: null });
    }
    this.setState({ infoboxData: { wobject: payload, coordinates: anchor } });
  };

  closeInfobox = () => {
    this.setState({ infoboxData: null });
  };

  incrementZoom = () =>
    this.state.zoom < 20 ? this.setState({ zoom: this.state.zoom + 1 }) : null;

  decrementZoom = () => (this.state.zoom > 0 ? this.setState({ zoom: this.state.zoom - 1 }) : null);

  toggleModal = () => this.props.setMapFullscreenMode(!this.props.isFullscreenMode);

  zoomButtonsLayout = () => (
    <div className="MapOS__zoom">
      <div role="presentation" className="MapOS__zoom-button" onClick={this.incrementZoom}>
        +
      </div>
      <div role="presentation" className="MapOS__zoom-button" onClick={this.decrementZoom}>
        -
      </div>
    </div>
  );

  render() {
    const { heigth, isFullscreenMode, customControl, onCustomControlClick } = this.props;
    const { markersLayout, infoboxData, zoom, center } = this.state;
    console.log('center', center);
    return center ? (
      <div className="MapOS">
        <Map
          provider={mapProvider}
          onBoundsChanged={this.onBoundsChanged}
          center={center}
          zoom={zoom}
          height={heigth}
          animate
        >
          {markersLayout}
          {infoboxData && this.getOverlayLayout()}
        </Map>
        {this.zoomButtonsLayout()}
        <div role="presentation" className="MapOS__locateGPS" onClick={this.setPosition}>
          <img src="/images/icons/aim.png" alt="aim" className="MapOS__locateGPS-button" />
        </div>
        <div role="presentation" className="MapOS__fullScreen" onClick={this.toggleModal}>
          <Icon type="fullscreen" style={{ fontSize: '25px', color: '#000000' }} />
        </div>
        {isFullscreenMode && (
          <Modal
            style={{ top: 0 }}
            title={null}
            footer={null}
            visible={isFullscreenMode}
            onCancel={this.toggleModal}
            width={'100%'}
            wrapClassName={classNames('MapModal')}
            destroyOnClose
          >
            <div className="MapOS__fullscreenContent">
              <Map
                onBoundsChanged={this.onBoundsChanged}
                provider={mapProvider}
                center={center}
                zoom={zoom}
                animate
              >
                {markersLayout}
                {infoboxData && this.getOverlayLayout()}
              </Map>
              {this.zoomButtonsLayout()}
              <div role="presentation" className="MapOS__locateGPS" onClick={this.setPosition}>
                <img src="/images/icons/aim.png" alt="aim" className="MapOS__locateGPS-button" />
              </div>
              <div role="presentation" className="MapOS__fullScreen" onClick={this.toggleModal}>
                <Icon type="fullscreen-exit" style={{ fontSize: '25px', color: '#000000' }} />
              </div>
              {customControl && typeof onCustomControlClick === 'function' ? (
                <div
                  role="presentation"
                  className="MapOS__icon-customized"
                  onClick={onCustomControlClick}
                >
                  {customControl}
                </div>
              ) : null}
            </div>
          </Modal>
        )}
      </div>
    ) : (
      <Loading />
    );
  }
}

MapOS.propTypes = {
  isFullscreenMode: PropTypes.bool,
  heigth: PropTypes.number,
  userLocation: PropTypes.shape(),
  wobjects: PropTypes.arrayOf(PropTypes.shape()),
  customControl: PropTypes.node,
  usedLocale: PropTypes.string,
  onCustomControlClick: PropTypes.func,
  setArea: PropTypes.func,
  setMapFullscreenMode: PropTypes.func,
  getMapAreaData: PropTypes.func.isRequired,
};

MapOS.defaultProps = {
  ...defaultCoords,
  isFullscreenMode: false,
  markers: {},
  wobjects: [],
  heigth: 200,
  userLocation: {},
  customControl: null,
  usedLocale: 'en-US',
  setArea: () => {},
  setMapFullscreenMode: () => {},
  onCustomControlClick: () => {},
};

export default MapOS;
