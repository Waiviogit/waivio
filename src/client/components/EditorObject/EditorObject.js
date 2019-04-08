import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Slider, Icon, Tag, Rate } from 'antd';
import '../../post/PostObjectCard/PostObjectCard.less';
// import ObjectRank from '../../object/ObjectRank';
// import ObjectType from '../../object/ObjectType';
// import { averageRate } from '../Sidebar/Rate/rateHelper';

@injectIntl
class EditorObject extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    wObject: PropTypes.shape().isRequired,
    objectsNumber: PropTypes.number.isRequired,
    isLinkedObjectsValid: PropTypes.bool.isRequired,
    handleRemoveObject: PropTypes.func.isRequired,
    handleChangeInfluence: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      influenceValue: this.props.wObject.influence.value,
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

  render() {
    const { influenceValue } = this.state;
    const { intl, wObject, handleRemoveObject, isLinkedObjectsValid } = this.props;
    const pathName = `/object/${wObject.id}`;
    return (
      <React.Fragment>
        <div
          className={classNames('editor-object', {
            'validation-error': wObject.isNew && !isLinkedObjectsValid,
          })}
        >
          <div className="editor-object__content">
            <div className="editor-object__content row">
              <a href={pathName} target="_blank" rel="noopener noreferrer">
                <img className="editor-object__avatar" src={wObject.avatar} alt={wObject.name} />
              </a>
              <div className="editor-object__info">
                <a
                  href={pathName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editor-object__info name"
                >
                  <div className="name">
                    <span className="editor-object__truncated" title={wObject.name}>
                      {wObject.name}
                    </span>
                    {wObject.rank && <Tag>{wObject.rank}</Tag>}
                  </div>
                </a>
                {/* {wObject.type && ( */}
                {/* <div className="editor-object__rankWrap"> */}
                {/* <div className="editor-object__type"> */}
                {/* <ObjectType type={wObject.type} /> */}
                {/* </div> */}
                {/* </div> */}
                {/* )} */}
                <div className="rate-wrap">
                  <div>Design</div>
                  <Rate allowHalf disabled value={4} />
                </div>
                <div className="rate-wrap">
                  <div>Service</div>
                  <Rate allowHalf disabled value={2} />
                </div>
                {wObject.title && (
                  <span className="editor-object__truncated" title={wObject.title}>
                    {wObject.title}
                  </span>
                )}
              </div>
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
            <div
              role="button"
              tabIndex={0}
              className="editor-object__control-item delete"
              onClick={() => handleRemoveObject(wObject)}
            >
              <Icon
                type="close"
                className="editor-object__control-item item-icon"
                title={intl.formatMessage({ id: 'remove', defaultMessage: 'Remove' })}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditorObject;
