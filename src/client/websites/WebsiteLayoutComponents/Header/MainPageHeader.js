import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import ModalSignIn from '../../../components/Navigation/ModlaSignIn/ModalSignIn';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import AuthUserBar from '../../../components/AuthUserBar/AuthUserBar';
import WebsiteSearch from '../../../search/WebsitesSearch/WebsiteSearch';
import FilterTypesList from '../../../search/SearchAllResult/components/FilterTypesList';

const MainPageHeader = props => {
  const username = useSelector(getAuthenticatedUserName);

  return (
    <div className="MainPageHeader">
      <div className="MainPageHeader__navWrapper">
        <Link to="/" className="MainPageHeader__logo">
          <img src={'/images/dining.gifts.png'} className="MainPageHeader__logoImg" alt="logo" />
          <b>Dining.Gifts</b> <span>Eat out, earn crypto.</span>
        </Link>
        <div className="MainPageHeader__listLink">
          <Link to="/object/mds-dining-gifts/newsFilter/dininggifts-dw09owbl6bh">Reviews</Link>
          <Link to="/map?showPanel=true">map</Link>
          <Link to="/object/mds-dining-gifts/page#voy-business-3-0">partners</Link>
          {username ? (
            <AuthUserBar />
          ) : (
            <ModalSignIn buttonClassName="MainPageHeader__signIn" isButton />
          )}
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
};

MainPageHeader.propTypes = {
  withMap: PropTypes.bool.isRequired,
};

export default MainPageHeader;
