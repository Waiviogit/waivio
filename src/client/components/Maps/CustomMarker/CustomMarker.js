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


  const handleClick = (event) => onClick && onClick(eventParameters(event));

  const handleContextMenu = (event) => onContextMenu && onContextMenu(eventParameters(event));

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
  onContextMenu: PropTypes.func,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
  left: PropTypes.number,
  top: PropTypes.number,
  anchor: PropTypes.array.isRequired,
  payload: PropTypes.any.isRequired,
  hover: PropTypes.bool,
  isMarked: PropTypes.bool.isRequired,
};

export default CustomMarker;
