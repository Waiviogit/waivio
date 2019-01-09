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
import { haveAccess, accessTypesArr } from '../helpers/wObjectHelper';
import { getFieldWithMaxWeight } from '../../client/object/wObjectHelper';
import { objectFields, descriptionFields } from '../../common/constants/listOfFields';
import Proposition from '../components/Proposition/Proposition';

const WobjHeader = ({ wobject, username }) => {
  const coverImage = getFieldWithMaxWeight(
    wobject,
    objectFields.backgroundImage,
    objectFields.backgroundImage,
  );
  const hasCover = !!coverImage;
  const style = hasCover
    ? { backgroundImage: `url("https://steemitimages.com/2048x512/${coverImage}")` }
    : {};
  const descriptionShort = getFieldWithMaxWeight(
    wobject,
    objectFields.description,
    descriptionFields.descriptionShort,
  );
  const accessExtend = haveAccess(wobject, username, accessTypesArr[0]);
  return (
    <div className={classNames('ObjectHeader', { 'ObjectHeader--cover': hasCover })} style={style}>
      <div className="ObjectHeader__container">
        <ObjectLightbox wobject={wobject} size={100} accessExtend={accessExtend} />
        <div className="ObjectHeader__user">
          <div className="ObjectHeader__row">
            <h2 className="ObjectHeader__user__username">
              {getFieldWithMaxWeight(wobject, objectFields.name, objectFields.name)}
              <WeightTag weight={wobject.weight} rank={wobject.rank} />
            </h2>
            <div className="ObjectHeader__user__buttons">
              <div
                className={classNames('ObjectHeader__user__button', {
                  'ObjectHeader__user__button-follows-you': true,
                })}
              >
                <FollowButton following={wobject.author_permlink} followingType="wobject" />
                {accessExtend && (
                  <Link
                    to={`/wobject/editor/@${wobject.author_permlink}/name`}
                    className="ObjectHeader__extend"
                  >
                    <Action>
                      <FormattedMessage id="extend-object" defaultMessage="Extend" />
                    </Action>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="ObjectHeader__user__username">
            <div className="ObjectHeader__descriptionShort">
              {descriptionShort ||
                (accessExtend && (
                  <Proposition objectID={wobject.author_permlink} fieldName="description" />
                ))}
            </div>
          </div>
          {!hasCover && accessExtend && (
            <div className="ObjectHeader__user__addCover">
              <Proposition objectID={wobject.author_permlink} fieldName="backgroundImage" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

WobjHeader.propTypes = {
  wobject: PropTypes.shape(),
  username: PropTypes.string,
};

WobjHeader.defaultProps = {
  username: '',
  userReputation: '0',
  vestingShares: 0,
  wobject: {},
  onTransferClick: () => {},
};

export default WobjHeader;
