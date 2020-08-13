import React from 'react';
import PropTypes from 'prop-types';

import pinMarked from '../../../../../public/images/icons/pin-mark@2x.png';
import pinHoverMarked from '../../../../../public/images/icons/pin-hover-mark@2x.png';
import pinHover from '../../../../../public/images/icons/pin-hover@2x.png';
import pin from '../../../../../public/images/icons/pin@2x.png';

const imageOffset = {
  left: 15,
  top: 31,
};

class CustomMarker extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onDoubleClick: PropTypes.func,
    onContextMenu: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    left: PropTypes.number,
    top: PropTypes.number,
    anchor: PropTypes.arrayOf(PropTypes.number).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    payload: PropTypes.any.isRequired,
    hover: PropTypes.bool,
    isMarked: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    onContextMenu: () => {},
    left: 0,
    top: 0,
    hover: false,
    onMouseOver: () => {},
    onMouseOut: () => {},
    onDoubleClick: () => {},
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

  isHover = () => (typeof this.props.hover === 'boolean' ? this.props.hover : this.state.hoverImg);

  image = () => {
    const { isMarked } = this.props;
    if (isMarked) return this.isHover() ? pinHoverMarked : pinMarked;
    return this.isHover() ? pinHover : pin;
  };

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
    // eslint-disable-next-line no-unused-expressions
    this.props.onMouseOver && this.props.onMouseOver(this.eventParameters(event));
    this.setState({ hoverImg: true });
  };

  handleMouseOut = event => {
    // eslint-disable-next-line no-unused-expressions
    this.props.onMouseOut && this.props.onMouseOut(this.eventParameters(event));
    this.setState({ hoverImg: false });
  };

  render() {
    const { left, top, onClick } = this.props;

    const style = {
      position: 'absolute',
      transform: `translate(${left - imageOffset.left}px, ${top - imageOffset.top}px)`,
      cursor: onClick ? 'pointer' : 'default',
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
        <img src={this.image()} width={29} height={34} alt="" />
      </div>
    );
  }
}

export default CustomMarker;
