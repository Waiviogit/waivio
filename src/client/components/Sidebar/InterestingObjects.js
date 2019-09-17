import { Icon } from 'antd';
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ObjectCard from './ObjectCard';
import './InterestingObjects.less';
import './SidebarContentBlock.less';
import { getRecommendedObjects } from '../../reducers';
import { getRecommendedObj } from '../../user/userActions';
import RightSidebarLoading from '../../app/Sidebar/RightSidebarLoading';
import WeightTag from '../WeightTag';

@connect(
  state => ({
    recommendedObjects: getRecommendedObjects(state),
  }),
  {
    getRecommendedObj,
  },
)
class InterestingObjects extends React.Component {
  static propTypes = {
    recommendedObjects: PropTypes.arrayOf(PropTypes.shape({ tag: PropTypes.string })).isRequired,
    getRecommendedObj: PropTypes.func.isRequired,
  };
  static defaultProps = {
    objects: [],
  };

  componentDidMount() {
    if (_.size(this.props.recommendedObjects) < 5) this.props.getRecommendedObj();
  }
  render() {
    const { recommendedObjects } = this.props;
    return _.size(recommendedObjects) >= 5 ? (
      <div className="InterestingObjects SidebarContentBlock">
        <h4 className="SidebarContentBlock__title">
          <Icon type="codepen" className="SidebarContentBlock__icon" />
          <FormattedMessage id="interesting_objects" defaultMessage="Top 5 Objects" />
          <button
            onClick={this.props.getRecommendedObj}
            className="InterestingPeople__button-refresh"
          >
            <i className="iconfont icon-refresh" />
          </button>
        </h4>
        <div className="SidebarContentBlock__content">
          {recommendedObjects &&
            recommendedObjects.map(wobject => (
              <ObjectCard
                key={wobject.author_permlink}
                wobject={wobject}
                showFollow={false}
                alt={<WeightTag weight={wobject.weight} />}
              />
            ))}
          <h4 className="InterestingObjects__more">
            <Link to={'/objects'}>
              <FormattedMessage id="discover_more_objects" defaultMessage="Discover more objects" />
            </Link>
          </h4>
        </div>
      </div>
    ) : (
      <RightSidebarLoading />
    );
  }
}
export default InterestingObjects;
