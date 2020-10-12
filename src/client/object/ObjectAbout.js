import React from 'react';
import PropTypes from 'prop-types';
import ObjectInfo from '../app/Sidebar/ObjectInfo';
import './ObjectAbout.less';
import PropositionContainer from '../rewards/Proposition/PropositionContainer';

const ObjectAbout = ({ isEditMode, wobject, userName, match, history }) => (
  <React.Fragment>
    <PropositionContainer wobject={wobject} match={match} history={history} userName={userName} />
    <div className="object-about">
      <ObjectInfo isEditMode={isEditMode} wobject={wobject} userName={userName} />
    </div>
  </React.Fragment>
);

ObjectAbout.propTypes = {
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool,
  match: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
};

ObjectAbout.defaultProps = {
  isEditMode: false,
  match: {},
};

export default ObjectAbout;
