import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import DiningGiftsLogoIcon from '@images/dining.gifts.png'

import WebsiteSearch from '../../../search/WebsitesSearch/WebsiteSearch';
import FilterTypesList from '../../../search/SearchAllResult/components/FilterTypesList';
import HeaderButton from '../../../components/HeaderButton/HeaderButton';
import SubmitDishPhotosButton from '../../../widgets/SubmitDishPhotosButton/SubmitDishPhotosButton';

const MainPageHeader = props => (
  <div className="MainPageHeader">
    <div className="MainPageHeader__navWrapper">
      <div className="MainPageHeader__logo">
        <Link to="/" className="MainPageHeader__logoLink">
          <img src={DiningGiftsLogoIcon} className="MainPageHeader__logoImg" alt="logo" />
          <b>Dining.Gifts</b>
        </Link>
        {!props.withMap && (
          <Link to="/map?type=restaurant&showPanel=true" className="MainPageHeader__link">
            map
          </Link>
        )}
        <span className={!props.withMap && 'MainPageHeader__logo-border'}>
          Eat out, earn crypto.
        </span>
      </div>
      <div className="MainPageHeader__buttonWrap">
        <div className="MainPageHeader__listLink">
          <Link to="/object/mds-dining-gifts/newsFilter/dininggifts-dw09owbl6bh">Reviews</Link>
          <Link to="/object/mds-dining-gifts/page#voy-business-3-0">partners</Link>
        </div>
        <HeaderButton isWebsite />
      </div>
    </div>
    {props.withMap && (
      <div className="DiningFiltersClass">
        <div className="DiningFiltersClass__searchWrap">
          <WebsiteSearch placeholder="Search" />
          <FilterTypesList />
        </div>
        <SubmitDishPhotosButton className={'DiningFiltersClass__submit'} />
      </div>
    )}
  </div>
);

MainPageHeader.propTypes = {
  withMap: PropTypes.bool.isRequired,
};

export default MainPageHeader;
