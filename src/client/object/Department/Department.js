import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import DepartmentList from './DepartmentList';
import './Department.less';

const Department = ({ wobject, departments, isEditMode, isSocialGifts, isRecipe }) => (
  <div
    className={classNames(isSocialGifts ? 'Department__socialLayout' : 'flex-column', {
      paddingBottom: isSocialGifts,
    })}
  >
    {!isEditMode && !isEmpty(departments) && (
      <div className="Department__title">
        <FormattedMessage
          id={isRecipe ? 'categories' : 'departments'}
          defaultMessage={isRecipe ? 'Categories' : 'Departments'}
        />
        :{' '}
      </div>
    )}
    <div className={isSocialGifts ? 'Department__wrapper' : ''}>
      <DepartmentList
        isSocialGifts={isSocialGifts}
        wobject={wobject}
        departments={wobject?.departments}
      />
    </div>
  </div>
);

Department.propTypes = {
  wobject: PropTypes.shape().isRequired,
  departments: PropTypes.arrayOf().isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isSocialGifts: PropTypes.bool,
  isRecipe: PropTypes.bool,
};

export default Department;
