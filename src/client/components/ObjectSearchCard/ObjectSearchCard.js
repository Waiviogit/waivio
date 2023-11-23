import React from 'react';
import { get, has } from 'lodash';
import PropTypes from 'prop-types';
import { objectFields } from '../../../common/constants/listOfFields';
import ObjectAvatar from '../ObjectAvatar';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { getProxyImageURL } from '../../../common/helpers/image';

import './ObjectSearchCard.less';

const ObjectSearchCard = props => {
  const { object, type, parentElement, isNeedType, isInList } = props;
  const parent = get(object, objectFields.parent);
  const parentString = getObjectName(parent);
  const titleSrting = get(object, objectFields.title, '');
  const description = get(object, objectFields.description, '');
  let avatar = get(object, ['avatar']) || get(parent, 'avatar');

  if (avatar) avatar = getProxyImageURL(avatar, 'preview');

  return (
    <div className="object-search-card">
      {has(object, 'avatar') ? (
        <img
          className={`object-search-card__content-avatar ${isInList ? 'disabled-avatar' : ''}`}
          src={avatar}
          alt={titleSrting}
        />
      ) : (
        <ObjectAvatar item={object} size={40} />
      )}
      <div className="object-search-card__content-info">
        <div className="object-search-card__content-name">{getObjectName(object)}</div>
        <div
          className={`object-search-card__content-text${parentElement ? '-nav' : ''} ${
            isInList ? 'disabled-text' : ''
          }`}
        >
          {parentString || titleSrting || description || ''}
        </div>
      </div>

      {isInList ? (
        <div className={`object-search-card__content-text--red`}>already added</div>
      ) : (
        !isNeedType && <div className="object-search-card__content-type">{type}</div>
      )}
    </div>
  );
};

ObjectSearchCard.propTypes = {
  object: PropTypes.shape(),
  type: PropTypes.string,
  parentElement: PropTypes.string,
  isNeedType: PropTypes.bool,
  isInList: PropTypes.bool,
};

ObjectSearchCard.defaultProps = {
  object: {},
  name: '',
  type: '',
  parentElement: '',
  isNeedType: false,
};

export default ObjectSearchCard;
