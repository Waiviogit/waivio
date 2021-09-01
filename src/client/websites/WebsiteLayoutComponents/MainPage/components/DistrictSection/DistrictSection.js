import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import DistrictsCard from '../DistrictsCard/DistrictsCard';
import { getListOfDistricts } from '../../../../../../store/websiteStore/websiteSelectors';
import { getDistricts } from '../../../../../../store/websiteStore/websiteActions';

const DistrictSection = props => {
  useEffect(() => {
    props.getDistricts();
  }, []);

  if (isEmpty(props.districts)) return null;

  return (
    <section className="WebsiteMainPage__districtsSection">
      <h2 className="WebsiteMainPage__districtsTitle">Find rewards in your area now!</h2>
      <p className="WebsiteMainPage__districtsSubtitle">
        Dining.Gifts is available in Greater Vancouver ONLY during the initial launch.
      </p>
      <div className="WebsiteMainPage__districtsList">
        {props.districts.map(card => (
          <DistrictsCard key={card.name} {...card} />
        ))}
      </div>
      <Link to={'/map'} className="WebsiteMainPage__button">
        See All Rewards <Icon type="right" />
      </Link>
    </section>
  );
};

DistrictSection.propTypes = {
  districts: PropTypes.arrayOf().isRequired,
  getDistricts: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    districts: getListOfDistricts(state),
  }),
  {
    getDistricts,
  },
)(DistrictSection);
