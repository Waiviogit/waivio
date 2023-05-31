import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty, take, takeRight, truncate } from 'lodash';
import { useSelector } from 'react-redux';
import { Icon } from 'antd';
import Popover from '../../../components/Popover';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import { getNavigItems, getSettingsLoading } from '../../../../store/appStore/appSelectors';
import SkeletonRow from '../../../components/Skeleton/SkeletonRow';
import PopoverMenu, { PopoverMenuItem } from '../../../components/PopoverMenu/PopoverMenu';

import './WebsiteTopNavigation.less';

const userNav = [
  // {
  //   name: 'Blog',
  //   link: '/blog',
  // },
  {
    name: 'Shop',
    link: '/',
  },
  {
    name: 'Legal',
    link: '/object/ljc-legal/list',
  },
];

const WebsiteTopNavigation = ({ shopSettings }) => {
  const listItem = useSelector(getNavigItems);
  const linkList = shopSettings?.type === 'user' ? userNav : listItem;
  const loading = useSelector(getSettingsLoading);

  if (loading) return <SkeletonRow rows={1} />;
  if (isEmpty(shopSettings) || isEmpty(linkList)) return null;

  const listLength = isMobile() ? 2 : 5;

  return (
    <div className="WebsiteTopNavigation">
      {take(linkList, listLength).map(l => (
        <NavLink
          className="WebsiteTopNavigation__link"
          isActive={match => l?.link === match?.url}
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
      {((isMobile() && linkList.length > 2) || (!isMobile() && linkList.length)) > 5 && (
        <Popover
          placement="bottom"
          trigger="click"
          // visible={popoverVisible}
          // onVisibleChange={handleMoreMenuVisibleChange}
          overlayStyle={{ position: 'fixed' }}
          content={
            <PopoverMenu onSelect={() => {}}>
              {takeRight(linkList, linkList.length - listLength).map(i => (
                <PopoverMenuItem key={i.name}>{i.name}</PopoverMenuItem>
              ))}
            </PopoverMenu>
          }
          overlayClassName="WebsiteTopNavigation__popover"
        >
          <span className={'WebsiteTopNavigation__link'}>
            More <Icon type="caret-down" />
          </span>
        </Popover>
      )}
    </div>
  );
};

WebsiteTopNavigation.propTypes = {
  shopSettings: PropTypes.shape({
    type: PropTypes.string,
  }),
};

export default WebsiteTopNavigation;
