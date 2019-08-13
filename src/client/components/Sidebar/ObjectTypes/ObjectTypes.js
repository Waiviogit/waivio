import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { getObjectTypes, getMoreObjectsByType } from '../../../objectTypes/objectTypesActions';
import ObjectCard from '../ObjectCard';
import { getObjectTypesList, getObjectTypesLoading } from '../../../reducers';
import ObjectTypesLoading from './ObjectTypesLoading';
import './ObjectTypes.less';

@connect(
  state => ({
    objectTypes: getObjectTypesList(state),
    isTypesLoading: getObjectTypesLoading(state),
  }),
  {
    getObjectTypes,
    getMoreObjectsByType,
  },
)
class ObjectTypes extends React.Component {
  static propTypes = {
    objectTypes: PropTypes.shape(),
    isTypesLoading: PropTypes.bool.isRequired,
    getObjectTypes: PropTypes.func.isRequired,
    getMoreObjectsByType: PropTypes.func.isRequired,
  };

  static defaultProps = {
    objectTypes: {},
  };

  componentDidMount() {
    if (_.size(this.props.objectTypes) < 5) this.props.getObjectTypes(100, 0, 3);
  }

  getMoreObjectsByType = (type, skip) => this.props.getMoreObjectsByType(type, skip, 10);

  getTypesLayout = objectType =>
    objectType.related_wobjects.map(wobject => (
      <ObjectCard key={wobject.author_permlink} wobject={wobject} showFollow={false} />
    ));

  render() {
    const { objectTypes, isTypesLoading } = this.props;
    return (
      <div className="ObjectTypes">
        {!isTypesLoading ? (
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
                    {this.getTypesLayout(objectType)}
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
          )
        ) : (
          <ObjectTypesLoading />
        )}
      </div>
    );
  }
}

export default ObjectTypes;
