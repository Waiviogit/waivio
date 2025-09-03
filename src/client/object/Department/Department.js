import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DepartmentList from './DepartmentList';
import './Department.less';

const Department = ({ wobject, isEditMode, isSocialGifts, isRecipe }) => (
  <span
    className={classNames(isSocialGifts ? 'Department__socialLayout' : 'flex-column', {
      paddingBottom: isSocialGifts,
    })}
  >
    <span className={isSocialGifts ? 'Department__wrapper' : ''}>
      <DepartmentList
        isSocialGifts={isSocialGifts}
        wobject={wobject}
        departments={wobject?.departments}
        isRecipe={isRecipe}
        isEditMode={isEditMode}
      />
    </span>
  </span>
);

Department.propTypes = {
  wobject: PropTypes.shape().isRequired,
  departments: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isSocialGifts: PropTypes.bool,
  isRecipe: PropTypes.bool,
};

export default Department;
