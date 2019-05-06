import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Icon } from 'antd';
import { getObjectTypes } from '../../../objectTypes/objectTypesActions';
import { getobjectTypesState } from '../../../reducers';
import './ObjectCreation.less';
import Loading from '../../Icon/Loading';

@connect(
  state => ({
    objectTypes: getobjectTypesState(state),
  }),
  {
    loadObjectTypes: getObjectTypes,
  },
)
class ObjectCreation extends React.Component {
  static limit = 5;
  static propTypes = {
    objectTypes: PropTypes.shape(),
    // loading: PropTypes.bool,
    loadObjectTypes: PropTypes.func.isRequired,
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
      showedTypesCount: ObjectCreation.limit,
    };
  }

  componentDidMount() {
    if (_.size(this.props.objectTypes) === 0) this.props.loadObjectTypes();
  }

  getMoreObjectTypes = () => {
    const { showedTypesCount } = this.state;
    const { objectTypes } = this.props;
    const loadedObjectTypesCount = _.size(objectTypes);
    if (showedTypesCount <= loadedObjectTypesCount) {
      this.setState({ showedTypesCount: showedTypesCount + ObjectCreation.limit });
    }
    // todo: add hasMore flag in reducer
  };

  render() {
    const { showedTypesCount } = this.state;
    const { objectTypes } = this.props;
    const isEmpty = _.size(objectTypes) === 0;
    const showedTypes = Object.keys(objectTypes).slice(0, showedTypesCount);
    return (
      <div className="ObjectCreation SidebarContentBlock">
        <h4 className="SidebarContentBlock__title">
          <Icon type="codepen" className="SidebarContentBlock__icon" />
          <FormattedMessage id="create_new_object" defaultMessage="Create new object" />
        </h4>
        <div className="SidebarContentBlock__content">
          {isEmpty && <Loading />}
          {!isEmpty &&
            showedTypes.map(objTypeName => (
              <div className="ObjectCreation__obj-type-item" key={objTypeName}>
                <div className="ObjectCreation__obj-type-item-name">{objTypeName}</div>
              </div>
            ))}
          {showedTypesCount <= _.size(objectTypes) && (
            <h4 className="SidebarContentBlock__more">
              <div onClick={this.getMoreObjectTypes} role="presentation">
                <FormattedMessage id="show_more" defaultMessage="Show more" />
              </div>
            </h4>
          )}
        </div>
      </div>
    );
  }
}

export default ObjectCreation;
