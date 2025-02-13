import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';
import { throttle } from 'lodash';
import { setUpdatedEditorData } from '../../../store/slateEditorStore/editorActions';
import BodyContainer from '../../containers/Story/BodyContainer';
import TagsSelector from '../../components/TagsSelector/TagsSelector';
import PolicyConfirmation from '../../components/PolicyConfirmation/PolicyConfirmation';
import AdvanceSettings from './AdvanceSettings';
import CheckReviewModal from '../CheckReviewModal/CheckReviewModal';
import { isContentValid } from '../../../common/helpers/postHelpers';
import { rewardsValues } from '../../../common/constants/rewards';
import BBackTop from '../../components/BBackTop';
import { clearBeneficiariesUsers } from '../../../store/searchStore/searchActions';
import { getConfigurationValues } from '../../../store/appStore/appSelectors';
import { getObjectName } from '../../../common/helpers/wObjectHelper';

import './PostPreviewModal.less';

const isTopicValid = topic => /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(topic);

@injectIntl
@connect(
  state => ({
    defaultHashtag: getObjectName(getConfigurationValues(state)?.defaultHashtag),
  }),
  { clearBeneficiariesUsers, setUpdatedEditorData },
)
class PostPreviewModal extends Component {
  // eslint-disable-next-line consistent-return
  static findScrollElement() {
    if (typeof document !== 'undefined') {
      return document.querySelector('.post-preview-modal');
    }
  }

  static propTypes = {
    intl: PropTypes.shape(),
    isPublishing: PropTypes.bool,
    settings: PropTypes.shape({
      reward: PropTypes.oneOf([rewardsValues.none, rewardsValues.half, rewardsValues.all]),
      beneficiary: PropTypes.bool,
      upvote: PropTypes.bool,
    }),
    content: PropTypes.string,
    topics: PropTypes.arrayOf(PropTypes.string),
    linkedObjects: PropTypes.arrayOf(PropTypes.shape()),
    reviewData: PropTypes.shape({
      reviewer: PropTypes.shape(),
      campaign: PropTypes.shape(),
      requirements: PropTypes.shape(),
    }),
    isUpdating: PropTypes.bool,
    objPercentage: PropTypes.shape(),
    setUpdatedEditorData: PropTypes.func.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    setObjPercent: PropTypes.func,
    isGuest: PropTypes.bool,
    clearBeneficiariesUsers: PropTypes.func.isRequired,
    titleValue: PropTypes.string,
    defaultHashtag: PropTypes.string,
  };
  static defaultProps = {
    intl: {},
    isPublishing: false,
    linkedObjects: [],
    topics: [],
    objPercentage: {},
    reviewData: null,
    isUpdating: false,
    isGuest: false,
    titleValue: '',
    content: '',
    settings: {
      reward: rewardsValues.none,
      beneficiary: false,
      upvote: false,
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      body: '',
      isConfirmed: false,
      isCheckReviewModalOpen: false,
      isReviewValid: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.isModalOpen ||
      this.state.isModalOpen ||
      isContentValid(this.props.content) !== isContentValid(nextProps.content) ||
      nextProps.content ||
      nextProps.titleValue
    );
  }

  onUpdate = () => {
    throttle(this.throttledUpdate, 200, { leading: false, trailing: true })();
  };

  throttledUpdate = () => {
    const { body } = this.state;
    const { topics, settings, titleValue, linkedObjects } = this.props;
    const postData = {
      body,
      titleValue,
      topics,
      linkedObjects,
      ...settings,
    };

    this.props.onUpdate(postData);
  };

  showModal = () => {
    this.setState({
      isModalOpen: true,
      body: this.props.content,
    });
  };

  hideModal = () => {
    if (!this.props.isPublishing) {
      this.setState({ isModalOpen: false });
      this.props.clearBeneficiariesUsers();
    }
  };

  hideCheckReviewModal = () => this.setState({ isCheckReviewModalOpen: false });

  showEditor = () => this.setState({ isCheckReviewModalOpen: false, isModalOpen: false });

  handleConfirmedChange = isConfirmed => this.setState({ isConfirmed });

  handleSettingsChange = updatedValue => this.props.onSettingsChange(updatedValue);

  handleTopicsChange = topics => this.props.setUpdatedEditorData({ topics });

  handlePercentChange = (objId, percent) => {
    const { objPercentage } = this.props;
    const nextObjPercentage = {
      ...objPercentage,
      [objId]: { percent },
    };

    this.props.setObjPercent(nextObjPercentage);
  };

  handleReviewSubmit = () => {
    if (typeof window !== 'undefined' && window.gtag)
      window.gtag('event', 'posted_review', { debug_mode: false });

    this.setState({ isCheckReviewModalOpen: false }, this.props.onSubmit);
  };

  handleSubmit = () => {
    try {
      if (this.props.reviewData && !this.props.isUpdating) {
        this.setState({ isCheckReviewModalOpen: true });
      } else {
        this.props.onSubmit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { body, isConfirmed, isModalOpen } = this.state;
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
      isGuest,
      titleValue,
      defaultHashtag,
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
            {!isModalOpen && !isPublishing && (
              <BBackTop isModal target={PostPreviewModal.findScrollElement} />
            )}
            <h1 className="StoryFull__title preview">{titleValue}</h1>
            <BodyContainer full body={body} isPostPreviewModal />
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
              defaultHashtag={defaultHashtag}
            />
            <div className="hashtag-waivio">
              {intl.formatMessage({
                id: 'hashtag_waivio',
                defaultMessage:
                  'Please note that the hashtag #waivio will be added to the post to allow for WAIV token rewards.',
              })}
            </div>

            <PolicyConfirmation
              className="post-preview-legal-notice"
              isChecked={isConfirmed}
              disabled={isPublishing}
              checkboxLabel={intl.formatMessage({
                id: 'legal_notice',
                defaultMessage: 'Legal notice',
              })}
              policyText={intl.formatMessage({
                id: 'legal_notice_create_post',
                defaultMessage:
                  '"I understand that this post will be published on the Hive social blockchain and that it could be reproduced on many websites around the world. I also acknowledge that the content and images in this post do not infringe the rights of other parties."',
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
                isGuest={isGuest}
              />
            )}
            <div className="edit-post-controls">
              <Button
                className="edit-post__submit-btn edit-post-controls__publish-ready-btn"
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
        {reviewData?.requirements && this.state.isCheckReviewModalOpen && (
          <CheckReviewModal
            tags={topics}
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
            disabled={!content || !titleValue}
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
