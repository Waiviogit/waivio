import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import WeightTag from '../components/WeightTag';
import ObjectLightbox from '../components/ObjectLightbox';
import FollowButton from '../widgets/FollowButton';
import Action from '../components/Button/Action';
import '../components/ObjectHeader.less';

import { getField } from '../objects/WaivioObject';

const WobjHeader = ({ username, wobject, handle, coverImage, hasCover, isActive }) => {
  const style = hasCover
    ? { backgroundImage: `url("https://steemitimages.com/2048x512/${coverImage}")` }
    : {};
  return (
    <div className={classNames('ObjectHeader', { 'ObjectHeader--cover': hasCover })} style={style}>
      <div className="ObjectHeader__container">
        <ObjectLightbox username={wobject} size={100} isActive={isActive} />
        <div className="ObjectHeader__user">
          <div className="ObjectHeader__row">
            <h2 className="ObjectHeader__user__username">
              {username}
              <WeightTag weight={wobject.weight} />
            </h2>
            <div className="ObjectHeader__user__buttons">
              <div
                className={classNames('ObjectHeader__user__button', {
                  'ObjectHeader__user__button-follows-you': true,
                })}
              >
                <FollowButton username={handle} />
                <Link to={`/wobject/editor/@${wobject.tag}`} className="ObjectHeader__extend">
                  <Action>
                    <FormattedMessage id="extend-object" defaultMessage="Extend" />
                  </Action>
                </Link>
              </div>
            </div>
          </div>
          <div className="ObjectHeader__handle-rank-container">
            <div className="ObjectHeader__row ObjectHeader__handle">@{wobject.tag}</div>
          </div>
          <div className="ObjectHeader__user__username">
            <div className="ObjectHeader__descriptionShort">
              {getField(wobject, 'descriptionShort')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

WobjHeader.propTypes = {
  username: PropTypes.string,
  handle: PropTypes.string,
  coverImage: PropTypes.string,
  hasCover: PropTypes.bool,
  wobject: PropTypes.shape(),
  isActive: PropTypes.bool.isRequired,
};

WobjHeader.defaultProps = {
  username: '',
  handle: '',
  userReputation: '0',
  vestingShares: 0,
  coverImage: '',
  hasCover: false,
  wobject: {},
  onTransferClick: () => {},
};

export default WobjHeader;
