import React from 'react';
import { get, truncate } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Avatar from '../../../Avatar';
import { jsonParse } from '../../../../helpers/formatter';
import { getObjectAvatar } from '../../../../helpers/wObjectHelper';
import USDDisplay from '../../../Utils/USDDisplay';
import { calculatePayout, isPostCashout } from '../../../../vendor/steemitHelpers';

import './PostOverlayCard.less';

const PostOverlayCard = ({ wObject }) => {
  const userName = get(wObject, 'post.author');
  const postPermlink = get(wObject, 'post.permlink');
  const postMetaData = jsonParse(get(wObject, 'post.json_metadata'));
  const img =
    get(postMetaData, 'image[0]') ||
    getObjectAvatar(wObject) ||
    'https://waivio.nyc3.digitaloceanspaces.com/1586860195_f1e17c2d-5138-4462-9a6d-5468276e208e_medium';
  const title = get(wObject, 'post.title', '');
  const payout = calculatePayout(wObject.post);
  const currentPayout = isPostCashout(wObject.post) ? payout.pastPayouts : payout.potentialPayout;

  return (
    <div className="PostOverlayCard" key={wObject.author_permlink}>
      <a href={`/@${userName}/${postPermlink}`} className="PostOverlayCard__title" title={title}>
        {truncate(title, {
          length: 55,
          separator: '...',
        })}
      </a>
      <a href={`/@${userName}/${postPermlink}`}>
        <img className="PostOverlayCard__image" src={img} alt={title} />
      </a>
      <div className="PostOverlayCard__userCard">
        <a href={`/@${userName}`} className="PostOverlayCard__userInfo">
          <Avatar username={userName} size={25} />{' '}
          <b className="PostOverlayCard__userName" title={userName}>
            {userName}
          </b>
        </a>
        <USDDisplay
          value={currentPayout}
          currencyDisplay={'symbol'}
          style={{ fontSize: '12px', fontWeight: 'bold', color: '#f87006' }}
        />
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
