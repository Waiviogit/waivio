import React from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { withRouter } from 'react-router';
import FiltersContainer from '../../discoverObjects/DiscoverFiltersSidebar/FiltersContainer';
import {
  getAvailableFilters,
  getFiltersTags,
} from '../../../store/objectTypeStore/objectTypeSelectors';
import '../../components/Sidebar/SidebarContentBlock.less';
import './NewDiscoverFilters.less';

const NewDiscoverFilters = () => {
  const filters = useSelector(getAvailableFilters);
  const tagsFilters = useSelector(getFiltersTags);

  if (isEmpty(filters) && isEmpty(tagsFilters)) {
    return null;
  }

  return (
    <div className="NewDiscoverFilters">
      <div className="NewDiscoverFilters__card">
        <div className="NewDiscoverFilters__title">
          <i className="iconfont icon-trysearchlist NewDiscoverFilters__icon" />
          <span>Filters</span>
        </div>
        <FiltersContainer filters={filters} tagsFilters={tagsFilters} />
      </div>
    </div>
  );
};

export default withRouter(NewDiscoverFilters);
