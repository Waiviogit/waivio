import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';
import DepartmentItem from './DepartmentItem';

const DepartmentList = ({ wobject, departments, isSocialGifts, isEditMode, isRecipe }) => {
  const history = useHistory();
  const [hasMore, setHasMore] = useState(false);
  const onShowMoreClick = () => setHasMore(false);
  const departmentsList = hasMore ? departments?.slice(0, 2) : departments;

  useEffect(() => {
    if (departments?.length > 2) {
      setHasMore(true);
    }
  }, [departments.length]);

  return (
    <span>
      {!isEditMode && !isEmpty(departments) && (
        <span className="Department__title">
          <FormattedMessage
            id={isRecipe ? 'categories' : 'departments'}
            defaultMessage={isRecipe ? 'Categories' : 'Departments'}
          />
          :{' '}
        </span>
      )}
      {departmentsList?.map((dep, i) => (
        <React.Fragment key={`department-${dep.body}`}>
          <DepartmentItem
            isSocialGifts={isSocialGifts}
            id={dep.body}
            history={history}
            wobject={wobject}
            department={dep}
          />
          {isSocialGifts && i !== departmentsList.length - 1 && ', '}{' '}
        </React.Fragment>
      ))}
      {hasMore && (
        <button onClick={onShowMoreClick} className="main-color-button">
          {isSocialGifts ? (
            <span className="ml2">
              <FormattedMessage id="show_all" defaultMessage="Show all" />
              {` (${departments.length})`}
            </span>
          ) : (
            <FormattedMessage id="show_more" defaultMessage="Show more" />
          )}
        </button>
      )}
    </span>
  );
};

DepartmentList.propTypes = {
  isSocialGifts: PropTypes.bool,
  isEditMode: PropTypes.bool,
  isRecipe: PropTypes.bool,
  wobject: PropTypes.shape().isRequired,
  departments: PropTypes.arrayOf().isRequired,
};

export default DepartmentList;
