import PropTypes from 'prop-types';
import React from 'react';

const ObjectLink = props => (
  <>
    <a
      contentEditable={false}
      className="object-link"
      href={props.url}
      rel="noopener noreferrer"
      aria-label={props.url}
      {...props.attributes}
    >
      {props.element.hashtag}
      {props.children}{' '}
    </a>
  </>
);

ObjectLink.propTypes = {
  children: PropTypes.node.isRequired,
  attributes: PropTypes.shape().isRequired,
  element: PropTypes.shape().isRequired,
  url: PropTypes.string.isRequired,
};

export default ObjectLink;
