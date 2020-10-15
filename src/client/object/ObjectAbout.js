import React from 'react';
import PropTypes from 'prop-types';
import ObjectInfo from '../app/Sidebar/ObjectInfo';
import PropositionContainer from '../rewards/Proposition/PropositionList/PropositionListContainer';
import './ObjectAbout.less';

const ObjectAbout = ({ isEditMode, wobject, userName }) => (
  <React.Fragment>
    <PropositionContainer wobject={wobject} userName={userName} />
    <div className="object-about">
      <ObjectInfo isEditMode={isEditMode} wobject={wobject} userName={userName} />
    </div>
  </React.Fragment>
);

ObjectAbout.propTypes = {
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool,
};

ObjectAbout.defaultProps = {
  isEditMode: false,
};

export default ObjectAbout;
