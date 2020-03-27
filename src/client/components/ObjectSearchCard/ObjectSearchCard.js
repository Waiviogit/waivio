import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getFieldWithMaxWeight } from '../../object/wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import ObjectAvatar from '../ObjectAvatar';
import './ObjectSearchCard.less';

const ObjectSearchCard = props => {
  const { object, name, type, parentElement } = props;
  const parentString = getFieldWithMaxWeight(object.parent, objectFields.name);
  const titleString = getFieldWithMaxWeight(object, objectFields.title);
  const description = getFieldWithMaxWeight(object, objectFields.description);
  return (
    <div className="object-search-card">
      {_.has(object, 'avatar') ? (
        <img
          className="object-search-card__content-avatar"
          src={object.avatar}
          alt={object.title || ''}
        />
      ) : (
        <ObjectAvatar item={object} size={40} />
      )}
      <div className="object-search-card__content-info">
        <div className="object-search-card__content-name">{name}</div>
        <div className={`object-search-card__content-text${parentElement ? '-nav' : ''}`}>
          {parentString || titleString || description || ''}
        </div>
      </div>
      <div className="object-search-card__content-type">{type}</div>
    </div>
  );
};

ObjectSearchCard.propTypes = {
  object: PropTypes.shape(),
  name: PropTypes.string,
  type: PropTypes.string,
  parentElement: PropTypes.string,
};

ObjectSearchCard.defaultProps = {
  object: {},
  name: '',
  type: '',
  parentElement: '',
};

export default ObjectSearchCard;
