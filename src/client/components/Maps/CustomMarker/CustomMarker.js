import React from 'react';
import PropTypes from 'prop-types';
import MarkerWithReward from '../../../websites/MainMap/MarkerWithReward/MarkerWithReward';
import { getObjectReward } from '../../../helpers/wObjectHelper';

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
  };

  static defaultProps = {
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
    let currentImg = '/images/icons/Marker.svg';
    let currTop = imageOffset.top;
    let currLeft = imageOffset.left;
    const style = {
      position: 'absolute',
      cursor: onClick ? 'pointer' : 'default',
      zIndex: isMarked ? 2 : 1,
    };

    if (currLocation) {
      currentImg = '/images/icons/location.svg';
      width = 20;
      height = 20;
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
        {isMarked ? (
          <MarkerWithReward price={getObjectReward(this.props.payload)} hovered={hoveredWobj} />
        ) : (
          <img src={currentImg} width={width} height={height} alt="" />
        )}
      </div>
    );
  }
}

export default CustomMarker;
