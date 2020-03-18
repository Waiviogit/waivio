import React from 'react';
import PropTypes from 'prop-types';

import pinMarked from '../../../../../public/images/icons/pin-mark@2x.png';
import pinHoverMarked from '../../../../../public/images/icons/pin-hover-mark@2x.png';
import pinHoverRetina from '../../../../../public/images/icons/pin-hover@2x.png';
import pinRetina from '../../../../../public/images/icons/pin@2x.png';

const imageOffset = {
  left: 15,
  top: 31,
};

class CustomMarker extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onContextMenu: PropTypes.func.isRequired,
    onMouseOver: PropTypes.func.isRequired,
    onMouseOut: PropTypes.func.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    anchor: PropTypes.array.isRequired,
    payload: PropTypes.any.isRequired,
    hover: PropTypes.bool.isRequired,
    isMarked: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      hoverImg: false,
    };
  }

  componentDidMount() {
    const images = this.isRetina() ? [pinRetina, pinHoverRetina] : [pinMarked, pinHoverMarked];

    images.forEach(pinImg => {
      const img = new window.Image();
      img.src = pinImg;
    });
  }

  eventParameters = event => ({
    event,
    anchor: this.props.anchor,
    payload: this.props.payload,
  });

  isRetina = () => typeof window !== 'undefined' && window.devicePixelRatio >= 2;

  isHover = () => (typeof this.props.hover === 'boolean' ? this.props.hover : this.state.hoverImg);

  image = () =>
    this.props.isMarked
      ? this.isHover()
        ? pinHoverMarked
        : pinMarked
      : this.isHover()
      ? pinHoverRetina
      : pinRetina;



  handleClick = event => this.props.onClick && this.props.onClick(this.eventParameters(event));

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
        onContextMenu={this.handleContextMenu}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        <img src={this.image()} width={29} height={34} alt="" />
      </div>
    );
  }
}

export default CustomMarker;
