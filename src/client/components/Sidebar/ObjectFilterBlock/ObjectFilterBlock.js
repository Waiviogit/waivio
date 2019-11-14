import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { map, isEmpty } from 'lodash';
import classNames from 'classnames';
import * as api from '../../../../waivioApi/ApiClient';
import ObjectFilterCard from './ObjectFilterCard';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';
import { setObjectFilters } from '../../../object/wobjectsActions';
import './ObjectFilterBlock.less';

const OBJECTS_COUNT = 5;

const ObjectFilterBlock = ({ username, ...props }) => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [wobjects, setWobjects] = useState([]);
  const [isLoading, setLoading] = useState(false);
  // added mock property - count
  const mockData = wobjects.map(wobj => ({ ...wobj, count: 20 }));
  useEffect(() => {
    api.getWobjectsWithUserWeight(username, 0, 5).then(data => setWobjects(data.wobjects));
    return () => {
      props.setObjectFilters([]);
    };
  }, []);
  const setActiveObjectFilters = filter => {
    if (activeFilters.some(f => f === filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const showMoreObjects = () => {
    api.getWobjectsWithUserWeight(username, wobjects.length, OBJECTS_COUNT).then(data => {
      setWobjects([...wobjects, ...data.wobjects]);
      setLoading(false);
    });
  };

  const showMoreHandler = () => {
    setLoading(true);
    showMoreObjects();
  };
  props.setObjectFilters(activeFilters);
  return !isEmpty(mockData) ? (
    <div className="SidebarContentBlock">
      <div className="SidebarContentBlock__title">
        <div className="SidebarContentBlock__icon">
          <Icon type="filter" />
        </div>
        <FormattedMessage id="object_filter" defaultMessage="Object filter" />
      </div>
      <div className="SidebarContentBlock__content">
        {map(mockData, wobject => (
          <ObjectFilterCard wobject={wobject} setObjectFilters={setActiveObjectFilters} />
        ))}
        {mockData.length >= 5 && (
          <React.Fragment>
            <div className="ObjectFilterBlock__more" onClick={showMoreHandler} role="presentation">
              <FormattedMessage id="show_more" defaultMessage="Show more" />
              <div className={classNames('ObjectFilterBlock__more-icon', { loading: isLoading })}>
                <Icon type="loading" style={{ fontSize: 18 }} spin />;
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  ) : (
    <RightSidebarLoading />
  );
};

ObjectFilterBlock.propTypes = {
  username: PropTypes.string.isRequired,
  setObjectFilters: PropTypes.func.isRequired,
};
export default connect(
  null,
  {
    setObjectFilters,
  },
)(ObjectFilterBlock);
