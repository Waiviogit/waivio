import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { getNavigItems, getSettingsLoading } from '../../../../store/appStore/appSelectors';
import SkeletonRow from '../../../components/Skeleton/SkeletonRow';

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
  const linkList = shopSettings?.type === 'user' ? userNav : useSelector(getNavigItems);
  const loading = useSelector(getSettingsLoading);

  if (loading) return <SkeletonRow rows={1} />;
  if (isEmpty(shopSettings) || isEmpty(linkList)) return null;

  return (
    <div className="WebsiteTopNavigation">
      {linkList.map(l => (
        <NavLink
          className="WebsiteTopNavigation__link"
          isActive={match => l?.link === match?.url}
          activeClassName={'WebsiteTopNavigation__link--active'}
          key={l.link}
          to={l.link}
        >
          {l.name}
        </NavLink>
      ))}
    </div>
  );
};

WebsiteTopNavigation.propTypes = {
  shopSettings: PropTypes.shape({
    type: PropTypes.string,
  }),
};

export default WebsiteTopNavigation;
