import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Progress, Slider } from 'antd';
import './AdvanceSettings.less';

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
      <div key={objId} className="object-weights__item">
        <div className="obj-item-name">{`${objName} ${percent}%`}</div>
        <Slider
          className="obj-item-slider"
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

const ObjectWeights = ({
  intl,
  isLinkedObjectsValid,
  linkedObjects,
  weightBuffer,
  onPercentChange,
}) => (
  <div className="object-weights">
    <div className="object-weights__header">
      <div className="title">
        {intl.formatMessage({ id: 'object_weights', defaultMessage: 'Object weights' })}
      </div>
      <div
        className={classNames('weight-buffer', {
          hide: weightBuffer === 0,
          'validation-error': !isLinkedObjectsValid && weightBuffer > 0,
        })}
        title={intl.formatMessage({ id: 'linked_objects_remaining', defaultMessage: 'Remaining' })}
      >
        <Progress
          status="active"
          showInfo
          percent={weightBuffer}
          strokeWidth={5}
          strokeColor="orange"
          trailColor="red"
        />
      </div>
    </div>
    {Boolean(!isLinkedObjectsValid && weightBuffer > 0) && (
      <div className="object-weights__buffer-validation-msg">
        <FormattedMessage
          id="linked_objects_buffer_validation"
          defaultMessage="Buffer must be empty"
        />
      </div>
    )}
    {linkedObjects.map(obj => (
      <ObjectWeight
        key={obj.id}
        objId={obj.id}
        objName={obj.name}
        percentValue={obj.percent.value}
        percentMax={obj.percent.max}
        onPercentChange={onPercentChange}
      />
    ))}
  </div>
);

ObjectWeights.propTypes = {
  intl: PropTypes.shape().isRequired,
  isLinkedObjectsValid: PropTypes.bool,
  linkedObjects: PropTypes.arrayOf(PropTypes.shape()),
  weightBuffer: PropTypes.number,
  onPercentChange: PropTypes.func,
};

ObjectWeights.defaultProps = {
  title: null,
  isLinkedObjectsValid: true,
  linkedObjects: [],
  weightBuffer: 0,
  onPercentChange: () => {},
};

export default ObjectWeights;
