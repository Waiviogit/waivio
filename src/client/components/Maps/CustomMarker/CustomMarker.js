import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import pinMarked from '../../../../../public/images/icons/pin-mark@2x.png';
import pinHoverMarked from '../../../../../public/images/icons/pin-hover-mark@2x.png';
import pinHoverRetina from '../../../../../public/images/icons/pin-hover@2x.png';
import pinRetina from '../../../../../public/images/icons/pin@2x.png';

const imageOffset = {
  left: 15,
  top: 31,
};

const CustomMarker = ({ payload, anchor, onMouseOut, onMouseOver, onClick, onContextMenu, left, top, hover, isMarked }) => {
  const [hoverImg, setHoverImg] = useState(false);
  const eventParameters = (event) => ({
    event,
    anchor,
    payload
  });

  // controls
  const isRetina = () => typeof window !== 'undefined' && window.devicePixelRatio >= 2;

  // modifiers
  const isHover = () => typeof hover === 'boolean' ? hover : hoverImg;

  const image = () => isMarked ? (isHover() ? pinHoverMarked : pinMarked) : (isHover() ? pinHoverRetina : pinRetina);

  // lifecycle

  useEffect(() => {
    const images = isRetina() ? [
      pinRetina, pinHoverRetina
    ] : [
      pinMarked, pinHoverMarked
    ];

    images.forEach(pinImg => {
      const img = new window.Image()
      img.src = pinImg
    })
  }, []);


  const handleClick = (event) => {
    onClick && onClick(eventParameters(event))
  };

  const handleContextMenu = (event) => {
    onContextMenu && onContextMenu(eventParameters(event))
  };

  const handleMouseOver = (event) => {
    onMouseOver && onMouseOver(eventParameters(event));
    setHoverImg(true);
  };

  const handleMouseOut = (event) => {
    onMouseOut && onMouseOut(eventParameters(event));
    setHoverImg(false);
  };

  const style = {
    position: 'absolute',
    transform: `translate(${left - imageOffset.left}px, ${top - imageOffset.top}px)`,
    cursor: onClick ? 'pointer' : 'default'
  };

  return (
    <div style={style}
         className='pigeon-click-block'
         onClick={handleClick}
         onContextMenu={handleContextMenu}
         onMouseOver={handleMouseOver}
         onMouseOut={handleMouseOut}>
      <img src={image()} width={29} height={34} alt='' />
    </div>
  )

};

CustomMarker.propTypes = {
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  anchor: PropTypes.array,
  payload: PropTypes.any,
  hover: PropTypes.bool.isRequired,
  isMarked: PropTypes.bool.isRequired,
};

export default CustomMarker;

// export default class Marker extends Component {
//   static propTypes = process.env.BABEL_ENV === 'inferno' ? {} : {
//     // input, passed to events
//     anchor: PropTypes.array.isRequired,
//     payload: PropTypes.any,
//
//     // optional modifiers
//     hover: PropTypes.bool,
//
//     // callbacks
//     onClick: PropTypes.func,
//     onContextMenu: PropTypes.func,
//     onMouseOver: PropTypes.func,
//     onMouseOut: PropTypes.func,
//
//     // pigeon variables
//     left: PropTypes.number,
//     top: PropTypes.number,
//
//     // pigeon functions
//     latLngToPixel: PropTypes.func,
//     pixelToLatLng: PropTypes.func
//   }
//
//   constructor (props) {
//     super(props)
//
//     this.state = {
//       hover: false
//     }
//   }
//
//   // what do you expect to get back with the event
//   eventParameters = (event) => ({
//     event,
//     anchor: this.props.anchor,
//     payload: this.props.payload
//   })
//
//   // controls
//   isRetina () {
//     return typeof window !== 'undefined' && window.devicePixelRatio >= 2
//   }
//
//   // modifiers
//   isHover () {
//     return typeof this.props.hover === 'boolean' ? this.props.hover : this.state.hover
//   }
//
//   image () {
//     return this.isRetina() ? (this.isHover() ? pinHoverRetina : pinRetina) : (this.isHover() ? pinHover : pin)
//   }
//
//   // lifecycle
//
//   componentDidMount () {
//     let images = this.isRetina() ? [
//       pinRetina, pinHoverRetina
//     ] : [
//       pin, pinHover
//     ]
//
//     images.forEach(image => {
//       let img = new window.Image()
//       img.src = image
//     })
//   }
//
//   // delegators
//
//   handleClick = (event) => {
//     this.props.onClick && this.props.onClick(this.eventParameters(event))
//   }
//
//   handleContextMenu = (event) => {
//     this.props.onContextMenu && this.props.onContextMenu(this.eventParameters(event))
//   }
//
//   handleMouseOver = (event) => {
//     this.props.onMouseOver && this.props.onMouseOver(this.eventParameters(event))
//     this.setState({ hover: true })
//   }
//
//   handleMouseOut = (event) => {
//     this.props.onMouseOut && this.props.onMouseOut(this.eventParameters(event))
//     this.setState({ hover: false })
//   }
//
//   // render
//
//   render () {
//     const { left, top, onClick } = this.props
//
//     const style = {
//       position: 'absolute',
//       transform: `translate(${left - imageOffset.left}px, ${top - imageOffset.top}px)`,
//       cursor: onClick ? 'pointer' : 'default'
//     }
//
//     return (
//       <div style={style}
//            className='pigeon-click-block'
//            onClick={this.handleClick}
//            onContextMenu={this.handleContextMenu}
//            onMouseOver={this.handleMouseOver}
//            onMouseOut={this.handleMouseOut}>
//         <img src={this.image()} width={29} height={34} alt='' />
//       </div>
//     )
//   }
// }
