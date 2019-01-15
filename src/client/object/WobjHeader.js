import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import ObjectLightbox from '../components/ObjectLightbox';
import FollowButton from '../widgets/FollowButton';
import '../components/ObjectHeader.less';
import { haveAccess, accessTypesArr } from '../helpers/wObjectHelper';
import { getFieldWithMaxWeight } from '../../client/object/wObjectHelper';
import { objectFields } from '../../common/constants/listOfFields';
import Proposition from '../components/Proposition/Proposition';
import ObjectType from './ObjectType';
import ObjectRank from './ObjectRank';

const WobjHeader = ({ wobject, username }) => {
  const coverImage = getFieldWithMaxWeight(
    wobject,
    objectFields.background,
    objectFields.background,
  );
  const hasCover = !!coverImage;
  const style = hasCover
    ? { backgroundImage: `url("https://steemitimages.com/2048x512/${coverImage}")` }
    : {};
  const descriptionShort = getFieldWithMaxWeight(wobject, objectFields.title);
  const accessExtend = haveAccess(wobject, username, accessTypesArr[0]);
  const objectName = getFieldWithMaxWeight(wobject, objectFields.name, objectFields.name);
  return (
    <div className={classNames('ObjectHeader', { 'ObjectHeader--cover': hasCover })} style={style}>
      <div className="ObjectHeader__container">
        <ObjectLightbox wobject={wobject} size={100} accessExtend={accessExtend} />
        <div className="ObjectHeader__user">
          <div className="ObjectHeader__row">
            <div className="ObjectHeader__user__username">
              <div className="ObjectHeader__text" title={objectName}>
                {objectName}
              </div>
              <FollowButton following={wobject.author_permlink} followingType="wobject" />
            </div>
          </div>
          <div className="ObjectHeader__info">
            <div className="ObjectHeader__type">
              <ObjectType type={wobject.object_type} />
            </div>
            <div className="ObjectHeader__rank">
              <ObjectRank rank={wobject.rank} />
            </div>
          </div>
          <div className="ObjectHeader__user__username">
            <div className="ObjectHeader__descriptionShort">
              {descriptionShort ||
                (accessExtend && (
                  <Proposition
                    defaultName={wobject.default_name}
                    objectID={wobject.author_permlink}
                    fieldName={objectFields.title}
                  />
                ))}
            </div>
          </div>
          {!hasCover && accessExtend && (
            <div className="ObjectHeader__user__addCover">
              <Proposition
                objectID={wobject.author_permlink}
                fieldName={objectFields.background}
                defaultName={wobject.default_name}
              />
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

export default injectIntl(WobjHeader);
