import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import DepartmentList from './DepartmentList';
import './Department.less';

const Department = ({ wobject, departments, isEditMode }) => (
  <div className={isEditMode ? 'flex-column' : 'flex-column paddingBottom'}>
    {!isEditMode && !isEmpty(departments) && (
      <div className="CompanyId__title">
        <FormattedMessage id="departments" formattedMessage="Departments" />:{' '}
      </div>
    )}
    <DepartmentList wobject={wobject} departments={wobject?.departments} />
  </div>
);

Department.propTypes = {
  wobject: PropTypes.shape().isRequired,
  departments: PropTypes.arrayOf().isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default Department;
