import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';
import Loading from '../../../components/Icon/Loading';
import EarnsCommissionsOnPurchases from '../../../statics/EarnsCommissionsOnPurchases';
import GoogleAds from '../../../adsenseAds/GoogleAds';
import ClassicChecklistView from '../views/ClassicChecklistView';

const ClassicChecklistLayout = ({
  wobject,
  listType,
  loading,
  hideBreadCrumbs,
  getMenuList,
  minimal,
  moderate,
  intensive,
}) => {
  const shouldShowBanner = listType && wobject?.background && !loading;

  return (
    <div
      className={classNames('Checklist', {
        'Checklist--withoutMargin': wobject?.object_type === 'page',
      })}
    >
      <div className="Checklist__breadcrumbsContainre">
        {!hideBreadCrumbs && !loading && wobject?.object_type !== 'newsfeed' && <Breadcrumbs />}
        {listType && <EarnsCommissionsOnPurchases align={'right'} marginBottom={'0px'} />}
      </div>
      {shouldShowBanner && (
        <div className="Checklist__banner">
          <img src={wobject?.background} alt={'Promotional list banner'} />
        </div>
      )}
      {loading ? <Loading /> : getMenuList()}
      <ClassicChecklistView wobject={wobject} listType={listType} loading={loading} />
      {(minimal || moderate || intensive) && listType && <GoogleAds inList />}
    </div>
  );
};

ClassicChecklistLayout.propTypes = {
  wobject: PropTypes.shape({
    object_type: PropTypes.string,
    background: PropTypes.string,
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

export default ClassicChecklistLayout;
