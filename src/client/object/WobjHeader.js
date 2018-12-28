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

import { getFieldWithMaxWeight } from '../../client/object/wObjectHelper';
import { objectFields, descriptionFields } from '../../common/constants/listOfFields';

const WobjHeader = ({ wobject, coverImage, hasCover, isActive }) => {
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
              {getFieldWithMaxWeight(wobject, objectFields.name, objectFields.name)}
              <WeightTag weight={wobject.weight} />
            </h2>
            <div className="ObjectHeader__user__buttons">
              <div
                className={classNames('ObjectHeader__user__button', {
                  'ObjectHeader__user__button-follows-you': true,
                })}
              >
                <FollowButton following={wobject.author_permlink} followingType="wobject" />
                <Link
                  to={`/wobject/editor/@${wobject.author_permlink}`}
                  className="ObjectHeader__extend"
                >
                  <Action>
                    <FormattedMessage id="extend-object" defaultMessage="Extend" />
                  </Action>
                </Link>
              </div>
            </div>
          </div>
          <div className="ObjectHeader__user__username">
            <div className="ObjectHeader__descriptionShort">
              {getFieldWithMaxWeight(
                wobject,
                objectFields.description,
                descriptionFields.descriptionShort,
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

WobjHeader.propTypes = {
  coverImage: PropTypes.string,
  hasCover: PropTypes.bool,
  wobject: PropTypes.shape(),
  isActive: PropTypes.bool.isRequired,
};

WobjHeader.defaultProps = {
  username: '',
  userReputation: '0',
  vestingShares: 0,
  coverImage: '',
  hasCover: false,
  wobject: {},
  onTransferClick: () => {},
};

export default WobjHeader;
