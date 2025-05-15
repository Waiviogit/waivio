import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsActions';
import { getActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsSelectors';

const DepartmentItem = ({ wobject, department, id, isSocialGifts }) => {
  const linkToSearch = dep =>
    isSocialGifts
      ? `/discover-departments/${wobject.author_permlink}/${dep.body}${
          wobject.object_type === 'recipe' ? '?isRecipe=true' : ''
        }`
      : `/object/${wobject.author_permlink}/departments/${dep.body}`;
  const dispatch = useDispatch();
  const storeActiveDep = useSelector(getActiveDepartment);

  const getDepartmentsClassNames = element =>
    classNames('Department__item', {
      Department__activeDepartment:
        element.body === storeActiveDep.name && storeActiveDep.id === id,
    });

  const onDepartmentClick = dep => {
    if (dep.body === storeActiveDep.name) {
      dispatch(setActiveDepartment({}));
    } else {
      dispatch(setActiveDepartment({ name: dep.body, id }));
    }
  };
  const getDepartmentHref = dep =>
    dep.body === storeActiveDep.name ? `/object/${wobject.author_permlink}` : linkToSearch(dep);

  useEffect(() => () => dispatch(setActiveDepartment({})), [wobject.author_permlink]);

  return (
    <span className="Department__container">
      <span className="Department__block" key={department.body}>
        <Link
          className="Department__button"
          to={getDepartmentHref(department)}
          onClick={() => onDepartmentClick(department)}
        >
          {isSocialGifts ? (
            <span className={getDepartmentsClassNames(department)}>{department.body}</span>
          ) : (
            <div className={getDepartmentsClassNames(department)}>{department.body}</div>
          )}
        </Link>
      </span>
    </span>
  );
};

DepartmentItem.propTypes = {
  wobject: PropTypes.shape().isRequired,
  department: PropTypes.arrayOf().isRequired,
  id: PropTypes.string.isRequired,
  isSocialGifts: PropTypes.bool,
};

export default DepartmentItem;
