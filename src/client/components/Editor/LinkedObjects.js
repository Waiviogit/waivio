import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd';
import SearchObjectsAutocomplete from '../EditorObject/SearchObjectsAutocomplete';
import EditorObject from '../EditorObject/EditorObject';

const LinkedObjects = ({
  title,
  canCreateNewObject,
  linkedObjects,
  influenceRemain,
  areObjectsCreated,
  handleAddLinkedObject,
  handleCreateObject,
  handleRemoveObject,
  handleChangeInfluence,
}) => (
  <div>
    {title}
    {canCreateNewObject && (
      <SearchObjectsAutocomplete
        handleSelect={handleAddLinkedObject}
        canCreateNewObject={canCreateNewObject}
        linkedObjectsIds={linkedObjects.map(obj => obj.id)}
      />
    )}
    {Boolean(linkedObjects.length) && (
      <React.Fragment>
        <div>
          <span>Object Power</span>
          <Progress
            status="active"
            showInfo={Boolean(linkedObjects.length)}
            percent={influenceRemain}
            strokeWidth={15}
            strokeColor="orange"
            trailColor="red"
          />
        </div>
        {linkedObjects.map(obj => (
          <EditorObject
            key={obj.id}
            wObject={obj}
            objectsNumber={linkedObjects.length}
            areObjectsCreated={areObjectsCreated}
            handleCreateObject={handleCreateObject}
            handleRemoveObject={handleRemoveObject}
            handleChangeInfluence={handleChangeInfluence}
          />
        ))}
      </React.Fragment>
    )}
  </div>
);

LinkedObjects.propTypes = {
  title: PropTypes.node,
  canCreateNewObject: PropTypes.bool,
  areObjectsCreated: PropTypes.bool,
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
  areObjectsCreated: true,
  linkedObjects: [],
  influenceRemain: 0,
  handleAddLinkedObject: () => {},
  handleCreateObject: () => {},
  handleRemoveObject: () => {},
  handleChangeInfluence: () => {},
};

export default LinkedObjects;
