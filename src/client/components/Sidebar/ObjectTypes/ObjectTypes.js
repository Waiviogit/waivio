import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Loading from '../../Icon/Loading';
import './ObjectTypes.less';
import { getObjectTypes } from '../../../objectTypes/objectTypesActions';
import WeightTag from '../../WeightTag';
import ObjectCard from '../ObjectCard';
import { getobjectTypesState } from '../../../reducers';

@connect(
  state => ({
    objectTypes: getobjectTypesState(state),
  }),
  {
    getObjectTypes,
  },
)
class ObjectTypes extends React.Component {
  static propTypes = {
    objectTypes: PropTypes.arrayOf(PropTypes.shape()),
    loading: PropTypes.bool,
    getObjectTypes: PropTypes.func.isRequired,
  };

  static defaultProps = {
    objectTypes: [],
    topics: [],
    maxItems: 5,
    loading: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
    };
  }
  componentDidMount() {
    this.props.getObjectTypes();
  }

  changeVisibility(showMore) {
    this.setState({ showMore });
  }

  render() {
    const { objectTypes, loading } = this.props;
    return (
      <div className="ObjectTypes">
        {!loading &&
          !_.isEmpty(objectTypes) &&
          _.map(objectTypes, objectType => (
            <div key={objectType.name} className="ObjectTypes__type-wrap">
              <div className="ObjectTypes__name-wrap">
                <FormattedMessage id="sort_trending" defaultMessage="Trending" />:
                <div className="ObjectTypes__name" title={objectType.name}>
                  {objectType.name}
                </div>
              </div>
              {objectType.related_wobjects && !_.isEmpty(objectType.related_wobjects) && (
                <div className="ObjectTypes__object-wrap">
                  {_.map(objectType.related_wobjects, wobject => (
                    <ObjectCard
                      key={wobject.author_permlink}
                      wobject={wobject}
                      showFollow={false}
                      alt={<WeightTag weight={wobject.user_weight} rank={wobject.rank} />}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        {loading && <Loading center={false} />}
        {/* {!loading && topics.length > maxItems && !this.state.showMore ? ( */}
        {/* <a role="button" tabIndex={0} onClick={() => this.changeVisibility(true)}> */}
        {/* <FormattedMessage id="show_more" defaultMessage="View more" /> */}
        {/* </a> */}
        {/* ) : null} */}
        {/* {!loading && topics.length > maxItems && this.state.showMore ? ( */}
        {/* <a role="button" tabIndex={0} onClick={() => this.changeVisibility(false)}> */}
        {/* <FormattedMessage id="show_less" defaultMessage="View less" /> */}
        {/* </a> */}
        {/* ) : null} */}
      </div>
    );
  }
}

export default ObjectTypes;
