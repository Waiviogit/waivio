import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { useSlate } from 'slate-react';
import SearchObjectsAutocomplete from '../../../../../client/components/EditorObject/SearchObjectsAutocomplete';

const objectSearchInput = props => {
  const handleSelectObject = selectedObject => {
    const objectName = selectedObject.author_permlink;

    if (selectedObject.type === 'hashtag' || selectedObject.object_type === 'hashtag')
      props.handleHashtag(objectName);
    props.handleObjectSelect(selectedObject, true);
    props.handleClose();
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

const ObjectSideButton = props => {
  const { intl } = props;
  const editor = useSlate();

  const onClick = () => props.renderControl(objectSearchInput(props, editor));

  return (
    <button
      className="md-sb-button action-btn"
      title={intl.formatMessage({
        id: 'add_object',
        defaultMessage: 'Add an object',
      })}
      onClick={onClick}
    >
      <span className="action-btn__icon action-btn__icon--text">#</span>
      <span className="action-btn__caption action-btn__caption_object">
        {props.intl.formatMessage({ id: 'post_btn_object', defaultMessage: 'Object' })}
      </span>
    </button>
  );
};

ObjectSideButton.propTypes = {
  intl: PropTypes.shape().isRequired,
  renderControl: PropTypes.func.isRequired,
};

export default withRouter(injectIntl(ObjectSideButton));
