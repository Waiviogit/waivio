import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const GroupUsersLayout = ({ title, list }) => {
  const listLayout = list?.map((user, index) => (
    <>
      <Link key={user} to={`/@${user}`}>
        {user}
      </Link>
      {list.length - 1 === index ? '' : ', '}
    </>
  ));

  return (
    <div>
      <div className="Department__title mb1">
        <FormattedMessage id={title} formattedMessage={title} />:{' '}
      </div>
      <div>{listLayout}</div>
    </div>
  );
};

GroupUsersLayout.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  title: PropTypes.string.isRequired,
};

export default GroupUsersLayout;
