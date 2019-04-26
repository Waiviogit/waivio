import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { Entity } from '../../util/constants';
import { getAppUrl, getExitPageSetting } from '../../../../reducers';
import { parseLink } from '../../../../vendor/SanitizeConfig';

export const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === Entity.LINK;
  }, callback);
};

const Link = props => {
  const { contentState, entityKey, appUrl, exitPageSettings } = props;
  const { url } = contentState.getEntity(entityKey).getData();
  const parsed = parseLink(appUrl, exitPageSettings)('a', { href: url });
  return (
    <a className="md-link" {...parsed.attribs} rel="noopener noreferrer" aria-label={url}>
      {props.children}
    </a>
  );
};

Link.propTypes = {
  contentState: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired,
  entityKey: PropTypes.string.isRequired,
  appUrl: PropTypes.string.isRequired,
  exitPageSettings: PropTypes.bool,
};

Link.defaultProps = {
  exitPageSettings: true,
};

export default connect(state => ({
  appUrl: getAppUrl(state),
  exitPageSetting: getExitPageSetting(state),
}))(Link);
