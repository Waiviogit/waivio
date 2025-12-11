import React from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { withRouter } from 'react-router';
import FiltersContainer from '../../discoverObjects/DiscoverFiltersSidebar/FiltersContainer';
import SkeletonRow from '../../components/Skeleton/SkeletonRow';
import {
  getAvailableFilters,
  getFiltersTags,
  getTagCategoriesLoading,
} from '../../../store/objectTypeStore/objectTypeSelectors';
import '../../components/Sidebar/SidebarContentBlock.less';
import './NewDiscoverFilters.less';

const NewDiscoverFilters = () => {
  const filters = useSelector(getAvailableFilters);
  const tagsFilters = useSelector(getFiltersTags);
  const isLoading = useSelector(getTagCategoriesLoading);

  if (isEmpty(filters) && isEmpty(tagsFilters) && !isLoading) {
    return null;
  }

  return (
    <div className="NewDiscoverFilters">
      <div className="NewDiscoverFilters__title">
        <i className="iconfont icon-trysearchlist NewDiscoverFilters__icon" />
        <span>Filters</span>
      </div>
      {isLoading ? (
        <div className="NewDiscoverFilters__skeleton">
          <SkeletonRow rows={8} />
        </div>
      ) : (
        <FiltersContainer filters={filters} tagsFilters={tagsFilters} newDiscover />
      )}
    </div>
  );
};

export default withRouter(NewDiscoverFilters);
