import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { has, isEmpty } from 'lodash';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import useTemplateProvider from '../../../designTemplates/TemplateProvider';
import {
  getConfigurationValues,
  getWebsiteLogo,
  getNavigItems,
  getMainObj,
  getHostAddress,
} from '../../../store/appStore/appSelectors';
import { userMenuTabsList } from './TopNavigation/WebsiteTopNavigation';

const Header = ({ hideSignIn, hideHeader }) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const config = useSelector(getConfigurationValues);
  const link = useSelector(getNavigItems)[0];
  const userTabs =
    has(config, 'tabsSorting') && !isEmpty(config?.tabsSorting)
      ? config?.tabsSorting
      : userMenuTabsList;
  const filteredTabs = userTabs?.filter(i => !config?.tabsFilter?.includes(i));
  const firstTab = filteredTabs?.[0]?.toLowerCase();
  let currUserTab;

  switch (firstTab) {
    case 'recipes':
      currUserTab = 'recipe';
      break;
    case 'shop':
      currUserTab = 'user-shop';
      break;
    default:
      currUserTab = firstTab;
  }
  const mainObj = useSelector(getMainObj);
  const handleMobileSearchButtonClick = () => setSearchBarActive(!searchBarActive);
  const logo = useSelector(getWebsiteLogo);
  const host = useSelector(getHostAddress);
  const currHost = host || (typeof location !== 'undefined' && location.hostname);
  const header = config?.header?.name;
  const logoClassList = classNames('Header__logo', {
    'Header__logo--upperCase': !header,
  });

  let to =
    config?.shopSettings?.type === 'user'
      ? `/${currUserTab}/${config?.shopSettings?.value}`
      : link?.link;

  if (to?.includes('/active-campaigns')) {
    to = '/active-campaigns';
  }

  const props = {
    hideSignIn,
    searchBarActive,
    to,
    logoClassList,
    hideHeader,
    logo,
    mainObj,
    currHost,
    header,
    handleMobileSearchButtonClick,
    config,
  };
  const { Header: TemplateHeader } = useTemplateProvider();

  if (!TemplateHeader) return null;

  return <TemplateHeader {...props} />;
};

Header.propTypes = {
  hideSignIn: PropTypes.bool,
  hideHeader: PropTypes.bool,
};

export default Header;
