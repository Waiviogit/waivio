import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Modal } from 'antd';
import { throttle } from 'lodash';
import BodyContainer from '../../containers/Story/BodyContainer';
import TagsSelector from '../../components/TagsSelector/TagsSelector';
import PolicyConfirmation from '../../components/PolicyConfirmation/PolicyConfirmation';
import AdvanceSettings from './AdvanceSettings';
import CheckReviewModal from '../CheckReviewModal/CheckReviewModal';
import { isContentValid, splitPostContent } from '../../helpers/postHelpers';
import { rewardsValues } from '../../../common/constants/rewards';
import BBackTop from '../../components/BBackTop';
import './PostPreviewModal.less';

const isTopicValid = topic => /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(topic);

@injectIntl
class PostPreviewModal extends Component {
  static findScrollElement() {
    return document.querySelector('.post-preview-modal');
  }

  static propTypes = {
    intl: PropTypes.shape(),
    isPublishing: PropTypes.bool,
    settings: PropTypes.shape({
      reward: PropTypes.oneOf([rewardsValues.none, rewardsValues.half, rewardsValues.all]),
      beneficiary: PropTypes.bool,
      upvote: PropTypes.bool,
    }).isRequired,
    content: PropTypes.string.isRequired,
    topics: PropTypes.arrayOf(PropTypes.string).isRequired,
    linkedObjects: PropTypes.arrayOf(PropTypes.shape()),
    reviewData: PropTypes.shape({
      reviewer: PropTypes.shape(),
      campaign: PropTypes.shape(),
    }),
    isUpdating: PropTypes.bool,
    objPercentage: PropTypes.shape(),
    onTopicsChange: PropTypes.func.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
    onPercentChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  };
  static defaultProps = {
    intl: {},
    isPublishing: false,
    linkedObjects: [],
    objPercentage: {},
    reviewData: null,
    isUpdating: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      title: '',
      body: '',
      isConfirmed: false,
      // Check review modal
      isCheckReviewModalOpen: false,
      isReviewValid: false,
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
    const { postTitle, postBody } = splitPostContent(this.props.content);
    this.setState({
      isModalOpen: true,
      title: postTitle,
      body: postBody,
    });
  };

  hideModal = () => {
    if (!this.props.isPublishing) {
      this.setState({ isModalOpen: false });
    }
  };

  hideCheckReviewModal = () => this.setState({ isCheckReviewModalOpen: false });

  showEditor = () => this.setState({ isCheckReviewModalOpen: false, isModalOpen: false });

  handleConfirmedChange = isConfirmed => this.setState({ isConfirmed });

  handleSettingsChange = updatedValue => this.props.onSettingsChange(updatedValue);

  handleTopicsChange = topics => this.props.onTopicsChange(topics);

  handlePercentChange = (objId, percent) => {
    const { objPercentage, onPercentChange } = this.props;
    const nextObjPercentage = {
      ...objPercentage,
      [objId]: { percent },
    };
    onPercentChange(nextObjPercentage);
  };

  handleReviewSubmit = () => {
    this.setState({ isCheckReviewModalOpen: false }, this.props.onSubmit);
  };

  handleSubmit = () => {
    if (this.props.reviewData) {
      this.setState({ isCheckReviewModalOpen: true });
    } else {
      this.props.onSubmit();
    }
  };

  render() {
    const { body, isConfirmed, isModalOpen, title } = this.state;
    const {
      content,
      intl,
      isPublishing,
      isUpdating,
      linkedObjects,
      objPercentage,
      reviewData,
      settings,
      topics,
    } = this.props;
    return (
      <React.Fragment>
        {isModalOpen && (
          <Modal
            centered={false}
            closable
            confirmLoading={false}
            footer={null}
            maskClosable={false}
            style={{ top: 0 }}
            title={intl.formatMessage({ id: 'preview', defaultMessage: 'Preview' })}
            visible={isModalOpen}
            width={800}
            wrapClassName={`post-preview-modal${isPublishing ? ' publishing' : ''}`}
            zIndex={1500}
            onCancel={this.hideModal}
          >
            <BBackTop isModal target={PostPreviewModal.findScrollElement} />
            <h1 className="StoryFull__title preview">{title}</h1>
            <BodyContainer full body={body} />
            <TagsSelector
              className="post-preview-topics"
              disabled={isPublishing}
              label={intl.formatMessage({
                id: 'topics',
                defaultMessage: 'HashTags(topics)',
              })}
              placeholder={intl.formatMessage({
                id: 'topics_placeholder',
                defaultMessage: 'Add hashtags (without #) here',
              })}
              tags={topics}
              validator={isTopicValid}
              onChange={this.handleTopicsChange}
            />
            <PolicyConfirmation
              className="post-preview-legal-notice"
              isChecked={isConfirmed}
              disabled={isPublishing}
              checkboxLabel="Legal notice"
              policyText={intl.formatMessage({
                id: 'legal_notice_create_post',
                defaultMessage:
                  '"I understand that this post will be published on the Steem social blockchain and that it could be reproduced on many websites around the world. I also acknowledge that the content and images in this post do not infringe the rights of other parties."',
              })}
              onChange={this.handleConfirmedChange}
            />
            {!isUpdating && (
              <AdvanceSettings
                linkedObjects={linkedObjects}
                objPercentage={objPercentage}
                settings={settings}
                onSettingsChange={this.handleSettingsChange}
                onPercentChange={this.handlePercentChange}
              />
            )}
            <div className="edit-post-controls">
              <Button
                className="edit-post__submit-btn"
                disabled={!isConfirmed}
                htmlType="submit"
                loading={isPublishing}
                size="large"
                onClick={this.handleSubmit}
              >
                {intl.formatMessage({ id: 'publish', defaultMessage: 'Publish' })}
              </Button>
            </div>
          </Modal>
        )}
        {reviewData && (
          <CheckReviewModal
            intl={intl}
            isCheckReviewModalOpen={this.state.isCheckReviewModalOpen}
            isReviewValid={this.state.isReviewValid}
            linkedObjects={linkedObjects}
            postBody={body}
            reviewData={reviewData}
            onCancel={this.hideCheckReviewModal}
            onEdit={this.showEditor}
            onSubmit={this.handleReviewSubmit}
          />
        )}
        <div className="edit-post-controls">
          <Button
            htmlType="button"
            disabled={!content || !isContentValid(content)}
            onClick={this.showModal}
            size="large"
            className="edit-post-controls__publish-ready-btn"
          >
            {intl.formatMessage({ id: 'ready_to_publish', defaultMessage: 'Ready to publish' })}
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default PostPreviewModal;
