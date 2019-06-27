import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Form, Icon, message } from 'antd';
import { isEmpty, isEqual } from 'lodash';
import Editor from '../../components/EditorExtended/EditorExtended';
import BodyContainer from '../../containers/Story/BodyContainer';
import toMarkdown from '../../components/EditorExtended/util/editorStateToMarkdown';
import LikeSection from '../LikeSection';
import FollowObjectForm from '../FollowObjectForm';
import { getFieldWithMaxWeight } from '../wObjectHelper';
import { getAppendData } from '../../helpers/wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import { splitPostContent } from '../../helpers/postHelpers';
import { appendObject } from '../appendActions';
import { getFollowingObjectsList, getIsAppendLoading, getLocale } from '../../reducers';
import IconButton from '../../components/IconButton';
import './ObjectOfTypePage.less';

@injectIntl
@Form.create()
@connect(
  state => ({
    locale: getLocale(state),
    isAppending: getIsAppendLoading(state),
    followingList: getFollowingObjectsList(state),
  }),
  {
    appendPageContent: appendObject,
  },
)
class ObjectOfTypePage extends Component {
  static propTypes = {
    /* decorators */
    form: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,

    /* connect */
    locale: PropTypes.string,
    isAppending: PropTypes.bool,
    appendPageContent: PropTypes.func.isRequired,
    followingList: PropTypes.arrayOf(PropTypes.string),

    /* passed */
    wobject: PropTypes.shape(),
    isEditMode: PropTypes.bool.isRequired,
    userName: PropTypes.string.isRequired,
    toggleViewEditMode: PropTypes.func.isRequired,
  };

  static defaultProps = {
    wobject: {},
    isAppending: false,
    locale: 'en-US',
    followingList: [],
  };

  constructor(props) {
    super(props);

    this.currentPageContent = getFieldWithMaxWeight(props.wobject, objectFields.pageContent);
    this.state = {
      content: this.currentPageContent,
      editorInitContent: this.currentPageContent,
      isReadyToPublish: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.wobject) && !isEqual(nextProps.wobject, this.props.wobject)) {
      this.currentPageContent = getFieldWithMaxWeight(nextProps.wobject, objectFields.pageContent);
      this.setState({
        editorInitContent: this.currentPageContent,
      });
    }
  }

  handleChangeContent = contentRaw => {
    const content = toMarkdown(contentRaw);
    this.setState({ content });
  };

  handleVotePercentChange = votePercent => this.setState({ votePercent });

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      const { appendPageContent, locale, wobject, userName, intl, toggleViewEditMode } = this.props;
      const { votePercent } = this.state;
      const { follow } = values;
      if (!err) {
        const { postTitle, postBody } = splitPostContent(this.state.content);
        const pageContentField = {
          name: objectFields.pageContent,
          body: `${postTitle}\n${postBody}`,
          locale,
        };
        const postData = getAppendData(userName, wobject, '', pageContentField);
        appendPageContent(postData, { follow, votePercent: votePercent * 100 })
          .then(() => {
            message.success(
              intl.formatMessage(
                {
                  id: 'added_field_to_wobject',
                  defaultMessage: `You successfully have added the {field} field to {wobject} object`,
                },
                {
                  field: objectFields.pageContent,
                  wobject: getFieldWithMaxWeight(wobject, objectFields.name),
                },
              ),
            );
            toggleViewEditMode();
          })
          .catch(error => {
            console.log('err > ', error);
            message.error(
              intl.formatMessage({
                id: 'couldnt_append',
                defaultMessage: "Couldn't add the field to object.",
              }),
            );
          });
      }
    });
  };

  handleReadyPublishClick = e => {
    e.preventDefault();
    this.setState(prevState => ({
      isReadyToPublish: !prevState.isReadyToPublish,
      editorInitContent: prevState.content,
    }));
  };

  render() {
    const { intl, form, isEditMode, isAppending, locale, wobject, followingList } = this.props;
    const { isReadyToPublish, content, editorInitContent } = this.state;

    return (
      <React.Fragment>
        <div
          className={`object-of-type-page ${
            isEditMode && !isReadyToPublish ? 'edit' : 'view'
          }-mode`}
        >
          {isEditMode ? (
            <React.Fragment>
              {isReadyToPublish ? (
                <div className="object-page-preview">
                  <div className="object-page-preview__header">
                    <div>Preview</div>
                    <IconButton
                      className="object-page-preview__close-btn"
                      disabled={isAppending}
                      icon={<Icon type="close" />}
                      onClick={this.handleReadyPublishClick}
                    />
                  </div>
                  <BodyContainer full body={content} />
                  <div className="object-page-preview__options">
                    <LikeSection form={form} onVotePercentChange={this.handleVotePercentChange} />
                    {followingList.includes(wobject.author_permlink) ? null : (
                      <FollowObjectForm form={form} />
                    )}
                  </div>
                  <div className="object-of-type-page__row align-center">
                    <Button
                      htmlType="submit"
                      disabled={form.getFieldError('like')}
                      loading={isAppending}
                      onClick={this.handleSubmit}
                      size="large"
                    >
                      {intl.formatMessage({ id: 'append_send', defaultMessage: 'Submit' })}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="object-of-type-page__editor-wrapper">
                  <Editor
                    enabled={!isAppending}
                    withTitle={false}
                    initialContent={{ body: editorInitContent }}
                    locale={locale === 'auto' ? 'en-US' : locale}
                    onChange={this.handleChangeContent}
                  />
                </div>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {this.currentPageContent ? (
                <BodyContainer full body={this.currentPageContent} />
              ) : (
                <div className="object-of-type-page__empty-placeholder">
                  <span>
                    {intl.formatMessage({
                      id: 'empty_object_profile',
                      defaultMessage: "This object doesn't have any",
                    })}
                  </span>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
        {isEditMode && !isReadyToPublish && (
          <div className="object-of-type-page__row align-center">
            <Button
              htmlType="button"
              disabled={!content || content === this.currentPageContent}
              onClick={this.handleReadyPublishClick}
              size="large"
            >
              {intl.formatMessage({ id: 'ready_to_publish', defaultMessage: 'Ready to publish' })}
            </Button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ObjectOfTypePage;
