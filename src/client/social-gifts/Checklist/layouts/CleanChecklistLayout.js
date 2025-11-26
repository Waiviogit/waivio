import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CleanListHero from '../../../../designTemplates/clean/components/ListHero';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';
import Loading from '../../../components/Icon/Loading';
import EarnsCommissionsOnPurchases from '../../../statics/EarnsCommissionsOnPurchases';
import GoogleAds from '../../../adsenseAds/GoogleAds';
import CleanChecklistView from '../views/CleanChecklistView';

import '../Checklist.clean.less';

const CleanChecklistLayout = ({
  wobject,
  listType,
  loading,
  hideBreadCrumbs,
  getMenuList,
  minimal,
  moderate,
  intensive,
  cleanListSummary,
}) => (
  <div
    className={classNames('ChecklistClean', 'Checklist--clean', {
      'Checklist--withoutMargin': wobject?.object_type === 'page',
    })}
  >
    <CleanChecklistView cleanListSummary={cleanListSummary} listType={listType} loading={loading} />
    <div className="Checklist__breadcrumbsContainre">
      {!hideBreadCrumbs && !loading && wobject?.object_type !== 'newsfeed' && <Breadcrumbs />}
      {listType && <EarnsCommissionsOnPurchases align={'right'} marginBottom={'0px'} />}
    </div>
    {loading ? <Loading /> : getMenuList()}
    {listType && <CleanListHero wobject={wobject} />}
    {(minimal || moderate || intensive) && listType && <GoogleAds inList />}
  </div>
);

CleanChecklistLayout.propTypes = {
  wobject: PropTypes.shape({
    object_type: PropTypes.string,
  }),
  listType: PropTypes.bool,
  loading: PropTypes.bool,
  hideBreadCrumbs: PropTypes.bool,
  getMenuList: PropTypes.func,
  minimal: PropTypes.bool,
  moderate: PropTypes.bool,
  intensive: PropTypes.bool,
  cleanListSummary: PropTypes.shape({
    label: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default CleanChecklistLayout;
