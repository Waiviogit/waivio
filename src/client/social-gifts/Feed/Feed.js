import React from 'react';
import Masonry from 'react-masonry-css';

import './Feed.less';

const Feed = () => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      <div className="item" style={{ background: '#c01147' }}>
        text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book. It has survived not only five centuries, but also the leap into
        electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
        with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with
        desktop publishing software like Aldus PageMaker inclu
      </div>
      <div className="item" style={{ background: '#00f900' }}>
        My Element dfvdssfssf ssfgsfsd sdfsdgsdgdsg sfdgsdfsdf adsfdfsdf dsf ds fsd f sdf sd fds f
        ds f dsf d sf d sf d sf sd{' '}
      </div>
      <div className="item" style={{ background: '#0794f8' }}>
        text ever since the 1500s, when an unknown printer took a ga but also the leap into
        electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
        with the release of Letraset sheets containing Lorem Ipsum passages
      </div>
      <div className="item" style={{ background: '#00f900' }}>
        My Element dfvdssfssf ssfgsfsd sdfsdgsdgdsg sfdgsdfsdf adsfdfsdf dsf ds fsd f sdf sd fds f
        ds f dsf d sf d sf d sf sd{' '}
      </div>
      <div className="item" style={{ background: '#c01147' }}>
        text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book. It has survived not only five centuries, but also the leap into
        electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
        with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with
        desktop publishing software like Aldus PageMaker inclu
      </div>

      <div className="item" style={{ background: '#eaf500' }}>
        text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book. Aldus PageMaker inclu
      </div>
    </Masonry>
  );
};

export default Feed;
