import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, Popover } from 'antd';
// import { EditorState, AtomicBlockUtils } from 'draft-js';
// import { ATOMIC_TYPES } from '../../util/constants';
import SearchObjectsAutocomplete from '../../../../../client/components/EditorObject/SearchObjectsAutocomplete';

@injectIntl
class ObjectSideButton extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    // setEditorState: PropTypes.func,
    // getEditorState: PropTypes.func,
    // close: PropTypes.func,
  };
  static defaultProps = {
    setEditorState: () => {},
    getEditorState: () => {},
    close: () => {},
  };

  // onClick = () => {
  //   let editorState = this.props.getEditorState();
  //   const content = editorState.getCurrentContent();
  //   const contentWithEntity = content.createEntity(ATOMIC_TYPES.SEPARATOR, 'IMMUTABLE', {
  //     testmetadata: 'test',
  //   });
  //   const entityKey = contentWithEntity.getLastCreatedEntityKey();
  //   editorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
  //   this.props.setEditorState(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, '***'));
  //   this.props.close();
  // };

  handleSelectObject = selectedObject => {
    console.log('-->', selectedObject);
  };

  render() {
    const { intl } = this.props;
    return (
      <Popover
        content={
          <SearchObjectsAutocomplete
            handleSelect={this.handleSelectObject}
            canCreateNewObject={false}
          />
        }
        title={intl.formatMessage({ id: 'add_object', defaultMessage: 'Add an object' })}
        overlayClassName="EditorToolbar__popover"
        trigger="click"
        placement="bottom"
      >
        <button
          className="md-sb-button action-btn"
          // onClick={this.onClick}
          title={intl.formatMessage({
            id: 'add_object',
            defaultMessage: 'Add an object',
          })}
        >
          <Icon type="codepen" className="object-btn" />
        </button>
      </Popover>
    );
  }
}

export default ObjectSideButton;
