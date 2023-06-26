import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty, take, takeRight, truncate } from 'lodash';
import { useSelector } from 'react-redux';
import { Icon } from 'antd';
import { useHistory } from 'react-router';

import Popover from '../../../components/Popover';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import { getNavigItems, getSettingsLoading } from '../../../../store/appStore/appSelectors';
import SkeletonRow from '../../../components/Skeleton/SkeletonRow';
import PopoverMenu, { PopoverMenuItem } from '../../../components/PopoverMenu/PopoverMenu';

import './WebsiteTopNavigation.less';

const userNav = user => [
  {
    name: 'Blog',
    link: `/blog/${user}`,
  },
  {
    name: 'Shop',
    link: `/user-shop/${user}`,
  },
  {
    name: 'Legal',
    link: '/checklist/ljc-legal',
  },
];

const WebsiteTopNavigation = ({ shopSettings }) => {
  const listItem = useSelector(getNavigItems);
  const linkList = shopSettings?.type === 'user' ? userNav(shopSettings?.value) : listItem;
  const loading = useSelector(getSettingsLoading);
  const history = useHistory();
  const [visible, setVisible] = useState(false);

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

  const handleMoreMenuVisibleChange = vis => setVisible(vis);

  if (loading) return <SkeletonRow rows={1} />;
  if (isEmpty(shopSettings) || isEmpty(linkList)) return null;
  const lastItemsLength = linkList.length - listLength;
  const lastItems = takeRight(linkList, lastItemsLength);

  return (
    <div id={'WebsiteTopNavigationContainer'}>
      <div className="WebsiteTopNavigation" id={'WebsiteTopNavigation'}>
        {take(linkList, listLength).map(l => (
          <NavLink
            className="WebsiteTopNavigation__link"
            isActive={() => history.location.pathname.includes(l?.link)}
            activeClassName={'WebsiteTopNavigation__link--active'}
            key={l.link}
            to={l.link}
          >
            {truncate(l.name, {
              length: 24,
              separator: '...',
            })}
          </NavLink>
        ))}
        {!isEmpty(lastItems) &&
          (lastItemsLength > 1 ? (
            <Popover
              placement="bottom"
              trigger="click"
              visible={visible}
              onVisibleChange={handleMoreMenuVisibleChange}
              overlayStyle={{ position: 'fixed' }}
              content={
                <PopoverMenu
                  onSelect={i => {
                    setVisible(false);
                    history.push(i);
                  }}
                >
                  {lastItems.map(i => (
                    <PopoverMenuItem
                      active={history.location.pathname.includes(i.link)}
                      key={i.link}
                    >
                      {truncate(i.name, {
                        length: 90,
                        separator: '...',
                      }).toUpperCase()}
                    </PopoverMenuItem>
                  ))}
                </PopoverMenu>
              }
              overlayClassName="WebsiteTopNavigation__popover"
            >
              <span className={'WebsiteTopNavigation__link'}>
                More <Icon type="caret-down" />
              </span>
            </Popover>
          ) : (
            <NavLink
              className="WebsiteTopNavigation__link"
              isActive={() => history.location.pathname.includes(lastItems[0]?.link)}
              activeClassName={'WebsiteTopNavigation__link--active'}
              key={lastItems[0]?.link}
              to={lastItems[0]?.link}
            >
              {truncate(lastItems[0]?.name, {
                length: 24,
                separator: '...',
              })}
            </NavLink>
          ))}
      </div>
    </div>
  );
};

WebsiteTopNavigation.propTypes = {
  shopSettings: PropTypes.shape({
    type: PropTypes.string,
    value: PropTypes.string,
  }),
};

export default WebsiteTopNavigation;
