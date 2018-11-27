import React from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { InputNumber, Slider, Spin } from 'antd';
import './EditorObject.less';

@injectIntl
class EditorObject extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    wObject: PropTypes.shape().isRequired,
    handleCreateObject: PropTypes.func.isRequired,
    handleRemoveObject: PropTypes.func.isRequired,
    handleChangeInfluence: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isCreating: false,
    };
  }

  throttledChange = _.throttle(
    influence => this.props.handleChangeInfluence(this.props.wObject, influence),
    10,
  );

  handleCreateObject = () => {
    const { wObject, handleCreateObject } = this.props;
    this.setState({ isCreating: true });
    handleCreateObject(wObject);
  };

  render() {
    const { isCreating } = this.state;
    const { intl, wObject, handleRemoveObject } = this.props;
    return (
      <React.Fragment>
        <div className="editor-object">
          <div className="editor-object__content">
            <div className="editor-object__content info">
              <img className="editor-object__avatar" src={wObject.avatar} alt={wObject.name} />
              <span className="editor-object__names">
                <span className="editor-object__names main">{wObject.name}</span>
                {Boolean(wObject.tag) && (
                  <span className="editor-object__names other">{` (${wObject.tag})`}</span>
                )}
              </span>
            </div>
            <div className="editor-object__content influence-slider">
              <InputNumber
                min={1}
                max={wObject.influence.max}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                size="small"
                value={wObject.influence.value}
                disabled={wObject.influence.value === 100}
                onChange={this.throttledChange}
              />
              <Slider
                min={1}
                max={wObject.influence.max}
                value={wObject.influence.value}
                disabled={wObject.influence.value === 100}
                onChange={this.throttledChange}
              />
            </div>
          </div>
          <div className="editor-object__controls">
            {Boolean(wObject.isNew && !isCreating) && (
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
                <i className="iconfont anticon anticon-codepen editor-object__control-item item-icon" />
                <span className="editor-object__control-item item-text">
                  {intl.formatMessage({ id: 'create', defaultMessage: 'Create' })}
                </span>
              </div>
            )}
            {isCreating ? (
              <Spin />
            ) : (
              <div
                role="button"
                tabIndex={0}
                className="editor-object__control-item delete"
                onClick={() => handleRemoveObject(wObject)}
              >
                <i className="iconfont anticon anticon-delete editor-object__control-item item-icon" />
                <span className="editor-object__control-item item-text">
                  {intl.formatMessage({ id: 'remove', defaultMessage: 'Remove' })}
                </span>
              </div>
            )}
          </div>
        </div>
        {Boolean(wObject.isNew) && (
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
