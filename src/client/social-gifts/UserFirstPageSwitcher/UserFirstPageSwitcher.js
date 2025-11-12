import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Affix from '../../components/Utils/Affix';
import DepartmentsUser from '../../Shop/ShopDepartments/DepartmentsUser';
import UserFilters from '../../Shop/ShopFilters/UserFilters';
import DepartmentsMobile from '../../Shop/ShopDepartments/DepartmentsMobile';
import FiltersForMobile from '../../newRewards/Filters/FiltersForMobile';
import UserShoppingList from '../../Shop/ShopList/UserShoppingList';
import UserBlogFeed from '../FeedMasonry/UserBlogFeed';
import WebsiteBody from '../../websites/WebsiteLayoutComponents/Body/WebsiteBody';
import Checklist from '../Checklist/Checklist';
import { getShopSettings } from '../../../store/appStore/appSelectors';

// eslint-disable-next-line consistent-return
const UserFirstPageSwitcher = ({ type, intl }) => {
  const shopSettings = useSelector(getShopSettings);
  const [visible, setVisible] = useState();
  const [visibleFilter, setVisibleFilter] = useState();

  // eslint-disable-next-line default-case
  switch (type) {
    case 'Shop':
      return (
        <div className="shifted">
          <div className="feed-layout container Shop shifted">
            <Affix className="leftContainer" stickPosition={77}>
              <div className="left">
                <DepartmentsUser name={shopSettings?.value} isSocial />
                <UserFilters name={shopSettings?.value} />
              </div>
            </Affix>
            <div className="center center--withoutRigth">
              <h3 className={'ShopSwitcher__breadCrumbs'}>
                {intl.formatMessage({ id: 'departments', defaultMessage: 'Departments' })}
              </h3>
              <DepartmentsMobile
                type={shopSettings?.type}
                visible={visible}
                setVisible={vis => setVisible(vis)}
                name={shopSettings?.value}
                isSocial
              />
              <FiltersForMobile
                setVisible={vis => setVisibleFilter(vis)}
                visible={visibleFilter}
                type={shopSettings?.type}
                user={shopSettings?.value}
              />
              <UserShoppingList name={shopSettings?.value} isSocial />
            </div>
          </div>
        </div>
      );
    case 'Recipes':
      return (
        <div className="shifted">
          <div className="feed-layout container Shop shifted">
            <Affix className="leftContainer" stickPosition={77}>
              <div className="left">
                <DepartmentsUser isRecipePage name={shopSettings?.value} isSocial />
                <UserFilters isRecipePage name={shopSettings?.value} />
              </div>
            </Affix>
            <div className="center center--withoutRigth">
              <h3 className={'ShopSwitcher__breadCrumbs'}>
                {intl.formatMessage({ id: 'categories', defaultMessage: 'Categories' })}
              </h3>
              <DepartmentsMobile
                isRecipePage
                type={shopSettings?.type}
                visible={visible}
                setVisible={vis => setVisible(vis)}
                name={shopSettings?.value}
                isSocial
              />
              <FiltersForMobile
                setVisible={vis => setVisibleFilter(vis)}
                visible={visibleFilter}
                type={shopSettings?.type}
                user={shopSettings?.value}
                isRecipePage
              />
              <UserShoppingList isRecipePage name={shopSettings?.value} isSocial />
            </div>
          </div>
        </div>
      );
    case 'Blog':
      return <UserBlogFeed user={shopSettings?.value} />;
    case 'Map':
      return <WebsiteBody user={shopSettings?.value} isUserMap isSocial />;
    case 'Legal':
      return <Checklist permlink={'ljc-legal'} />;
  }
};

UserFirstPageSwitcher.propTypes = {
  intl: PropTypes.shape().isRequired,
  type: PropTypes.string.isRequired,
};
export default injectIntl(UserFirstPageSwitcher);
