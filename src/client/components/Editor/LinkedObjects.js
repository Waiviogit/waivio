import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Progress, Modal } from 'antd';
import SearchObjectsAutocomplete from '../EditorObject/SearchObjectsAutocomplete';
import EditorObject from '../EditorObject/EditorObject';
import './LinkedObjects.less';
import CreateObject from '../../post/CreateObject/CreateObject';

class LinkedObjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }
  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };
  render() {
    return (
      <div className="linked-objects">
        {this.props.title}
        {this.props.canCreateNewObject && (
          <React.Fragment>
            <SearchObjectsAutocomplete
              handleSelect={this.props.handleAddLinkedObject}
              linkedObjectsIds={this.props.linkedObjects.map(obj => obj.id)}
            />
            <div className="obj-search-option first">
              <span
                role="presentation"
                className="obj-search-option__label"
                onClick={this.toggleModal}
              >
                {this.props.intl.formatMessage({
                  id: 'create_new_object',
                  defaultMessage: 'create new object',
                })}
              </span>
            </div>
            {this.state.isModalOpen && (
              <Modal
                title={this.props.intl.formatMessage({
                  id: 'create_new_object',
                  defaultMessage: 'Create new object',
                })}
                visible
                confirmLoading={this.state.isCreating}
                footer={null}
                onCancel={this.toggleModal}
              >
                <CreateObject
                  handleCreateObject={this.props.handleCreateObject}
                  toggleModal={this.toggleModal}
                />
              </Modal>
            )}
          </React.Fragment>
        )}
        {Boolean(this.props.linkedObjects.length) && (
          <React.Fragment>
            {this.props.linkedObjects.length > 1 && (
              <div
                className={classNames('linked-objects__buffer', {
                  'validation-error':
                    !this.props.isLinkedObjectsValid && this.props.influenceRemain > 0,
                })}
              >
                <span className="linked-objects__label">
                  <FormattedMessage id="linked_objects_remaining" defaultMessage="Remaining" />
                </span>
                <Progress
                  className="linked-objects__buffer-bar"
                  status="active"
                  showInfo={Boolean(this.props.linkedObjects.length)}
                  percent={this.props.influenceRemain}
                  strokeWidth={15}
                  strokeColor="orange"
                  trailColor="red"
                />
              </div>
            )}
            {Boolean(!this.props.isLinkedObjectsValid && this.props.influenceRemain > 0) && (
              <div className="linked-objects__buffer-validation-msg">
                <FormattedMessage
                  id="linked_objects_buffer_validation"
                  defaultMessage="Buffer must be empty"
                />
              </div>
            )}
            {this.props.linkedObjects.map(obj => (
              <EditorObject
                key={obj.id}
                wObject={obj}
                objectsNumber={this.props.linkedObjects.length}
                isLinkedObjectsValid={this.props.isLinkedObjectsValid}
                handleRemoveObject={this.props.handleRemoveObject}
                handleChangeInfluence={this.props.handleChangeInfluence}
              />
            ))}
          </React.Fragment>
        )}
      </div>
    );
  }
}

LinkedObjects.propTypes = {
  title: PropTypes.node,
  intl: PropTypes.shape(),
  canCreateNewObject: PropTypes.bool,
  isLinkedObjectsValid: PropTypes.bool,
  linkedObjects: PropTypes.arrayOf(PropTypes.shape()),
  influenceRemain: PropTypes.number,
  handleAddLinkedObject: PropTypes.func,
  handleCreateObject: PropTypes.func,
  handleRemoveObject: PropTypes.func,
  handleChangeInfluence: PropTypes.func,
};

LinkedObjects.defaultProps = {
  title: null,
  canCreateNewObject: true,
  intl: {},
  isLinkedObjectsValid: true,
  linkedObjects: [],
  influenceRemain: 0,
  handleAddLinkedObject: () => {},
  handleCreateObject: () => {},
  handleRemoveObject: () => {},
  handleChangeInfluence: () => {},
};

export default injectIntl(LinkedObjects);
