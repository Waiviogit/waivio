import { filter, maxBy, includes } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import './ObjectAvatar.less';
import DEFAULTS from '../object/const/defaultValues';
import {
  addActiveVotesInField,
  calculateApprovePercent,
  getApprovedField,
} from '../helpers/wObjectHelper';

export const getObjectUrl = item => {
  const avatarFields = filter(item.fields, o => o.name === 'avatar');
  const avatarField = maxBy(avatarFields, 'weight');
  return avatarField ? avatarField.body : null;
};

const ObjectAvatar = ({ item, size }) => {
  let style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };
  const parent = item.parent && addActiveVotesInField(item, item.parent);
  const parentAvatar =
    parent &&
    calculateApprovePercent(parent.active_votes, parent.weight, parent) >= 70 &&
    getApprovedField(parent, 'avatar');
  let url = getApprovedField(item, 'avatar') || parentAvatar;

  if (includes(url, 'waivio.')) url = `${url}${size < 41 ? '_small' : '_medium'}`;

  if (url) {
    style = {
      ...style,
      backgroundImage: `url(${url})`,
    };
  } else {
    style = {
      ...style,
      backgroundImage: `url(${DEFAULTS.AVATAR})`,
    };
  }

  return <div className="ObjectAvatar" style={style} />;
};

ObjectAvatar.propTypes = {
  item: PropTypes.shape({ parent: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]) }),
  size: PropTypes.number,
};

ObjectAvatar.defaultProps = {
  size: 100,
  item: {},
};

export default ObjectAvatar;
