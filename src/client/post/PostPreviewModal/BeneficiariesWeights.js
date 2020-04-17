import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Progress, Slider } from 'antd';
import { useSelector } from 'react-redux';
import BeneficiariesFindUsers from './BeneficiariesFindUsers';
import { getAuthenticatedUser, getBeneficiariesUsers } from '../../reducers';
import './AdvanceSettings.less';

class BeneficiariesWeight extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    objName: PropTypes.string.isRequired,
    onBenefPercentChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      percent: [0],
      benefPercentage: '',
    };
  }

  handlePercentChange = percent => {
    this.setState({ percent });
  };

  handleAfterPercentChange = percent => {
    const { index, onBenefPercentChange } = this.props;
    onBenefPercentChange(index, percent);
  };

  render() {
    const { percent } = this.state;
    const { index, objName } = this.props;

    return (
      <div key={index} className="beneficiaries-weights__item">
        <div className="beneficiaries-item-name">{`${objName} ${percent}%`}</div>
        <Slider
          className="beneficiaries-item-slider"
          min={0}
          max={100}
          value={percent}
          onChange={this.handlePercentChange}
          onAfterChange={this.handleAfterPercentChange}
        />
      </div>
    );
  }
}

const BeneficiariesWeights = ({
  intl,
  isLinkedObjectsValid,
  benefPercentage,
  onBenefPercentChange,
}) => {
  const [weightBuffer, setWeightBuffer] = useState(
    Object.values(benefPercentage).reduce((res, curr) => res - curr.percent, 100),
  );
  const user = useSelector(getAuthenticatedUser);
  const beneficiariesUsers = useSelector(getBeneficiariesUsers);

  useEffect(() => {
    setWeightBuffer(Object.values(benefPercentage).reduce((res, curr) => res - curr.percent, 100));
  }, [benefPercentage]);

  return (
    <div className="beneficiaries-weights">
      <div className="title">
        {intl.formatMessage({ id: 'beneficiaries-weights', defaultMessage: 'Beneficiaries' })}
      </div>
      <BeneficiariesFindUsers intl={intl} />
      <div className="beneficiaries-weights__header">
        <div className="user">{user.name}</div>
        <div
          className={classNames('weight-buffer', {
            hide: weightBuffer === 0 || weightBuffer === 100,
            'validation-error': !isLinkedObjectsValid && weightBuffer > 0,
          })}
          title={intl.formatMessage({
            id: 'linked_objects_remaining',
            defaultMessage: 'Remaining',
          })}
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
        <div className="beneficiaries-weights__buffer-validation-msg">
          <FormattedMessage
            id="linked_objects_buffer_validation"
            defaultMessage="Buffer must be empty"
          />
        </div>
      )}
      {beneficiariesUsers.map((obj, index) => (
        <BeneficiariesWeight
          key={obj}
          index={index}
          objName={obj}
          onBenefPercentChange={onBenefPercentChange}
        />
      ))}
    </div>
  );
};

BeneficiariesWeights.propTypes = {
  intl: PropTypes.shape().isRequired,
  isLinkedObjectsValid: PropTypes.bool,
  benefPercentage: PropTypes.shape(),
  onBenefPercentChange: PropTypes.func,
};

BeneficiariesWeights.defaultProps = {
  title: null,
  isLinkedObjectsValid: true,
  linkedObjects: [],
  benefPercentage: {},
  onBenefPercentChange: () => {},
};

export default BeneficiariesWeights;
