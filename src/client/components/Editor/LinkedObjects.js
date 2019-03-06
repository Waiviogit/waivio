import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Progress } from 'antd';
import SearchObjectsAutocomplete from '../EditorObject/SearchObjectsAutocomplete';
import EditorObject from '../EditorObject/EditorObject';
import CreateObject from '../../post/CreateObjectModal/CreateObject';
import './LinkedObjects.less';

const LinkedObjects = ({
  title,
  canCreateNewObject,
  isLinkedObjectsValid,
  linkedObjects,
  influenceRemain,
  handleAddLinkedObject,
  handleCreateObject,
  handleRemoveObject,
  handleChangeInfluence,
}) => (
  <div className="linked-objects">
    {title}
    {canCreateNewObject && (
      <React.Fragment>
        <SearchObjectsAutocomplete
          handleSelect={handleAddLinkedObject}
          itemsIdsToOmit={linkedObjects.map(obj => obj.id)}
        />
        <CreateObject handleCreateObject={handleCreateObject} />
      </React.Fragment>
    )}
    {Boolean(linkedObjects.length) && (
      <React.Fragment>
        {linkedObjects.length > 1 && (
          <div
            className={classNames('linked-objects__buffer', {
              'validation-error': !isLinkedObjectsValid && influenceRemain > 0,
            })}
          >
            <span className="linked-objects__label">
              <FormattedMessage id="linked_objects_remaining" defaultMessage="Remaining" />
            </span>
            <Progress
              className="linked-objects__buffer-bar"
              status="active"
              showInfo={Boolean(linkedObjects.length)}
              percent={influenceRemain}
              strokeWidth={15}
              strokeColor="orange"
              trailColor="red"
            />
          </div>
        )}
        {Boolean(!isLinkedObjectsValid && influenceRemain > 0) && (
          <div className="linked-objects__buffer-validation-msg">
            <FormattedMessage
              id="linked_objects_buffer_validation"
              defaultMessage="Buffer must be empty"
            />
          </div>
        )}
        {linkedObjects.map(obj => (
          <EditorObject
            key={obj.id}
            wObject={obj}
            objectsNumber={linkedObjects.length}
            isLinkedObjectsValid={isLinkedObjectsValid}
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
  isLinkedObjectsValid: true,
  linkedObjects: [],
  influenceRemain: 0,
  handleAddLinkedObject: () => {},
  handleCreateObject: () => {},
  handleRemoveObject: () => {},
  handleChangeInfluence: () => {},
};

export default LinkedObjects;
