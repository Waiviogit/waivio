import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { EditorState, Modifier } from 'draft-js';
import { Icon } from 'antd';
import { Entity } from '../../util/constants';
import SearchObjectsAutocomplete from '../../../../../client/components/EditorObject/SearchObjectsAutocomplete';
import * as apiConfig from '../../../../../waivioApi/config.json';

const objectSearchInput = props => {
  const handleSelectObject = selectedObject => {
    const editorState = props.getEditorState();
    let contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const contentStateWithEntity = contentState.createEntity(Entity.OBJECT, 'IMMUTABLE', {
      object: selectedObject,
      url: `${apiConfig.production.protocol}${apiConfig.production.host}/object/${selectedObject.id}`,
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    contentState = Modifier.insertText(
      contentState,
      selectionState,
      selectedObject.name,
      null,
      entityKey,
    );

    const newEditorState = EditorState.push(editorState, contentState, 'insert-characters');
    const newSelection = selectionState.merge({
      anchorOffset: selectedObject.name.length,
      focusOffset: selectedObject.name.length,
    });

    props.setEditorState(EditorState.forceSelection(newEditorState, newSelection));
  };

  return (
    <SearchObjectsAutocomplete
      className="object-search-input"
      style={{ height: '36px' }}
      handleSelect={handleSelectObject}
      canCreateNewObject={false}
    />
  );
};

objectSearchInput.propTypes = {
  setEditorState: PropTypes.func.isRequired,
  getEditorState: PropTypes.func.isRequired,
  // close: PropTypes.func.isRequired,
};

@injectIntl
class ObjectSideButton extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    // setEditorState: PropTypes.func,
    // getEditorState: PropTypes.func,
    // close: PropTypes.func,
    renderControl: PropTypes.func.isRequired,
  };
  static defaultProps = {
    setEditorState: () => {},
    getEditorState: () => {},
    // close: () => {},
  };

  onClick = () => this.props.renderControl(objectSearchInput(this.props));

  render() {
    const { intl } = this.props;
    return (
      <button
        className="md-sb-button action-btn"
        title={intl.formatMessage({
          id: 'add_object',
          defaultMessage: 'Add an object',
        })}
        onClick={this.onClick}
      >
        <Icon type="codepen" className="object-btn" />
        <span className="action-btn__caption">
          {this.props.intl.formatMessage({ id: 'object', defaultMessage: 'Object' })}
        </span>
      </button>
    );
  }
}

export default ObjectSideButton;
