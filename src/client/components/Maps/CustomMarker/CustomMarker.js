import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MarkerWithReward from '../../../websites/MainMap/MarkerWithReward/MarkerWithReward';
import { getObjectReward } from '../../../helpers/wObjectHelper';
import { initialColors } from '../../../websites/constants/colors';
import { getWebsiteColors } from '../../../../store/appStore/appSelectors';

const imageOffset = {
  left: 15,
  top: 29,
};

class CustomMarker extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onContextMenu: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    left: PropTypes.number,
    top: PropTypes.number,
    anchor: PropTypes.arrayOf(PropTypes.number).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    payload: PropTypes.any.isRequired,
    isMarked: PropTypes.bool,
    currLocation: PropTypes.bool,
    hoveredWobj: PropTypes.bool,
    colors: PropTypes.shape({
      mapMarkerBody: PropTypes.string,
    }),
  };

  static defaultProps = {
    colors: {
      mapMarkerBody: '',
    },
    onContextMenu: () => {},
    left: 0,
    top: 0,
    hover: false,
    currLocation: false,
    hoveredWobj: false,
    onMouseOver: () => {},
    onMouseOut: () => {},
    onDoubleClick: () => {},
    onClick: () => {},
    img: '',
    isMarked: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      hoverImg: false,
    };
  }

  eventParameters = event => ({
    event,
    anchor: this.props.anchor,
    payload: this.props.payload,
  });

  handleClick = event => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    return this.props.onClick && this.props.onClick(this.eventParameters(event));
  };

  handleDoubleClick = event => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    return this.props.onDoubleClick && this.props.onDoubleClick(this.eventParameters(event));
  };

  handleContextMenu = event =>
    this.props.onContextMenu && this.props.onContextMenu(this.eventParameters(event));

  handleMouseOver = event => {
    this.props.onMouseOver && this.props.onMouseOver(this.eventParameters(event));
    this.setState({ hoverImg: true });
  };

  handleMouseOut = event => {
    this.props.onMouseOut && this.props.onMouseOut(this.eventParameters(event));
    this.setState({ hoverImg: false });
  };

  colorLuminance = (color, percent) => {
    let hex = String(color).replace(/[^0-9a-f]/gi, '');

    if (hex.length < 6) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    const lum = percent || 0;
    let rgb = '#';
    let c;
    let i;

    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
      rgb += `00${c}`.substr(c.length);
    }

    return rgb;
  };

  hexToHSL = (H, percent) => {
    let r = 0;
    let g = 0;
    let b = 0;

    if (H.length === 4) {
      r = `0x${H[1]}${H[1]}`;
      g = `0x${H[2]}${H[2]}`;
      b = `0x${H[3]}${H[3]}`;
    } else if (H.length === 7) {
      r = `0x${H[1]}${H[2]}`;
      g = `0x${H[3]}${H[4]}`;
      b = `0x${H[5]}${H[6]}`;
    }

    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h;
    let s;
    let l;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `hsl(${h}deg ${s}% ${l + percent}%)`;
  };

  render() {
    const { left, top, onClick, isMarked, currLocation, hoveredWobj } = this.props;
    let width = 29;
    let height = 30;
    let currTop = imageOffset.top;
    let currLeft = imageOffset.left;
    const style = {
      position: 'absolute',
      cursor: onClick ? 'pointer' : 'default',
      zIndex: isMarked ? 2 : 1,
    };

    if (currLocation) {
      currTop = 20;
      currLeft = 10;
      style.zIndex = 5;
    }

    if (hoveredWobj && !isMarked) {
      width = 40;
      height = 45;
      currTop = 43;
      currLeft = 20;
      style.zIndex = 5;
    }

    if (isMarked) {
      currTop = 31;
      currLeft = hoveredWobj ? 30 : 25;
    }

    style.transform = `translate(${left - currLeft}px, ${top - currTop}px)`;

    const currentItem = () => {
      const markerColor = this.props.colors.mapMarkerBody || initialColors.marker;

      if (currLocation) {
        const pointColor = this.hexToHSL(markerColor, -5);

        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="49.5" fill={pointColor} fillOpacity="0.6" stroke="white" />
            <circle cx="50" cy="50" r="30" fill={pointColor} />
          </svg>
        );
      }

      if (isMarked) {
        return (
          <MarkerWithReward
            colors={this.props.colors}
            price={getObjectReward(this.props.payload)}
            hovered={hoveredWobj}
          />
        );
      }

      const color = this.hexToHSL(markerColor, 20);

      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 60 79"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.5685 3.42355L18.5524 3.43128L18.5362 3.43863C8.51271 7.97307 1.50911 18.8977 1.50001 29.5732C1.59089 32.7024 2.90106 37.2014 5.58121 42.9874C8.25024 48.7495 12.215 55.6566 17.469 63.5476L17.469 63.5476L17.4735 63.5545C20.6867 68.4385 23.1728 71.9976 25.3012 74.3348C27.4676 76.7138 28.9771 77.5 30.2011 77.5C31.4285 77.5 32.9502 76.7102 35.1417 74.3289C37.2935 71.9909 39.8143 68.4315 43.0735 63.5493C53.1467 48.2851 58.1196 37.0699 58.479 28.1005C58.8301 19.3388 54.7743 12.4512 45.8769 5.7579C42.9911 3.60873 37.9848 2.1219 32.6404 1.65502C27.3019 1.18867 21.9982 1.77271 18.5685 3.42355ZM36.9894 18.5057L36.9978 18.5158L37.0061 18.5261C39.9933 22.2517 39.1787 26.9064 36.8266 29.8997C34.4703 32.8982 30.2023 34.64 26.1662 32.0067C21.171 28.913 19.8847 22.7385 23.3607 18.5116L23.3656 18.5057C26.9831 14.1526 33.3719 14.1526 36.9894 18.5057ZM44.8802 39.3414C44.8802 42.4205 42.7438 45.2488 40.0728 47.215C37.3521 49.2177 33.7459 50.5889 30.1775 50.5889C26.6091 50.5889 23.0029 49.2177 20.2822 47.215C17.6112 45.2488 15.4749 42.4205 15.4749 39.3414C15.4749 38.485 15.5472 37.4803 16.0965 36.6056C16.6831 35.6715 17.6241 35.1646 18.7207 34.8615C19.7971 34.5641 21.215 34.4099 23.0294 34.3223C24.8638 34.2338 27.2064 34.2101 30.1775 34.2101C33.1487 34.2101 35.4912 34.2338 37.3256 34.3223C39.14 34.4099 40.558 34.5641 41.6343 34.8615C42.7309 35.1646 43.6719 35.6715 44.2585 36.6056C44.8078 37.4803 44.8802 38.485 44.8802 39.3414Z"
            fill={color}
            stroke="white"
            strokeWidth="3"
          />
          <ellipse cx="30.5" cy="34.5" rx="21.5" ry="28.5" fill={color} />
          <ellipse cx="30.5" cy="30.5" rx="15.5" ry="16.5" fill="#ffffff9c" />
        </svg>
      );
    };

    return (
      <div
        style={style}
        className="pigeon-click-block"
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
        onContextMenu={this.handleContextMenu}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        role="presentation"
      >
        {currentItem()}
      </div>
    );
  }
}

export default connect(state => ({
  colors: getWebsiteColors(state),
}))(CustomMarker);
