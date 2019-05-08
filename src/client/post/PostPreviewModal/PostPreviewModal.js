import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Modal } from 'antd';
import { throttle, isEmpty } from 'lodash';
import BodyContainer from '../../containers/Story/BodyContainer';
import TagsSelector from '../../components/TagsSelector/TagsSelector';
import PolicyConfirmation from '../../components/PolicyConfirmation/PolicyConfirmation';
import AdvanceSettings from './AdvanceSettings';
import { isContentValid, splitPostContent } from '../../helpers/postHelpers';
import { handleWeightChange, setObjPercents } from '../../helpers/wObjInfluenceHelper';
import { rewardsValues } from '../../../common/constants/rewards';
import BBackTop from '../../components/BBackTop';
import './PostPreviewModal.less';
import PostChart from '../../../investarena/components/PostChart';
import { getForecastObject } from '../../../investarena/components/CreatePostForecast/helpers';

const isTopicValid = topic => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(topic);

@injectIntl
class PostPreviewModal extends Component {
  static propTypes = {
    intl: PropTypes.shape(),
    settings: PropTypes.shape({
      reward: PropTypes.oneOf([rewardsValues.none, rewardsValues.half, rewardsValues.all]),
      beneficiary: PropTypes.bool,
      upvote: PropTypes.bool,
    }).isRequired,
    content: PropTypes.string.isRequired,
    topics: PropTypes.arrayOf(PropTypes.string).isRequired,
    linkedObjects: PropTypes.arrayOf(PropTypes.shape()),
    forecastValues: PropTypes.shape(),
    objPercentage: PropTypes.shape(),
    onTopicsChange: PropTypes.func.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
    onPercentChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onReadyBtnClick: PropTypes.func,
  };
  static defaultProps = {
    intl: {},
    linkedObjects: [],
    forecastValues: {},
    objPercentage: {},
    onReadyBtnClick: () => {},
  };

  static findScrollElement() {
    return document.querySelector('.post-preview-modal');
  }

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      title: '',
      body: '',
      objPercentage: setObjPercents(props.linkedObjects, props.objPercentage),
      weightBuffer: 0,
      isConfirmed: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.isModalOpen ||
      this.state.isModalOpen ||
      isContentValid(this.props.content) !== isContentValid(nextProps.content)
    );
  }

  onUpdate = () => {
    throttle(this.throttledUpdate, 200, { leading: false, trailing: true })();
  };

  throttledUpdate = () => {
    const { body, title, linkedObjects } = this.state;
    const { topics, settings } = this.props;
    const postData = {
      body,
      title,
      topics,
      linkedObjects,
      ...settings,
    };
    this.props.onUpdate(postData);
  };

  showModal = () => {
    const { forecastValues } = this.props;
    this.props.onReadyBtnClick();
    if (forecastValues && forecastValues.isValid) {
      const { postTitle, postBody } = splitPostContent(this.props.content);
      const objPercentage = setObjPercents(this.props.linkedObjects, this.props.objPercentage);
      this.setState({
        isModalOpen: true,
        title: postTitle,
        body: postBody,
        weightBuffer: 0,
        objPercentage,
      });
    }
  };

  hideModal = () => this.setState({ isModalOpen: false });

  handleConfirmedChange = isConfirmed => this.setState({ isConfirmed });

  handleSettingsChange = updatedValue => this.props.onSettingsChange(updatedValue);

  handleTopicsChange = topics => this.props.onTopicsChange(topics);

  handlePercentChange = (objId, percent) => {
    const { objPercentage, weightBuffer } = this.state;
    const nextState = handleWeightChange(objPercentage, objId, percent, weightBuffer);
    this.setState(nextState);
    if (weightBuffer === 0) this.props.onPercentChange(nextState.objPercentage);
  };

  handleSubmit = () => this.props.onSubmit();

  render() {
    const { isModalOpen, isConfirmed, body, title, weightBuffer, objPercentage } = this.state;
    const { intl, content, topics, linkedObjects, settings, forecastValues } = this.props;
    const { selectForecast, ...forecastRaw } = forecastValues;
    const forecast = getForecastObject(forecastRaw, selectForecast);
    return (
      <React.Fragment>
        {isModalOpen && (
          <Modal
            title={intl.formatMessage({ id: 'preview', defaultMessage: 'Preview' })}
            style={{ top: 0 }}
            visible={isModalOpen}
            centered={false}
            closable
            confirmLoading={false}
            wrapClassName="post-preview-modal"
            width={800}
            footer={null}
            onCancel={this.hideModal}
            maskStyle={{ 'z-index': '1500' }}
            maskClosable={false}
          >
            <BBackTop isModal target={PostPreviewModal.findScrollElement} />
            <h1 className="StoryFull__title preview">{title}</h1>
            <BodyContainer full body={body} />
            {!isEmpty(forecast) && (
              <PostChart
                quoteSecurity={forecast.quoteSecurity}
                createdAt={forecast.createdAt}
                forecast={forecast.expiredAt}
                recommend={forecast.recommend}
                toggleModalPost={() => {}}
                tpPrice={forecast.tpPrice ? forecast.tpPrice.toString() : null}
                slPrice={forecast.slPrice ? forecast.slPrice.toString() : null}
                expForecast={null}
              />
            )}
            <TagsSelector
              className="post-preview-topics"
              label={intl.formatMessage({
                id: 'topics',
                defaultMessage: 'Topics',
              })}
              placeholder={intl.formatMessage({
                id: 'topics_placeholder',
                defaultMessage: 'Add story topics here',
              })}
              tags={topics}
              validator={isTopicValid}
              onChange={this.handleTopicsChange}
            />
            <PolicyConfirmation
              className="post-preview-legal-notice"
              isChecked={isConfirmed}
              checkboxLabel="Legal notice"
              policyText="Lorem ipsum dolor sit amet, enim in ut adipiscing turpis, mi interdum faucibus eleifend montes, augue viverra commodo vel placerat. Neque vitae amet consequat, proin sociis in sem, nunc fusce a facilisi per, sed sit et eget. A morbi velit proin, elit ac integer in justo, enim quis arcu arcu, magna dapibus est etiam. Nisl dapibus ut leo semper, pellentesque nec sem nec nulla, convallis dictum odio porttitor."
              onChange={this.handleConfirmedChange}
            />
            <AdvanceSettings
              linkedObjects={linkedObjects}
              objPercentage={objPercentage}
              weightBuffer={weightBuffer}
              settings={settings}
              onSettingsChange={this.handleSettingsChange}
              onPercentChange={this.handlePercentChange}
            />
            <div className="edit-post-controls">
              <Button
                htmlType="submit"
                onClick={this.handleSubmit}
                size="large"
                disabled={!isConfirmed}
                className="edit-post__submit-btn"
              >
                {intl.formatMessage({ id: 'publish', defaultMessage: 'Publish' })}
              </Button>
            </div>
          </Modal>
        )}
        {content && isContentValid(content) ? (
          <div className="edit-post-controls">
            <Button
              htmlType="button"
              onClick={this.showModal}
              size="large"
              className="edit-post-controls__publish-ready-btn"
            >
              {intl.formatMessage({ id: 'ready_to_publish', defaultMessage: 'Ready to publish' })}
            </Button>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default PostPreviewModal;
