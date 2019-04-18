import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Progress, Slider } from 'antd';

class ObjectWeight extends React.PureComponent {
  static propTypes = {
    objId: PropTypes.string.isRequired,
    objName: PropTypes.string.isRequired,
    percentValue: PropTypes.number.isRequired,
    percentMax: PropTypes.number.isRequired,
    onPercentChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      percent: props.percentValue,
    };
  }

  handlePercentChange = percent => {
    const { percentMax } = this.props;
    const percentValue = percent < percentMax ? percent : percentMax;
    this.setState({ percent: percentValue });
  };

  handleAfterPercentChange = percent => {
    const { objId, onPercentChange } = this.props;
    onPercentChange(objId, percent);
  };

  render() {
    const { percent } = this.state;
    const { objId, objName, percentValue } = this.props;
    return (
      <div key={objId}>
        <div>{`${objName} ${percent}%`}</div>
        <Slider
          min={1}
          max={100}
          value={percent}
          disabled={percentValue === 100}
          onChange={this.handlePercentChange}
          onAfterChange={this.handleAfterPercentChange}
        />
      </div>
    );
  }
}

const LinkedObjects = ({
  title,
  isLinkedObjectsValid,
  linkedObjects,
  weightBuffer,
  onPercentChange,
}) => (
  <div className="linked-objects">
    {title}
    {Boolean(linkedObjects.length) && (
      <React.Fragment>
        {linkedObjects.length > 1 && (
          <div
            className={classNames('linked-objects__buffer', {
              'validation-error': !isLinkedObjectsValid && weightBuffer > 0,
            })}
          >
            <span className="linked-objects__label">
              <FormattedMessage id="linked_objects_remaining" defaultMessage="Remaining" />
            </span>
            <Progress
              className="linked-objects__buffer-bar"
              status="active"
              showInfo={Boolean(linkedObjects.length)}
              percent={weightBuffer}
              strokeWidth={15}
              strokeColor="orange"
              trailColor="red"
            />
          </div>
        )}
        {Boolean(!isLinkedObjectsValid && weightBuffer > 0) && (
          <div className="linked-objects__buffer-validation-msg">
            <FormattedMessage
              id="linked_objects_buffer_validation"
              defaultMessage="Buffer must be empty"
            />
          </div>
        )}
        {linkedObjects.map(obj => (
          <ObjectWeight
            objId={obj.id}
            objName={obj.name}
            percentValue={obj.percent.value}
            percentMax={obj.percent.max}
            onPercentChange={onPercentChange}
          />
        ))}
      </React.Fragment>
    )}
  </div>
);

LinkedObjects.propTypes = {
  title: PropTypes.node,
  isLinkedObjectsValid: PropTypes.bool,
  linkedObjects: PropTypes.arrayOf(PropTypes.shape()),
  weightBuffer: PropTypes.number,
  onPercentChange: PropTypes.func,
};

LinkedObjects.defaultProps = {
  title: null,
  isLinkedObjectsValid: true,
  linkedObjects: [],
  weightBuffer: 0,
  onPercentChange: () => {},
};

export default LinkedObjects;
