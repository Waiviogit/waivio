import PropTypes from 'prop-types';
import React from 'react';

import { Entity } from '../../util/constants';

export const findObjEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === Entity.OBJECT;
  }, callback);
};

const ObjectLink = props => {
  const obj = props.contentState.getEntity(props.entityKey).getData();
  const url = `${document.location.origin}/object/${obj.id}`;
  return (
    <a
      className="object-link"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={url}
    >
      {props.children}
    </a>
  );
};

ObjectLink.propTypes = {
  contentState: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default ObjectLink;
