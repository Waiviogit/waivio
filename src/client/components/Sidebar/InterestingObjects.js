import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ObjectComponent from './ObjectComponent';
import './InterestingObjects.less';
import './SidebarContentBlock.less';

const InterestingObjects = ({ objects, onRefresh }) => (
  <div className="InterestingObjects SidebarContentBlock">
    <h4 className="SidebarContentBlock__title">
      <i className="iconfont icon-group SidebarContentBlock__icon" />{' '}
      <FormattedMessage id="interesting_objects" defaultMessage="Interesting Objects" />
      <button onClick={onRefresh} className="InterestingObjects__button-refresh">
        <i className="iconfont icon-refresh" />
      </button>
    </h4>
    <div className="SidebarContentBlock__content">
      {objects && _.map(objects, object => <ObjectComponent key={object.tag} item={object} />)}
      <h4 className="InterestingObjects__more">
        <Link to={'/objects'}>
          <FormattedMessage id="discover_more_objects" defaultMessage="Discover More Objects" />
        </Link>
      </h4>
    </div>
  </div>
);

InterestingObjects.propTypes = {
  objects: PropTypes.arrayOf(PropTypes.shape({ tag: PropTypes.string })),
  onRefresh: PropTypes.func,
};

InterestingObjects.defaultProps = {
  objects: [],
  onRefresh: () => {},
};

export default InterestingObjects;
