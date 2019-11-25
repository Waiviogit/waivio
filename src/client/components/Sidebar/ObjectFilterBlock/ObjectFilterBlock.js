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
  const [wobjectsData, setWobjectsData] = useState([]);
  const [isLoadedAll, setLoadedAll] = useState(false);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    api.getWobjectsWithCount(username, 0, 5).then(data => setWobjectsData(data));
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
    api
      .getWobjectsWithCount(username, wobjectsData.length, OBJECTS_COUNT)
      .then(data => {
        setWobjectsData([...wobjectsData, ...data]);
        if (data.length < 5) {
          setLoadedAll(true);
        }
        setLoading(false);
      })
      .catch(() => setLoadedAll(true));
  };

  const showMoreHandler = () => {
    setLoading(true);
    showMoreObjects();
  };
  props.setObjectFilters(activeFilters);
  return !isEmpty(wobjectsData) ? (
    <div className="SidebarContentBlock">
      <div className="SidebarContentBlock__title">
        <div className="SidebarContentBlock__icon">
          <Icon type="filter" />
        </div>
        <FormattedMessage id="object_filter" defaultMessage="Object filter" />
      </div>
      <div className="SidebarContentBlock__content">
        {map(wobjectsData, wobjectData => (
          <ObjectFilterCard wobjectData={wobjectData} setObjectFilters={setActiveObjectFilters} />
        ))}
        {wobjectsData.length >= 5 && !isLoadedAll && (
          <React.Fragment>
            <div className="ObjectFilterBlock__more" onClick={showMoreHandler} role="presentation">
              <FormattedMessage id="show_more" defaultMessage="Show more" />
              <div className={classNames('ObjectFilterBlock__more-icon', { loading: isLoading })}>
                <Icon type="loading" style={{ fontSize: 18 }} spin />
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
