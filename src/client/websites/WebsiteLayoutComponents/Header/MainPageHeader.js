import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import WebsiteSearch from '../../../search/WebsitesSearch/WebsiteSearch';
import FilterTypesList from '../../../search/SearchAllResult/components/FilterTypesList';
import HeaderButton from '../../../components/HeaderButton/HeaderButton';

const MainPageHeader = props => (
  <div className="MainPageHeader">
    <div className="MainPageHeader__navWrapper">
      <div className="MainPageHeader__logo">
        <img src={'/images/dining.gifts.png'} className="MainPageHeader__logoImg" alt="logo" />
        <Link to="/">
          <b>Dining.Gifts</b>
        </Link>{' '}
        <span>Eat out, earn crypto.</span>
      </div>
      <div className="MainPageHeader__buttonWrap">
        <div className="MainPageHeader__listLink">
          <Link to="/object/mds-dining-gifts/newsFilter/dininggifts-dw09owbl6bh">Reviews</Link>
          <Link to="/map?showPanel=true">map</Link>
          <Link to="/object/mds-dining-gifts/page#voy-business-3-0">partners</Link>
        </div>
        <HeaderButton isWebsite />
      </div>
    </div>
    {props.withMap && (
      <div className="NewFiltersClass">
        <WebsiteSearch placeholder="Search" />
        <FilterTypesList />
      </div>
    )}
  </div>
);

MainPageHeader.propTypes = {
  withMap: PropTypes.bool.isRequired,
};

export default MainPageHeader;
