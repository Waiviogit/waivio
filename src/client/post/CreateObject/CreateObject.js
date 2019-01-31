import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Form, Input, Select, Button } from 'antd';
import './CreateObject.less';
import LANGUAGES from '../../translations/languages';
import { getLanguageText } from '../../translations';
import { objectFields } from '../../../common/constants/listOfFields';
import LikeSection from '../../object/LikeSection';
import { getHasDefaultSlider, getVoteValue } from '../../helpers/user';
import {
  getAuthenticatedUser,
  getRate,
  getRewardFund,
  getVotePercent,
  getVotingPower,
} from '../../reducers';

@connect(state => ({
  rewardFund: getRewardFund(state),
  rate: getRate(state),
  defaultVotePercent: getVotePercent(state),
  user: getAuthenticatedUser(state),
  sliderMode: getVotingPower(state),
}))
@injectIntl
@Form.create()
class CreateObject extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    handleCreateObject: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    currentLocaleInList: PropTypes.shape().isRequired,
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    defaultVotePercent: PropTypes.number,
    user: PropTypes.shape(),
    rewardFund: PropTypes.shape(),
    rate: PropTypes.number,
  };

  static defaultProps = {
    currentLocaleInList: { id: 'en-US', name: '', nativeName: '' },
    wobject: { tag: '' },
    handleCreateObject: () => {},
    toggleModal: () => {},
    sliderMode: 'auto',
    defaultVotePercent: 100,
    user: {},
    rewardFund: {},
    rate: 1,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      votePercent: this.props.defaultVotePercent / 100,
      voteWorth: 0,
      sliderVisible: false,
    };
  }

  componentDidMount = () => {
    const { sliderMode, user } = this.props;
    if (sliderMode === 'on' || (sliderMode === 'auto' && getHasDefaultSlider(user))) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err && !this.state.loading) {
        this.setState({ loading: true });
        const objData = values;
        objData.id = objData.name;
        objData.isExtendingOpen = true;
        objData.isPostingOpen = true;
        objData.votePercent = this.state.votePercent * 100;
        this.props.handleCreateObject(objData);
        _.delay(this.props.toggleModal, 2500);
      }
    });
  };

  handleVotePercentChange = value => {
    const { user, rewardFund, rate } = this.props;
    const voteWorth = getVoteValue(
      user,
      rewardFund.recent_claims,
      rewardFund.reward_balance,
      rate,
      value * 100,
    );
    this.setState({ votePercent: value, voteWorth });
  };

  handleLikeClick = () => {
    const { sliderMode, user } = this.props;
    if (sliderMode === 'on' || (sliderMode === 'auto' && getHasDefaultSlider(user))) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    }
  };

  render() {
    const languageOptions = [];
    const { getFieldDecorator } = this.props.form;
    const { currentLocaleInList, intl, form } = this.props;

    if (currentLocaleInList === 'auto') {
      languageOptions.push(
        <Select.Option disabled key="auto" value="auto">
          {intl.formatMessage({ id: 'select_language', defaultMessage: 'Select language' })}
        </Select.Option>,
      );
    }

    LANGUAGES.forEach(lang => {
      languageOptions.push(
        <Select.Option key={lang.id} value={lang.id}>
          {getLanguageText(lang)}
        </Select.Option>,
      );
    });

    return (
      <React.Fragment>
        <Form.Item>
          {getFieldDecorator(objectFields.name, {
            initialValue: '',
            rules: [
              {
                max: 100,
                message: intl.formatMessage(
                  {
                    id: 'value_error_long',
                    defaultMessage: "Name can't be longer than 100 characters.",
                  },
                  { value: 100 },
                ),
              },
              {
                required: true,
                message: intl.formatMessage({
                  id: 'name_required',
                  defaultMessage: 'Please enter name for new object',
                }),
              },
            ],
          })(
            <Input
              className="Editor__title"
              placeholder={intl.formatMessage({
                id: 'value_placeholder',
                defaultMessage: 'Add value',
              })}
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('locale', {
            initialValue: this.props.currentLocaleInList.id,
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'validation_locale',
                  defaultMessage: 'Please select your locale!',
                }),
              },
            ],
          })(<Select style={{ width: '100%' }}>{languageOptions}</Select>)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'validation_object_type',
                  defaultMessage: 'Please select object type!',
                }),
              },
              {
                max: 100,
                message: intl.formatMessage(
                  {
                    id: 'value_error_long',
                    defaultMessage: "Name can't be longer than 100 characters.",
                  },
                  { value: 100 },
                ),
              },
            ],
          })(
            <Input
              className="Editor__title"
              placeholder={intl.formatMessage({
                id: 'placeholder_obj_type',
                defaultMessage: 'Object type',
              })}
            />,
            <Select
              style={{ width: '100%' }}
              placeholder={intl.formatMessage({
                id: 'placeholder_obj_type',
                defaultMessage: 'Select a option and change input text above',
              })}
              onChange={this.handleSelectChange}
            >
              <Select.Option value="item">item</Select.Option>
              <Select.Option value="catalogue">catalogue</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <LikeSection
          handleVotePercentChange={this.handleVotePercentChange}
          votePercent={this.state.votePercent}
          voteWorth={this.state.voteWorth}
          form={form}
          sliderVisible={this.state.sliderVisible}
          onChange={this.handleLikeClick}
        />
        <Form.Item className="Editor__bottom__submit">
          <Button type="primary" onClick={this.handleSubmit} loading={this.state.loading}>
            {intl.formatMessage({ id: 'confirm', defaultMessage: 'Confirm' })}
          </Button>
        </Form.Item>
      </React.Fragment>
    );
  }
}

export default CreateObject;
