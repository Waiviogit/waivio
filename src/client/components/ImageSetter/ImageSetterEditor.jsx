import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { FormattedMessage } from 'react-intl';
import { Slider } from 'antd';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';

const ImageSetterEditor = ({
  isOpen,
  setIsOpen,
  handleChangeImage,
  state,
  setState,
  initialState,
}) => {
  const [editorEl, setEditorEl] = useState('');
  const handlePositionChange = position => {
    setState({ ...state, position });
  };

  const handleScale = scale => {
    setState({ ...state, scale });
  };

  const rotateLeft = e => {
    e.preventDefault();
    setState({ ...state, rotate: state.rotate - 90 });
  };
  const rotateRight = e => {
    e.preventDefault();
    setState({ ...state, rotate: state.rotate + 90 });
  };

  const handleSave = async () => {
    const dataUrl = editorEl.getImage().toDataURL();
    const result = await fetch(dataUrl);
    const blob = await result.blob();

    const res = new File([blob], 'filename', { type: 'image/png' });

    handleChangeImage({ target: { files: [res] } });
    setIsOpen(false);
  };
  const resetImage = () => {
    setState(initialState);
    setIsOpen(false);
  };

  return (
    isOpen && (
      <div className="ImageSetter__edit">
        <div className="image-box__preview">
          <div className="image-box__remove" onClick={() => resetImage()} role="presentation">
            <i className="iconfont icon-delete_fill Image-box__remove-icon" />
          </div>
          <AvatarEditor
            ref={ed => setEditorEl(ed)}
            scale={parseFloat(state.scale)}
            width={state.width}
            height={state.height}
            position={state.position}
            onPositionChange={handlePositionChange}
            rotate={parseFloat(state.rotate)}
            borderRadius={state.width / (100 / state.borderRadius)}
            image={state.image}
          />
        </div>
        <div className="ImageSetter__zoom">
          <div>
            <FormattedMessage id="zoom" defaultMessage="Zoom" />:
          </div>
          <Slider
            tipFormatter={null}
            defaultValue={1}
            min={state.allowZoomOut ? 0.1 : 1}
            max={3}
            step={0.01}
            onChange={handleScale}
          />
        </div>
        <div className="ImageSetter__rotate">
          <FormattedMessage id="rotate" defaultMessage="Rotate" />:
          <div className="ImageSetter__rotate-btns">
            <button className="ImageSetter__rotate__button" onClick={rotateLeft}>
              <FormattedMessage id="left" defaultMessage="Left" />
            </button>
            <button className="ImageSetter__rotate__button" onClick={rotateRight}>
              <FormattedMessage id="right" defaultMessage="Right" />
            </button>
          </div>
        </div>
        <button onClick={handleSave} type="button" className="ImageSetter__save-btn">
          <FormattedMessage id="save" defaultMessage="Save" />
        </button>
      </div>
    )
  );
};

ImageSetterEditor.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  handleChangeImage: PropTypes.func,
  state: PropTypes.shape(),
  initialState: PropTypes.shape(),
  setState: PropTypes.func,
};
export default ImageSetterEditor;
