import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Slider, Spin, Icon } from 'antd';
import './EditorObject.less';

@injectIntl
class EditorObject extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    wObject: PropTypes.shape().isRequired,
    objectsNumber: PropTypes.number.isRequired,
    isLinkedObjectsValid: PropTypes.bool.isRequired,
    handleCreateObject: PropTypes.func.isRequired,
    handleRemoveObject: PropTypes.func.isRequired,
    handleChangeInfluence: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      influenceValue: this.props.wObject.influence.value,
      isCreating: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.objectsNumber !== this.props.objectsNumber) {
      this.handleChangeInfluence(this.props.wObject.influence.value);
    }
  }

  throttledChange = _.throttle(
    influence => this.props.handleChangeInfluence(this.props.wObject, influence),
    10,
  );

  handleChangeInfluence = influence => {
    const influenceValue =
      influence < this.props.wObject.influence.max ? influence : this.props.wObject.influence.max;
    this.setState({ influenceValue });
  };

  handleAfterChangeInfluence = influence => {
    this.props.handleChangeInfluence(this.props.wObject, influence);
  };

  handleCreateObject = () => {
    const { wObject, handleCreateObject } = this.props;
    this.setState({ isCreating: true });
    handleCreateObject(wObject);
  };

  render() {
    const { influenceValue } = this.state;
    const { intl, wObject, handleRemoveObject, isLinkedObjectsValid } = this.props;
    return (
      <React.Fragment>
        <div
          className={classNames('editor-object', {
            'validation-error': wObject.isNew && !isLinkedObjectsValid,
          })}
        >
          <div className="editor-object__content">
            <div className="editor-object__content row">
              {wObject.isNew ? (
                <img className="editor-object__avatar" src={wObject.avatar} alt={wObject.name} />
              ) : (
                <a
                  href={`/object/@${wObject.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editor-object__info name"
                >
                  <img className="editor-object__avatar" src={wObject.avatar} alt={wObject.name} />
                </a>
              )}

              <span className="editor-object__info">
                {wObject.isNew ? (
                  <span className="editor-object__info name">{wObject.name}</span>
                ) : (
                  <a
                    href={`/object/@${wObject.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editor-object__info name"
                  >
                    {wObject.name}
                  </a>
                )}
                {Boolean(wObject.descriptionShort) && (
                  <span className="editor-object__info description">
                    {wObject.descriptionShort}
                  </span>
                )}
              </span>
            </div>
            <div className="editor-object__content row slider">
              <span className="label">{`${influenceValue}%`}</span>
              <Slider
                min={1}
                max={100}
                value={influenceValue}
                disabled={wObject.influence.value === 100}
                onChange={this.handleChangeInfluence}
                onAfterChange={this.handleAfterChangeInfluence}
              />
            </div>
          </div>
          <div className="editor-object__controls">
            {Boolean(wObject.isNew && !wObject.isCreating) && (
              <div
                role="button"
                tabIndex={0}
                className="editor-object__control-item create"
                title={intl.formatMessage({
                  id: 'create_new_object_placeholder',
                  defaultMessage: "This object doesn't exist yet, but you can create it",
                })}
                onClick={this.handleCreateObject}
              >
                <Icon type="codepen" className="editor-object__control-item item-icon" />
                <span className="editor-object__control-item item-text">
                  {intl.formatMessage({ id: 'create', defaultMessage: 'Create' })}
                </span>
              </div>
            )}
            {wObject.isCreating ? (
              <Spin />
            ) : (
              <div
                role="button"
                tabIndex={0}
                className="editor-object__control-item delete"
                onClick={() => handleRemoveObject(wObject)}
              >
                <Icon type="delete" className="editor-object__control-item item-icon" />
                <span className="editor-object__control-item item-text">
                  {intl.formatMessage({ id: 'remove', defaultMessage: 'Remove' })}
                </span>
              </div>
            )}
          </div>
        </div>
        {!isLinkedObjectsValid && wObject.isNew && (
          <div className="editor-object__validation-msg">
            {intl.formatMessage({
              id: 'editor_object_validation_message',
              defaultMessage: 'Object must be created before post the story',
            })}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default EditorObject;
