import PropTypes from 'prop-types';
import React from 'react';

import { Entity } from '../../util/constants';

export const findObjEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === Entity.OBJECT;
  }, callback);
};

const ObjectLink = props => (
  <a className="object-link" href="http://waiviodev.com" rel="noopener noreferrer" target="_blank">
    {props.children}
  </a>
);

ObjectLink.propTypes = {
  // contentState: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired,
  // entityKey: PropTypes.string.isRequired,
};

export default ObjectLink;
