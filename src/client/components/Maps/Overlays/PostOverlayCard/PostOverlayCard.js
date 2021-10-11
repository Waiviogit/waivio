import React from 'react';
import { get, truncate } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Avatar from '../../../Avatar';
import { jsonParse } from '../../../../helpers/formatter';
import { getObjectAvatar } from '../../../../helpers/wObjectHelper';

import './PostOverlayCard.less';

const PostOverlayCard = ({ wObject }) => {
  const userName = get(wObject, 'post.author');
  const postMetaData = jsonParse(get(wObject, 'post.json_metadata'));
  const img = get(postMetaData, 'image[0]') || getObjectAvatar(wObject);
  const title = get(wObject, 'post.title', '');

  return (
    <div className="PostOverlayCard" key={wObject.author_permlink}>
      <div className="PostOverlayCard__title" title={title}>
        {truncate(title, {
          length: 50,
          separator: '...',
        })}
      </div>
      <img className="PostOverlayCard__image" src={img} alt={title} />
      <div className="PostOverlayCard__userInfo">
        <Avatar username={userName} size={25} />{' '}
        <b className="PostOverlayCard__userName" title={userName}>
          {userName}
        </b>
      </div>
    </div>
  );
};

PostOverlayCard.propTypes = {
  wObject: PropTypes.shape(),
};

PostOverlayCard.defaultProps = {
  wObject: {},
};
export default injectIntl(PostOverlayCard);
