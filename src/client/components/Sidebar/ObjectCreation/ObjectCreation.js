import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import { Icon } from 'antd';
import { getObjectTypes } from '../../../../store/objectTypesStore/objectTypesActions';
import Loading from '../../Icon/Loading';
import CreateObject from '../../../post/CreateObjectModal/CreateObject';
import { getObjectTypesList } from '../../../../store/objectTypesStore/objectTypesSelectors';

import './ObjectCreation.less';

const objTypesLimit = 5;

@connect(
  state => ({
    objectTypes: getObjectTypesList(state),
  }),
  {
    loadObjectTypes: getObjectTypes,
  },
)
@injectIntl
class ObjectCreation extends React.Component {
  static propTypes = {
    objectTypes: PropTypes.shape(),
    // loading: PropTypes.bool,
    intl: PropTypes.shape(),
    loadObjectTypes: PropTypes.func.isRequired,
    onCreateObject: PropTypes.func.isRequired,
  };

  static defaultProps = {
    intl: {},
    objectTypes: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      showedTypesCount: objTypesLimit,
      isCreateObjModalVisible: false,
      selectedType: '',
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
      this.setState({ showedTypesCount: showedTypesCount + objTypesLimit, selectedType: '' });
    }
  };

  setObjectType = e => {
    this.setState({ selectedType: e.currentTarget.textContent });
  };

  resetSelected = () => this.setState({ selectedType: '' });

  createObject = object => this.props.onCreateObject(object);

  render() {
    const { selectedType, showedTypesCount } = this.state;
    const { objectTypes } = this.props;
    const isEmpty = _.size(objectTypes) === 0;
    const showedTypes = Object.keys(objectTypes).slice(0, showedTypesCount);

    return (
      <div className="ObjectCreation SidebarContentBlock">
        <h4 className="SidebarContentBlock__title">
          <Icon type="codepen" className="SidebarContentBlock__icon" />
          {this.props.intl.formatMessage({
            id: 'create_new_object',
            defaultMessage: 'Create new object',
          })}
        </h4>
        <div className="SidebarContentBlock__content">
          {isEmpty && <Loading />}
          {!isEmpty &&
            showedTypes.map(objTypeName => (
              <div
                className="ObjectCreation__obj-type-item"
                key={objTypeName}
                role="presentation"
                onClick={this.setObjectType}
              >
                <div className="ObjectCreation__obj-type-item-name">{objTypeName}</div>
              </div>
            ))}
          {showedTypesCount <= _.size(objectTypes) && (
            <h4 className="SidebarContentBlock__more">
              <div onClick={this.getMoreObjectTypes} role="presentation">
                {this.props.intl.formatMessage({
                  id: 'show_more',
                  defaultMessage: 'Show more',
                })}
              </div>
            </h4>
          )}
        </div>
        <CreateObject
          isSingleType
          withOpenModalBtn={false}
          isModalOpen={Boolean(selectedType)}
          defaultObjectType={selectedType}
          onCloseModal={this.resetSelected}
          onCreateObject={this.createObject}
        />
      </div>
    );
  }
}

export default ObjectCreation;
