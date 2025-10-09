import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Form } from 'antd';
import { useSelector } from 'react-redux';
import { isEmpty, debounce } from 'lodash';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import RawSlider from '../components/Slider/RawSlider';
import USDDisplay from '../components/Utils/USDDisplay';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  isGuestUser,
} from '../../store/authStore/authSelectors';
import { checkUserInObjWhiteList, getUserVoteValueInWaiv } from '../../waivioApi/ApiClient';
import { getVotePercent } from '../../store/settingsStore/settingsSelectors';
import { fixedNumber } from '../../common/helpers/parser';

import './LikeSection.less';

const LikeSection = props => {
  const [sliderVisible, setSliderVisible] = useState();
  const [voteWorth, setVoteWorth] = useState();
  const [votePercent, setVotePercent] = useState();
  const [inWhiteList, setInWhiteList] = useState(false);
  const [minVotePersent, setMinVotePersent] = useState(0);
  const user = useSelector(getAuthenticatedUser);
  const authUser = useSelector(getAuthenticatedUserName);
  const defaultPercent = useSelector(getVotePercent);
  const isGuest = useSelector(isGuestUser);
  const { form, intl, disabled } = props;

  const littleVotePower = inWhiteList || isGuest ? false : voteWorth < 0.0001;

  useEffect(() => {
    if (!isGuest) {
      checkUserInObjWhiteList(authUser).then(res => {
        const minWeight = res.minWeight ? res.minWeight / 100 : defaultPercent;

        setInWhiteList(res.result);
        setMinVotePersent(minWeight);
        setVotePercent(minWeight);
      });
    } else {
      setMinVotePersent(defaultPercent);
      setVotePercent(defaultPercent);
    }
  }, []);

  useEffect(() => {
    if (votePercent && !isGuest) calculateVoteWorth(votePercent);
  }, [votePercent, props.selectedType]);

  const calculateVoteWorth = async value => {
    const { onVotePercentChange, selectedType } = props;

    if (isEmpty(selectedType)) return;

    const voteValue = await getUserVoteValueInWaiv(user.name, value);
    const roundVoteWorth = fixedNumber(voteValue, voteValue >= 0.0001 ? 4 : 6);

    setVoteWorth(roundVoteWorth);
    onVotePercentChange(value, roundVoteWorth);
    if (!isGuest && props.setLittleVotePower)
      props.setLittleVotePower(inWhiteList || isGuest ? false : voteValue < 0.0001);
  };

  const changeVotePercent = useCallback(
    debounce(value => setVotePercent(value), 300),
    [],
  );

  const handleLikeClick = () => setSliderVisible(!sliderVisible);

  const formatTip = value => (
    <div>
      <FormattedNumber
        style="percent" // eslint-disable-line react/style-prop-object
        value={value / 100}
      />
      <span style={{ opacity: '0.5' }}>
        {' '}
        <USDDisplay value={voteWorth} />
      </span>
    </div>
  );

  const likePrice = Number(voteWorth) || '0.0001';

  return (
    <div className="LikeSection">
      <Form.Item className="like-form">
        {form.getFieldDecorator('like', {
          valuePropName: 'checked',
          initialValue: true,
          rules: [
            {
              required: true,
              transform: value => value || undefined,
              type: 'boolean',
              message: intl.formatMessage({
                id: 'need_like',
                defaultMessage: 'Field is required',
              }),
            },
          ],
        })(
          <Checkbox onChange={handleLikeClick} disabled={disabled}>
            {intl.formatMessage({ id: 'like', defaultMessage: 'Like' })}
          </Checkbox>,
        )}
      </Form.Item>
      {form.getFieldValue('like') && (
        <React.Fragment>
          <div className="like-slider">
            <RawSlider
              min={1}
              initialValue={minVotePersent}
              onChange={changeVotePercent}
              disabled={disabled}
              tipFormatter={formatTip}
            />
          </div>
          <div className="like-worth">
            <FormattedMessage
              id="vote_worth"
              defaultMessage="Vote worth {value}"
              values={{
                value: likePrice,
              }}
            />
          </div>
        </React.Fragment>
      )}

      <div className="warning-wrapper">
        <FormattedMessage
          id="warning_message"
          defaultMessage="Object updates are posted by Waivio Bots in order to avoid technical posts in user feeds and spending limited resource credits on multiple posts by users, authors are required to upvote updates with voting power that should generate an equivalent of at least $0.0001 to ensure validity of the posted content. Users receive 70% of author rewards in addition to standard curation rewards."
        />
      </div>
      {littleVotePower && !isGuest && (
        <div
          style={{
            color: 'red',
            textAlign: 'center',
            paddingTop: '10px',
          }}
        >
          {intl.formatMessage({
            id: 'error_vote_less',
            defaultMessage: 'Your vote is less than $0.0001 in WAIV token.',
          })}
        </div>
      )}
    </div>
  );
};

LikeSection.propTypes = {
  form: PropTypes.shape().isRequired,
  onVotePercentChange: PropTypes.func.isRequired,
  setLittleVotePower: PropTypes.func,
  disabled: PropTypes.bool,
  intl: PropTypes.shape().isRequired,
  selectedType: PropTypes.shape({
    author: PropTypes.string,
    author_permlink: PropTypes.string,
    permlink: PropTypes.string,
  }),
};

LikeSection.defaultProps = {
  selectedType: {},
  disabled: false,
};

export default injectIntl(LikeSection);
