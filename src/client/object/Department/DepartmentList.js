import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { getNestedDepartmentFields } from '../../../waivioApi/ApiClient';
import DepartmentItem from './DepartmentItem';

const DepartmentList = ({ wobject, departments }) => {
  const history = useHistory();
  const [dList, setDList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const departmentsArray = departments?.map(d => d.body);

  useEffect(() => {
    getNestedDepartmentFields({ names: departmentsArray }).then(res => {
      setDList(res);
      if (res.length > 2) {
        setHasMore(true);
      }
    });
  }, []);

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
