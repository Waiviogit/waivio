import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsActions';
import { getActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsSelectors';

const DepartmentItem = ({ wobject, history, department, id }) => {
  const dispatch = useDispatch();
  const storeActiveDep = useSelector(getActiveDepartment);

  const getDepartmentsClassNames = element =>
    classNames('Department__item', {
      Department__activeDepartment:
        element.body === storeActiveDep.name && storeActiveDep.id === id,
    });

  const onNewActiveDep = dep => {
    history.push(`/object/${wobject.author_permlink}/departments/${dep.body}`);

    dispatch(setActiveDepartment({ name: dep.body, id }));
  };
  const onDepartmentClick = dep => {
    if (dep.body === storeActiveDep.name) {
      history.push(`/object/${wobject.author_permlink}`);
      dispatch(setActiveDepartment({}));
    } else {
      onNewActiveDep(dep);
    }
  };

  useEffect(() => () => dispatch(setActiveDepartment({})), [wobject.author_permlink]);

  return (
    <div className="Department__container ">
      <div key={department.body}>
        <button className="Department__button" onClick={() => onDepartmentClick(department)}>
          <span className={getDepartmentsClassNames(department)}>{department.body}</span>{' '}
        </button>
      </div>
    </div>
  );
};

DepartmentItem.propTypes = {
  wobject: PropTypes.shape().isRequired,
  department: PropTypes.arrayOf().isRequired,
  history: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default DepartmentItem;
