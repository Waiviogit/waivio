import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { getObjectTypes, getMoreObjectsByType } from '../../../objectTypes/objectTypesActions';
import Loading from '../../Icon/Loading';
import './ObjectTypes.less';
import ObjectCard from '../ObjectCard';
import { getobjectTypesState } from '../../../reducers';

@connect(
  state => ({
    objectTypes: getobjectTypesState(state),
  }),
  {
    getObjectTypes,
    getMoreObjectsByType,
  },
)
class ObjectTypes extends React.Component {
  static propTypes = {
    objectTypes: PropTypes.shape(),
    loading: PropTypes.bool,
    getObjectTypes: PropTypes.func.isRequired,
    getMoreObjectsByType: PropTypes.func.isRequired,
  };

  static defaultProps = {
    objectTypes: {},
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
    if (_.size(this.props.objectTypes) < 5) this.props.getObjectTypes();
  }
  getMoreObjectsByType(type, skip) {
    this.props.getMoreObjectsByType(type, skip);
  }

  render() {
    const { objectTypes, loading } = this.props;
    return (
      <div className="ObjectTypes">
        {!loading &&
          !_.isEmpty(objectTypes) &&
          _.map(
            objectTypes,
            objectType =>
              objectType.related_wobjects &&
              !_.isEmpty(objectType.related_wobjects) && (
                <div key={objectType.name} className="ObjectTypes__type-wrap">
                  <div className="ObjectTypes__name-wrap">
                    <FormattedMessage id="sort_trending" defaultMessage="Trending" />:
                    <div className="ObjectTypes__name" title={objectType.name}>
                      {objectType.name}
                    </div>
                  </div>
                  <div className="ObjectTypes__object-wrap">
                    {_.map(objectType.related_wobjects, wobject => (
                      <ObjectCard
                        key={wobject.author_permlink}
                        wobject={wobject}
                        showFollow={false}
                      />
                    ))}
                    {objectType.name && objectType.permlink && (
                      <div className="ObjectTypes__buttons">
                        {objectType.hasMoreWobjects ? (
                          <a
                            role="presentation"
                            onClick={() =>
                              this.getMoreObjectsByType(
                                objectType.name,
                                _.size(objectType.related_wobjects),
                              )
                            }
                            className="ObjectTypes__more"
                          >
                            <FormattedMessage id="show_more" defaultMessage="Show more" />
                          </a>
                        ) : (
                          <div />
                        )}
                        <Link to={`/objectType/${objectType.name}`}>
                          <FormattedMessage id="explore" defaultMessage="Explore" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ),
          )}
        {loading && <Loading center={false} />}
      </div>
    );
  }
}

export default ObjectTypes;
