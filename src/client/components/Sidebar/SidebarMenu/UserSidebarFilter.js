import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { Checkbox } from 'antd';
import { getTags } from '../../../reducers';
import { getUserProfileBlogPosts } from '../../../feed/feedActions';
import './UserSidebarFilter.less';

const UserSidebarFilter = ({ intl, username }) => {
  const [selectedFields, setSelectedFields] = useState([]);
  const dispatch = useDispatch();
  const filters = useSelector(getTags);

  const handleOnChangeCheckbox = e => {
    const { value, checked } = e.target;
    let checkedFilters;
    if (checked) {
      checkedFilters = [...selectedFields, value];
    } else {
      checkedFilters = selectedFields.filter(item => item !== value);
    }
    setSelectedFields(checkedFilters);
    dispatch(getUserProfileBlogPosts(username, { limit: 10, initialLoad: true }, checkedFilters));
  };

  return (
    <div className="SidebarContentBlock">
      <div className="SidebarContentBlock__title">
        <i className="iconfont icon-trysearchlist SidebarContentBlock__icon" />
        {intl.formatMessage({ id: 'filter_posts', defaultMessage: 'Filter posts' })}
      </div>
      <div className="SidebarContentBlock__content">
        {!isEmpty(filters) &&
          filters.map(filter => (
            <Checkbox
              key={filter.name}
              name={filter.name}
              value={filter.author_permlink}
              onChange={handleOnChangeCheckbox}
            >
              <span className="SidebarContentBlock__name">{filter.name}</span>
            </Checkbox>
          ))}
      </div>
    </div>
  );
};

UserSidebarFilter.propTypes = {
  intl: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
};

export default injectIntl(withRouter(UserSidebarFilter));
