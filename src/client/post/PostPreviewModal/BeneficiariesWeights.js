import { Icon, Progress, Slider } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import useWebsiteColor from '../../../hooks/useWebsiteColor';
import { getAuthenticatedUser, isGuestUser } from '../../../store/authStore/authSelectors';
import {
  updateBeneficiariesUsers,
  removeBeneficiariesUsers,
} from '../../../store/searchStore/searchActions';
import { getBeneficiariesUsers } from '../../../store/searchStore/searchSelectors';
import { getHiveBeneficiaryAccount } from '../../../store/settingsStore/settingsSelectors';
import BeneficiariesFindUsers from './BeneficiariesFindUsers';

import './AdvanceSettings.less';

class BeneficiariesWeight extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    objName: PropTypes.string.isRequired,
    percent: PropTypes.number,
    percentMax: PropTypes.number.isRequired,
    onBenefPercentChange: PropTypes.func.isRequired,
    removeBeneficiariesUsers: PropTypes.func.isRequired,
  };

  static defaultProps = {
    percent: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      percent: this.props.percent,
    };
  }

  handlePercentChange = percent => {
    const { percentMax } = this.props;
    const percentValue = percent < percentMax ? percent : percentMax;

    this.setState({ percent: percentValue });
  };

  handleAfterPercentChange = percent => {
    const { objName, onBenefPercentChange } = this.props;

    onBenefPercentChange(objName, percent);
  };

  handleClearSearchData = () => {
    this.props.removeBeneficiariesUsers(this.props.objName);
  };

  render() {
    const { percent } = this.state;
    const { index, objName } = this.props;

    return (
      <div key={index} className="beneficiaries-weights__item">
        <div className="beneficiaries-weights__item-title">
          <div className="beneficiaries-item-name">{`${objName} ${percent}%`}</div>
          {index > 0 && (
            <Icon
              type="close-circle"
              style={{ fontSize: '12px' }}
              theme="filled"
              onClick={this.handleClearSearchData}
            />
          )}
        </div>
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

const BeneficiariesWeights = ({ intl, isLinkedObjectsValid }) => {
  const [weightBuffer, setWeightBuffer] = useState(100);
  const { background } = useWebsiteColor();
  const isGuest = useSelector(isGuestUser);
  const hiveBeneficiaryAccount = useSelector(getHiveBeneficiaryAccount);
  let user = useSelector(getAuthenticatedUser);

  if (hiveBeneficiaryAccount && isGuest) {
    user = { name: hiveBeneficiaryAccount };
  }

  const beneficiariesUsers = useSelector(getBeneficiariesUsers)?.filter(
    i => i.account !== user.name,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setWeightBuffer(beneficiariesUsers.reduce((res, curr) => res - curr.weight / 100, 100));
  }, [beneficiariesUsers]);

  const onBenefPercentChange = (objName, percent) => {
    dispatch(updateBeneficiariesUsers({ name: objName, percent }));
  };

  const onRemoveBeneficiariesUsers = objName => {
    dispatch(removeBeneficiariesUsers(objName));
  };

  return (
    <div className="beneficiaries-weights">
      <div className="title">
        {intl.formatMessage({ id: 'beneficiaries-weights', defaultMessage: 'Beneficiaries' })}
      </div>
      <BeneficiariesFindUsers
        intl={intl}
        filterOption={(value, opt) =>
          ![user.name, ...beneficiariesUsers?.map(i => i.account)].includes(opt.props.label)
        }
      />
      <div className="beneficiaries-weights__header">
        <div className="user">{`${user.name} ${weightBuffer}%`}</div>
        <div
          className={classNames('weight-buffer', {
            'validation-error': !isLinkedObjectsValid && weightBuffer > 0,
          })}
          title={intl.formatMessage({
            id: 'linked_objects_remaining',
            defaultMessage: 'Remaining',
          })}
        >
          <Progress
            status="active"
            showInfo={false}
            percent={weightBuffer}
            strokeWidth={5}
            strokeColor={background}
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
      {beneficiariesUsers?.map((obj, index) => (
        <BeneficiariesWeight
          key={obj.account}
          index={index}
          objName={obj.account}
          percent={obj.weight / 100}
          percentMax={obj.weight / 100 + weightBuffer}
          onBenefPercentChange={onBenefPercentChange}
          removeBeneficiariesUsers={onRemoveBeneficiariesUsers}
        />
      ))}
    </div>
  );
};

BeneficiariesWeights.propTypes = {
  intl: PropTypes.shape().isRequired,
  isLinkedObjectsValid: PropTypes.bool,
};

BeneficiariesWeights.defaultProps = {
  isLinkedObjectsValid: true,
};

export default BeneficiariesWeights;
