import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MarkerWithReward from '../../../websites/MainMap/MarkerWithReward/MarkerWithReward';
import { getObjectReward } from '../../../helpers/wObjectHelper';
import { initialColors } from '../../../websites/constants/colors';
import { getWebsiteColors } from '../../../../store/appStore/appSelectors';
import SimpleMarker from './SimpleMarker';
import UserLocation from './UserLocation';

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
      mapMarkerText: PropTypes.string,
    }),
  };

  static defaultProps = {
    colors: {
      mapMarkerBody: '',
      mapMarkerText: '',
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
      const markerTextColor = this.props.colors.mapMarkerText || initialColors.text;

      if (currLocation) {
        return <UserLocation markerColor={markerColor} />;
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

      return (
        <SimpleMarker
          width={width}
          height={height}
          markerColor={markerColor}
          markerText={markerTextColor}
        />
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
