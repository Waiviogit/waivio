import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import './Department.less';
import { getActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsSelectors';
import { setActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsActions';

const Department = ({ wobject, departments, isEditMode, history }) => {
  const activeDepartment = useSelector(getActiveDepartment);
  const dispatch = useDispatch();
  const getDepartmentsClassNames = element =>
    classNames({ Department__activeDepartment: element.body === activeDepartment });

  const onDepartmentClick = department => {
    history.push(`/object/${wobject.author_permlink}/departments/${department.body}`);
    dispatch(setActiveDepartment(department.body));
  };

  const departmentsList = departments
    .map(d => (
      <div key={d.body}>
        <button className="CompanyId__button" onClick={() => onDepartmentClick(d)}>
          <span className={getDepartmentsClassNames(d)}>{d.body}</span>
        </button>
      </div>
    ))
    .slice(0, 7);

  return (
    <div className="flex-column">
      {!isEditMode && (
        <>
          <FormattedMessage id="departments" formattedMessage="Departments" />:{' '}
        </>
      )}
      <div className="Department__container ">{departmentsList}</div>
    </div>
  );
};

Department.propTypes = {
  wobject: PropTypes.shape().isRequired,
  departments: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default Department;
