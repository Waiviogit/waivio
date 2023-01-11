import React, { useEffect, useState } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { getNestedDepartmentFields } from '../../../waivioApi/ApiClient';
import { setActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsActions';
import { getActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsSelectors';

const DepartmentItem = ({ wobject, history, department, nestedExcludedDep }) => {
  const [nestedList, setNestedList] = useState([]);
  const [activeDep, setActiveDep] = useState('');
  const dispatch = useDispatch();
  const storeActiveDep = useSelector(getActiveDepartment);
  const [excludedDepartments, setExcludedDepartments] = useState(nestedExcludedDep);

  const getDepartmentsClassNames = element =>
    classNames({ Department__activeDepartment: element.name === storeActiveDep });

  const onNewActiveDep = dep => {
    history.push(`/object/${wobject.author_permlink}/departments/${dep.name}`);
    setActiveDep(dep.name);
    setExcludedDepartments([...excludedDepartments, dep.name]);
    dispatch(setActiveDepartment(dep.name));
  };
  const onDepartmentClick = dep => {
    if (dep.name === activeDep) {
      setActiveDep('');
      dispatch(setActiveDepartment(''));
      setExcludedDepartments(excludedDepartments.filter(d => d === dep));
    } else {
      onNewActiveDep(dep);

      getNestedDepartmentFields({
        name: dep.name,
        excluded: [...excludedDepartments, dep.name],
      }).then(res => {
        setNestedList(res);
      });
    }
  };

  useEffect(() => () => dispatch(setActiveDepartment('')), [wobject.author_permlink]);

  return (
    <div className="Department__container ">
      <div key={department.name}>
        <button className="Department__button" onClick={() => onDepartmentClick(department)}>
          <>
            <span className={getDepartmentsClassNames(department)}>{department.name}</span>
            {department.subdirectory &&
              (activeDep === department.name ? (
                <Icon type="up" style={{ fontSize: '12px' }} />
              ) : (
                <Icon type="down" style={{ fontSize: '12px' }} />
              ))}
          </>
        </button>
        {department.subdirectory &&
          activeDep === department.name &&
          nestedList.map(l => (
            <div key={l.name} className="Department__nested-button">
              <DepartmentItem
                nestedExcludedDep={excludedDepartments}
                department={l}
                wobject={wobject}
                history={history}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

DepartmentItem.propTypes = {
  wobject: PropTypes.shape().isRequired,
  department: PropTypes.arrayOf().isRequired,
  history: PropTypes.func.isRequired,
  nestedExcludedDep: PropTypes.arrayOf(),
};
DepartmentItem.defaultProps = {
  nestedExcludedDep: [],
};

export default DepartmentItem;
