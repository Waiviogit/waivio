import React from 'react';
import PropTypes from 'prop-types';
import video from '@react-page/plugins-video';
import ReactPlayer from 'react-player';

const customVideoPlugin = {
  ...video,
  Renderer: props => (
    <div
      style={{
        alignContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: '0px',
        paddingBottom: '65.25%',
      }}
    >
      {props.readOnly ? null : (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}
        />
      )}
      <ReactPlayer
        className="ObjectOfTypeWebpage__react-player"
        url={props.data ? props.data.src : undefined}
        height="100%"
        width="100%"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        blur={props.data ? props.data.blur : undefined}
        controls
        muted={false}
        playing={false}
        loop={props.data ? props.data.loop : undefined}
      />
    </div>
  ),
};

customVideoPlugin.Renderer.propTypes = {
  data: PropTypes.shape({
    src: PropTypes.string,
    blur: PropTypes.bool,
    muted: PropTypes.bool,
    loop: PropTypes.bool,
  }),
  readOnly: PropTypes.bool,
};

export default customVideoPlugin;
