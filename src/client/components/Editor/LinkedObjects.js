import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SearchObjectsAutocomplete from '../EditorObject/SearchObjectsAutocomplete';
import EditorObject from '../EditorObject/EditorObject';

const LinkedObjects = ({
  canCreateNewObject,
  linkedObjects,
  areObjectsCreated,
  handleAddLinkedObject,
  handleCreateObject,
  handleRemoveObject,
  handleChangeInfluence,
}) => (
  <div>
    <div className="ant-form-item-label">
      <label className="Editor__label" htmlFor="title">
        <FormattedMessage id="editor_linked_objects" defaultMessage="Linked objects" />
      </label>
    </div>
    {canCreateNewObject && (
      <SearchObjectsAutocomplete
        handleSelect={handleAddLinkedObject}
        canCreateNewObject={canCreateNewObject}
        linkedObjectsIds={linkedObjects.map(obj => obj.id)}
      />
    )}
    {Boolean(linkedObjects.length) &&
      linkedObjects.map(obj => (
        <EditorObject
          key={obj.id}
          wObject={obj}
          areObjectsCreated={areObjectsCreated}
          handleCreateObject={handleCreateObject}
          handleRemoveObject={handleRemoveObject}
          handleChangeInfluence={handleChangeInfluence}
        />
      ))}
  </div>
);

LinkedObjects.propTypes = {
  canCreateNewObject: PropTypes.bool,
  areObjectsCreated: PropTypes.bool,
  linkedObjects: PropTypes.shape(),
  handleAddLinkedObject: PropTypes.func,
  handleCreateObject: PropTypes.func,
  handleRemoveObject: PropTypes.func,
  handleChangeInfluence: PropTypes.func,
};

LinkedObjects.defaultProps = {
  canCreateNewObject: true,
  areObjectsCreated: true,
  linkedObjects: [],
  handleAddLinkedObject: () => {},
  handleCreateObject: () => {},
  handleRemoveObject: () => {},
  handleChangeInfluence: () => {},
};

export default LinkedObjects;
