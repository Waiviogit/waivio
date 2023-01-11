import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { getNestedDepartmentFields } from '../../../waivioApi/ApiClient';
import DepartmentItem from './DepartmentItem';
import { getActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsSelectors';

const DepartmentList = ({ wobject, history, departments }) => {
  const [dList, setDList] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [isShowNoreVisible, setIsShowNoreVisible] = useState(true);
  const departmentsArray = departments?.map(d => d.body);
  const storeActiveDepartment = useSelector(getActiveDepartment);

  useEffect(() => {
    getNestedDepartmentFields({ names: departmentsArray }).then(res => setDList(res));
  }, []);

  useEffect(() => {
    if (isEmpty(storeActiveDepartment)) {
      history.push(`/object/${wobject.author_permlink}`);
    }
  }, [storeActiveDepartment]);

  const onShowMoreClick = () => {
    setShowMore(true);
    setIsShowNoreVisible(false);
  };

  const departmentsList = showMore ? dList : dList.slice(0, 2);

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
      {dList.length > 2 && isShowNoreVisible && (
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
  history: PropTypes.shape().isRequired,
};

export default DepartmentList;
