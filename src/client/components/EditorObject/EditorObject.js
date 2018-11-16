import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { InputNumber, Slider } from 'antd';
import './EditorObject.less';

class EditorObject extends React.Component {
  static propTypes = {
    wObject: PropTypes.shape().isRequired,
    handleRemoveObject: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      influence: 50,
    };

    this.handleChangeInfluence = this.handleChangeInfluence.bind(this);
  }

  handleChangeInfluence(influence) {
    this.setState({ influence });
  }

  render() {
    const { influence } = this.state;
    const { wObject, handleRemoveObject } = this.props;
    return (
      <div className="editor-object">
        <div
          onClick={() => console.log(wObject.tag)}
          className="editor-object__content"
          role={'button'}
          tabIndex={0}
        >
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
              max={100}
              size="small"
              value={influence}
              onChange={this.handleChangeInfluence}
            />
            <Slider
              min={1}
              max={100}
              onChange={this.handleChangeInfluence}
              value={typeof influence === 'number' ? influence : 0}
            />
          </div>
        </div>
        <div className="editor-object__controls">
          <div
            role="button"
            tabIndex={0}
            className="editor-object__controls delete"
            onClick={() => handleRemoveObject(wObject.tag)}
          >
            <i className="iconfont icon-trash editor-object__controls delete-icon" />
            <FormattedMessage id="remove" defaultMessage="Remove" />
          </div>
        </div>
      </div>
    );
  }
}

export default EditorObject;
