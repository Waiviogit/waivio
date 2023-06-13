import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';
import DepartmentItem from './DepartmentItem';

const DepartmentList = ({ wobject, departments, isSocialGifts }) => {
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
    <>
      {departmentsList?.map(dep => (
        <DepartmentItem
          id={dep.body}
          key={dep.body}
          history={history}
          wobject={wobject}
          department={dep}
        />
      ))}
      {hasMore && (
        <button onClick={onShowMoreClick} className="WalletTable__csv-button">
          {isSocialGifts ? (
            <span>
              <FormattedMessage id="show_all" defaultMessage="Show all" />
              {` (${departments.length})`}
            </span>
          ) : (
            <FormattedMessage id="show_more" defaultMessage="Show more" />
          )}
        </button>
      )}
    </>
  );
};

DepartmentList.propTypes = {
  isSocialGifts: PropTypes.bool,
  wobject: PropTypes.shape().isRequired,
  departments: PropTypes.arrayOf().isRequired,
};

export default DepartmentList;
