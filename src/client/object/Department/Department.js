import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import DepartmentList from './DepartmentList';
import './Department.less';

const Department = ({ wobject, departments, isEditMode, history }) => (
  <div className="flex-column">
    {!isEditMode && !isEmpty(departments) && (
      <>
        <FormattedMessage id="departments" formattedMessage="Departments" />:{' '}
      </>
    )}
    <DepartmentList history={history} wobject={wobject} departments={wobject?.departments} />
  </div>
);

Department.propTypes = {
  wobject: PropTypes.shape().isRequired,
  departments: PropTypes.arrayOf().isRequired,
  history: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default Department;
