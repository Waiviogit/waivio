import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';

import NearByCard from '../NearByCard/NearByCard';
import { getNearbyFood } from '../../../../../../store/websiteStore/websiteActions';
import { getListOfDishAndDrink } from '../../../../../../store/websiteStore/websiteSelectors';

const NearbySection = props => {
  useEffect(() => {
    props.getNearbyFood();
  }, []);

  if (isEmpty(props.nearbyFood)) return null;

  return (
    <section className="WebsiteMainPage__nearbySection">
      <h2 className="WebsiteMainPage__nearbyTitle">
        {props.intl.formatMessage({ id: 'nearby_food', defaultMessage: 'Nearby Food & Drink' })}
      </h2>
      <div className="WebsiteMainPage__nearbyList">
        {props.nearbyFood.map(card => (
          <NearByCard key={card.name} {...card} />
        ))}
      </div>
      <Link to={'/map?showPanel=true&type=dish'} className="WebsiteMainPage__button">
        {props.intl.formatMessage({ id: 'see_all_nearby', defaultMessage: 'See All Nearby' })}{' '}
        <Icon type="right" />
      </Link>
    </section>
  );
};

NearbySection.propTypes = {
  nearbyFood: PropTypes.arrayOf().isRequired,
  getNearbyFood: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(
  connect(
    state => ({
      nearbyFood: getListOfDishAndDrink(state),
    }),
    { getNearbyFood },
  )(NearbySection),
);
