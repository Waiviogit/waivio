import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import {Icon} from "antd";

import DistrictsCard from '../DistrictsCard/DistrictsCard';
import {getDistrictsWithCount} from "../../../../../../waivioApi/ApiClient";

const DistrictSection = () => {
  useEffect(() => {
    getDistrictsWithCount().then(res => console.log(res))
  }, [])

  return (
    <section className="WebsiteMainPage__districtsSection">
      <h2 className="WebsiteMainPage__districtsTitle">Find rewards in your area now!</h2>
      <p className="WebsiteMainPage__districtsSubtitle">
        Note: Dining.Gifts is available in VANCOUVER ONLY during beta.
      </p>
      <div className="WebsiteMainPage__districtsList">
        {[
          {
            city: 'string',
            counter: 0,
          },
          {
            city: 'string',
            counter: 0,
          },
          {
            city: 'string',
            counter: 0,
          },
          {
            city: 'string',
            counter: 0,
          },
          {
            city: 'string',
            counter: 0,
          },
          {
            city: 'string',
            counter: 0,
          },
        ].map(card => (
          <DistrictsCard key={card.city} {...card} />
        ))}
      </div>
      <Link to={'/map?showPanel=true'} className="WebsiteMainPage__button">
        Find Rewards <Icon type="right" />
      </Link>
    </section>
  );
};

export default DistrictSection;
