import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { size } from 'lodash';
import { EditorState, Modifier } from 'draft-js';

import { Entity } from '../../util/constants';
import SearchObjectsAutocomplete from '../../../../../client/components/EditorObject/SearchObjectsAutocomplete';
import config from '../../../../../waivioApi/routes';
import { createNewHash, getObjectName, hasType } from '../../../../../common/helpers/wObjectHelper';
import OBJECT_TYPES from '../../../../../client/object/const/objectTypes';

const objectSearchInput = props => {
  const handleSelectObject = selectedObject => {
    const objectName = selectedObject.author_permlink;
    const name = getObjectName(selectedObject);
    const editorState = props.getEditorState();
    let contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    let currUrl = `${config.production.protocol}${config.production.host}${selectedObject.defaultShowLink}`;

    if (
      (hasType(selectedObject, OBJECT_TYPES.LIST) || hasType(selectedObject, OBJECT_TYPES.PAGE)) &&
      props.match.params[0] === OBJECT_TYPES.PAGE
    ) {
      currUrl = `/object/${props.match.params.name}/page#${createNewHash(
        selectedObject.author_permlink,
        props.location.hash,
      )}`;
    }

    const contentStateWithEntity = contentState.createEntity(Entity.OBJECT, 'IMMUTABLE', {
      object: selectedObject,
      url: currUrl,
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    contentState = Modifier.insertText(contentState, selectionState, String(name), null, entityKey);

    const newEditorState = EditorState.push(editorState, contentState, 'insert-characters');
    const newSelection = selectionState.merge({
      anchorOffset: size(name),
      focusOffset: size(name),
    });

    if (selectedObject.type === 'hashtag' || selectedObject.object_type === 'hashtag')
      props.handleHashtag(objectName);
    props.setEditorState(EditorState.forceSelection(newEditorState, newSelection));
    props.handleObjectSelect(selectedObject, true);
  };

  return (
    <SearchObjectsAutocomplete
      className="object-search-input"
      style={{ height: '36px' }}
      handleSelect={handleSelectObject}
      canCreateNewObject={false}
      addHashtag
    />
  );
};

objectSearchInput.propTypes = {
  handleObjectSelect: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  getEditorState: PropTypes.func.isRequired,
  handleHashtag: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      0: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    hash: PropTypes.string,
  }).isRequired,
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
        <span className="action-btn__icon action-btn__icon--text">#</span>
        <span className="action-btn__caption action-btn__caption_object">
          {this.props.intl.formatMessage({ id: 'post_btn_object', defaultMessage: 'Object' })}
        </span>
      </button>
    );
  }
}

export default withRouter(ObjectSideButton);
