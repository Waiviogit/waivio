import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { EditorState, Modifier } from 'draft-js';
import { Icon, Popover } from 'antd';
import { Entity } from '../../util/constants';
import SearchObjectsAutocomplete from '../../../../../client/components/EditorObject/SearchObjectsAutocomplete';

@injectIntl
class ObjectSideButton extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    setEditorState: PropTypes.func,
    getEditorState: PropTypes.func,
    // close: PropTypes.func,
  };
  static defaultProps = {
    setEditorState: () => {},
    getEditorState: () => {},
    close: () => {},
  };

  handleSelectObject = selectedObject => {
    const editorState = this.props.getEditorState();
    let contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const contentStateWithEntity = contentState.createEntity(Entity.OBJECT, 'IMMUTABLE');
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    contentState = Modifier.insertText(
      contentState,
      selectionState,
      selectedObject.name,
      null,
      entityKey,
    );

    this.props.setEditorState(EditorState.push(editorState, contentState, 'insert-characters'));
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
