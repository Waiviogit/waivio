import React from 'react';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { InputNumber, Slider } from 'antd';
import './EditorObject.less';

class EditorObject extends React.Component {
  static propTypes = {
    wObject: PropTypes.shape().isRequired,
    handleRemoveObject: PropTypes.func.isRequired,
    handleChangeInfluence: PropTypes.func.isRequired,
  };

  throttledChange = _.throttle(
    influence => this.props.handleChangeInfluence(this.props.wObject, influence),
    10,
  );

  render() {
    const { wObject, handleRemoveObject } = this.props;
    return (
      <div className="editor-object">
        <div className="editor-object__content">
          <div className="editor-object__content info">
            <img className="editor-object__avatar" src={wObject.avatar} alt={wObject.tag} />
            <span className="editor-object__names">
              <span className="editor-object__names main">{wObject.tag}</span>
              {Boolean(wObject.name) && (
                <span className="editor-object__names other">{` (${wObject.name})`}</span>
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
              onChange={this.throttledChange}
            />
            <Slider
              min={1}
              max={wObject.influence.max}
              onChange={this.throttledChange}
              value={wObject.influence.value}
            />
          </div>
        </div>
        <div className="editor-object__controls">
          {Boolean(wObject.isNew) && (
            <div
              role="button"
              tabIndex={0}
              className="editor-object__control-item create"
              onClick={() => console.log('handleCreateObj')}
            >
              <i className="iconfont anticon anticon-codepen editor-object__control-item item-icon" />
              <FormattedMessage id="create" defaultMessage="Create" />
            </div>
          )}
          <div
            role="button"
            tabIndex={0}
            className="editor-object__control-item delete"
            onClick={() => handleRemoveObject(wObject)}
          >
            <i className="iconfont anticon anticon-delete editor-object__control-item item-icon" />
            <FormattedMessage id="remove" defaultMessage="Remove" />
          </div>
        </div>
      </div>
    );
  }
}

export default EditorObject;
