import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ObjectComponent from './ObjectComponent';
import './InterestingObjects.less';
import './SidebarContentBlock.less';

const InterestingObjects = ({ objects }) => (
  <div className="InterestingObjects SidebarContentBlock">
    <h4 className="SidebarContentBlock__title">
      <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
      <FormattedMessage id="interesting_objects" defaultMessage="Top 5 Objects" />
    </h4>
    <div className="SidebarContentBlock__content">
      {objects &&
        _.map(objects, object => <ObjectComponent key={object.authorPermlink} item={object} />)}
      <h4 className="InterestingObjects__more">
        <Link to={'/objects'}>
          <FormattedMessage id="discover_more_objects" defaultMessage="Discover more objects" />
        </Link>
      </h4>
    </div>
  </div>
);

InterestingObjects.propTypes = {
  objects: PropTypes.arrayOf(PropTypes.shape()),
};

InterestingObjects.defaultProps = {
  objects: [],
};

export default InterestingObjects;
