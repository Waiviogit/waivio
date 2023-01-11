import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router';
import { getNestedDepartmentFields } from '../../../waivioApi/ApiClient';
import DepartmentItem from './DepartmentItem';
import { getActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsSelectors';

const DepartmentList = ({ wobject, departments }) => {
  const history = useHistory();
  const [dList, setDList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const departmentsArray = departments?.map(d => d.body);
  const storeActiveDepartment = useSelector(getActiveDepartment);

  useEffect(() => {
    getNestedDepartmentFields({ names: departmentsArray }).then(res => {
      setDList(res);
      if (res.length > 2) {
        setHasMore(true);
      }
    });
  }, []);

  useEffect(() => {
    if (isEmpty(storeActiveDepartment)) {
      history.push(`/object/${wobject.author_permlink}`);
    }
  }, [storeActiveDepartment]);

  const onShowMoreClick = () => {
    setHasMore(false);
  };

  const departmentsList = hasMore ? dList.slice(0, 2) : dList;

  return (
    <>
      {departmentsList.map(dep => (
        <DepartmentItem
          id={dep.name}
          key={dep.name}
          history={history}
          wobject={wobject}
          department={dep}
        />
      ))}
      {hasMore && (
        <button onClick={onShowMoreClick} className="WalletTable__csv-button">
          Show more
        </button>
      )}
    </>
  );
};

DepartmentList.propTypes = {
  wobject: PropTypes.shape().isRequired,
  departments: PropTypes.arrayOf().isRequired,
};

export default DepartmentList;
