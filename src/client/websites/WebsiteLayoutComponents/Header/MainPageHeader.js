import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';

import WebsiteSearch from '../../../search/WebsitesSearch/WebsiteSearch';
import FilterTypesList from '../../../search/SearchAllResult/components/FilterTypesList';
import HeaderButton from '../../../components/HeaderButton/HeaderButton';

const MainPageHeader = props => {
  const openModal = () => props.toggleModal(true);

  return (
    <div className="MainPageHeader">
      <div className="MainPageHeader__navWrapper">
        <div className="MainPageHeader__logo">
          <Link to="/" className="MainPageHeader__logoLink">
            <img src={'/images/dining.gifts.png'} className="MainPageHeader__logoImg" alt="logo" />
            <b>Dining.Gifts</b>
          </Link>{' '}
          <span>Eat out, earn crypto.</span>
        </div>
        <div className="MainPageHeader__buttonWrap">
          <div className="MainPageHeader__listLink">
            <Link to="/object/mds-dining-gifts/newsFilter/dininggifts-dw09owbl6bh">Reviews</Link>
            {!props.withMap && <Link to="/map?type=restaurant&showPanel=true">map</Link>}
            <Link to="/object/mds-dining-gifts/page#voy-business-3-0">partners</Link>
          </div>
          <HeaderButton isWebsite />
        </div>
      </div>
      {props.withMap && (
        <div className="NewFiltersClass">
          <div className="NewFiltersClass__searchWrap">
            <WebsiteSearch placeholder="Search" />
            <FilterTypesList />
          </div>
          {props.isAuthenticated && (
            <Button type="primary" className="NewFiltersClass__submit" onClick={openModal}>
              <Icon type="camera" /> Submit dish photos
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

MainPageHeader.propTypes = {
  withMap: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default MainPageHeader;
