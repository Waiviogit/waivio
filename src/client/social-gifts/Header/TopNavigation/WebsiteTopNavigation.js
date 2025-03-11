import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { has, isEmpty, take, takeRight } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'antd';
import { useHistory } from 'react-router';
import { injectIntl } from 'react-intl';

import Popover from '../../../components/Popover';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import {
  getNavigItems,
  getUserAdministrator,
  getWebsiteConfiguration,
} from '../../../../store/appStore/appSelectors';
import PopoverMenu, { PopoverMenuItem } from '../../../components/PopoverMenu/PopoverMenu';
import LinkItem from './LinkItem';
import BurgerMenu from './BurgerMenu/BurgerMenu';
import { isTabletOrMobile } from '../../SocialProduct/socialProductHelper';
import { getMenuLinkTitle } from '../../../../common/helpers/headerHelpers';
import { setEditMode } from '../../../../store/wObjectStore/wobjActions';

import './WebsiteTopNavigation.less';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../../store/authStore/authSelectors';
import {
  accessTypesArr,
  hasDelegation,
  haveAccess,
} from '../../../../common/helpers/wObjectHelper';
import { getObject } from '../../../../store/wObjectStore/wObjectSelectors';

export const userMenuTabsList = ['Blog', 'Map', 'Shop', 'Recipes'];
const userNav = (user, intl) => [
  {
    id: 'Blog',
    name: intl.formatMessage({ id: 'blog', defaultMessage: 'Blog' }),
    link: `/blog/${user}`,
  },
  {
    id: 'Map',
    name: intl.formatMessage({ id: 'map', defaultMessage: 'Map' }),
    link: `/map/${user}`,
  },
  {
    id: 'Shop',
    name: intl.formatMessage({ id: 'shop', defaultMessage: 'Shop' }),
    link: `/user-shop/${user}`,
  },
  {
    id: 'Recipes',
    name: intl.formatMessage({ id: 'recipes', defaultMessage: 'Recipes' }),
    link: `/recipe/${user}`,
  },
  {
    id: 'Legal',
    name: intl.formatMessage({ id: 'legal', defaultMessage: 'Legal' }),
    link: '/object/ljc-legal',
  },
];

const WebsiteTopNavigation = ({ shopSettings, intl }) => {
  const listItem = useSelector(getNavigItems);
  const isAuth = useSelector(getIsAuthenticated);
  const config = useSelector(getWebsiteConfiguration);
  const currObj = useSelector(getObject);
  const username = useSelector(getAuthenticatedUserName);
  const isAdministrator = useSelector(getUserAdministrator);
  const dispatch = useDispatch();
  const tabsSorting =
    has(config, 'tabsSorting') && !isEmpty(config?.tabsSorting)
      ? config?.tabsSorting
      : userMenuTabsList;
  const sortedTabs = [...tabsSorting, 'Legal'];
  const filteredUserTab = userNav(shopSettings?.value, intl)
    ?.filter(i => !config?.tabsFilter?.includes(i?.id))
    ?.sort((a, b) => {
      const orderA = sortedTabs.indexOf(a?.id);
      const orderB = sortedTabs.indexOf(b?.id);

      return orderA - orderB;
    });
  const isUserShop = shopSettings?.type === 'user';
  const linkList = isUserShop ? filteredUserTab : listItem;
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const accessExtend =
    (haveAccess(currObj, username, accessTypesArr[0]) && isAdministrator) ||
    hasDelegation(currObj, username);

  useEffect(() => {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const element = document.getElementById('WebsiteTopNavigation');
      const container = document.getElementById('WebsiteTopNavigationContainer');

      window.addEventListener('scroll', () => {
        if (element) {
          if (container.getBoundingClientRect().top <= 0) {
            element.style.top = '0';
            element.style.position = 'fixed';
          } else {
            element.style.position = 'static';
          }
        }
      });
    }
  }, []);

  const listLength = isMobile() ? 2 : 5;

  const editObjectClick = () => {
    dispatch(setEditMode(true));

    history.push(`/object/${shopSettings?.value}`);
  };
  const handleMoreMenuVisibleChange = vis => setVisible(vis);

  // if (isEmpty(shopSettings) || isEmpty(linkList)) return null;
  const lastItemsLength = linkList.length - listLength;
  const lastItems = takeRight(linkList, lastItemsLength);

  return (
    <div id={'WebsiteTopNavigationContainer'}>
      <div className="WebsiteTopNavigation" id={'WebsiteTopNavigation'}>
        {take(linkList, listLength).map((l, i) => (
          <LinkItem key={l.link} link={l} index={i} />
        ))}
        {!isEmpty(lastItems) &&
          (lastItemsLength > 1 ? (
            <>
              {!isTabletOrMobile ? (
                <Popover
                  placement="bottom"
                  trigger="click"
                  visible={visible}
                  onVisibleChange={handleMoreMenuVisibleChange}
                  overlayStyle={{ position: 'fixed' }}
                  content={
                    <PopoverMenu
                      onSelect={(i, type) => {
                        if (type === 'blank') {
                          if (typeof window !== 'undefined') window.location?.replace(i);
                        } else {
                          setVisible(false);
                          history.push(i);
                        }
                      }}
                    >
                      {lastItems.map(i => (
                        <PopoverMenuItem
                          active={history.location.pathname.includes(i.link)}
                          key={i.link}
                          data={i.type}
                        >
                          {getMenuLinkTitle(i, intl, 15)}
                        </PopoverMenuItem>
                      ))}
                    </PopoverMenu>
                  }
                  overlayClassName="WebsiteTopNavigation__popover"
                >
                  <span className={'WebsiteTopNavigation__link'}>
                    {intl.formatMessage({ id: 'more', defaultMessage: 'More' })}{' '}
                    <Icon type="caret-down" />
                  </span>
                </Popover>
              ) : (
                <BurgerMenu
                  openButtonText={intl.formatMessage({ id: 'more', defaultMessage: 'More' })}
                  openButtonIcon={<Icon type="caret-down" />}
                  title={intl.formatMessage({ id: 'more', defaultMessage: 'More' }).toUpperCase()}
                  items={lastItems}
                />
              )}
            </>
          ) : (
            <LinkItem link={lastItems[0]} />
          ))}
        {!isUserShop && isAuth && accessExtend && !isEmpty(linkList) && (
          <span className={'WebsiteTopNavigation__link'} onClick={editObjectClick}>
            {intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}{' '}
          </span>
        )}
      </div>
    </div>
  );
};

WebsiteTopNavigation.propTypes = {
  shopSettings: PropTypes.shape({
    type: PropTypes.string,
    value: PropTypes.string,
  }),
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(WebsiteTopNavigation);
