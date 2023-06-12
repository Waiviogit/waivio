import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

const GroupIdContent = ({ groupId, authorPermlink }) =>
  !isEmpty(groupId) ? (
    <div className="field-info">
      <div className="CompanyId__title">Group IDs:</div>
      {groupId?.map(id => (
        <div key={id} className="field-website__title">
          <Link
            to={`/object/${authorPermlink}/groupId/${id}`}
            className="CompanyId__wordbreak MenuItemButtons__link"
          >
            {id}
          </Link>
        </div>
      ))}
    </div>
  ) : null;

GroupIdContent.propTypes = {
  authorPermlink: PropTypes.string.isRequired,
  groupId: PropTypes.arrayOf(),
};

export default GroupIdContent;
