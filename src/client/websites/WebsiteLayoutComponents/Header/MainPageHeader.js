import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {injectIntl} from "react-intl";

import WebsiteSearch from '../../../search/WebsitesSearch/WebsiteSearch';
import FilterTypesList from '../../../search/SearchAllResult/components/FilterTypesList';
import HeaderButton from '../../../components/HeaderButton/HeaderButton';
import SubmitDishPhotosButton from '../../../widgets/SubmitDishPhotosButton/SubmitDishPhotosButton';

const MainPageHeader = props => (
  <div className="MainPageHeader">
    <div className="MainPageHeader__navWrapper">
      <div className="MainPageHeader__logo">
        <Link to="/" className="MainPageHeader__logoLink">
          <img src={'/images/dining.gifts.png'} className="MainPageHeader__logoImg" alt="logo" />
          <b>Dining.Gifts</b>
        </Link>
        {!props.withMap && (
          <Link to="/map?type=restaurant&showPanel=true" className="MainPageHeader__link">
            {props.intl.formatMessage({id: "map_header", defaultMessage: "map"})}
          </Link>
        )}
        <span className={!props.withMap && 'MainPageHeader__logo-border'}>
          {props.intl.formatMessage({id: "eat_out_earn_crypto", defaultMessage: "Eat out, earn crypto"})}.
        </span>
      </div>
      <div className="MainPageHeader__buttonWrap">
        <div className="MainPageHeader__listLink">
          <Link to="/object/mds-dining-gifts/newsFilter/dininggifts-dw09owbl6bh">{props.intl.formatMessage({id: "reviews", defaultMessage: "Reviews"})}</Link>
          <Link to="/object/mds-dining-gifts/page#voy-business-3-0">{props.intl.formatMessage({id: "partners", defaultMessage: "Partners"})}</Link>
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
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(MainPageHeader);
