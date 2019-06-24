import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Col, Form, message, Row } from 'antd';
import { isEmpty, isEqual } from 'lodash';
import Editor from '../../components/EditorExtended/EditorExtended';
import BodyContainer from '../../containers/Story/BodyContainer';
import toMarkdown from '../../components/EditorExtended/util/editorStateToMarkdown';
import LikeSection from '../LikeSection';
import FollowObjectForm from '../FollowObjectForm';
import { getFieldWithMaxWeight, validateContent } from '../wObjectHelper';
import { getAppendData } from '../../helpers/wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import { splitPostContent } from '../../helpers/postHelpers';
import { appendObject } from '../appendActions';
import { getFollowingObjectsList, getIsAppendLoading, getLocale } from '../../reducers';
import './ObjectOfTypePage.less';

export const PageContentPreview = ({ content = { body: '', title: '' } }) => (
  <React.Fragment>
    <h1 className="StoryFull__title preview bread-word">{content.title}</h1>
    <BodyContainer full body={content.body} />
  </React.Fragment>
);
PageContentPreview.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
};

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
    // match: PropTypes.shape().isRequired,
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

    this.postContent = getFieldWithMaxWeight(props.wobject, objectFields.pageContent);
    this.state = {
      initialContent: splitPostContent(this.postContent, { titleKey: 'title', bodyKey: 'body' }),
      isContentValid: false,
      content: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.wobject) && !isEqual(nextProps.wobject, this.props.wobject)) {
      this.postContent = getFieldWithMaxWeight(nextProps.wobject, objectFields.pageContent);
      this.setState({
        initialContent: splitPostContent(this.postContent, { titleKey: 'title', bodyKey: 'body' }),
      });
    }
  }

  handleChangeContent = contentRaw => {
    const content = toMarkdown(contentRaw);
    this.setState({ content, isContentValid: validateContent(content, this.postContent) });
  };

  handleVotePercentChange = votePercent => this.setState({ votePercent });

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      const { appendPageContent, locale, wobject, userName, intl, toggleViewEditMode } = this.props;
      const { isContentValid, votePercent } = this.state;
      const { follow } = values;
      if (!err && isContentValid) {
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

  render() {
    const { intl, isEditMode, isAppending, locale, followingList, wobject } = this.props;
    const { initialContent, isContentValid } = this.state;

    return (
      <div className={`object-of-type-page ${isEditMode ? 'edit' : 'view'}-mode`}>
        {isEditMode && (
          <div className="object-of-type-page__header-controls">
            <Row type="flex" align="middle">
              <Col span={20}>
                <LikeSection
                  form={this.props.form}
                  onVotePercentChange={this.handleVotePercentChange}
                />
                {followingList.includes(wobject.author_permlink) ? null : (
                  <FollowObjectForm form={this.props.form} />
                )}
              </Col>
              <Col span={4} align="middle" justify="center">
                <Form.Item className="object-of-type-page__submit-btn">
                  <Button
                    type="primary"
                    loading={isAppending}
                    disabled={!isContentValid || isAppending}
                    onClick={this.handleSubmit}
                  >
                    <span>{intl.formatMessage({ id: 'submit', defaultMessage: 'Submit' })}</span>
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}
        {isEditMode ? (
          <Editor
            enabled={!isAppending}
            initialContent={this.state.initialContent}
            locale={locale === 'auto' ? 'en-US' : locale}
            onChange={this.handleChangeContent}
          />
        ) : (
          <React.Fragment>
            <PageContentPreview content={initialContent} />
            {!this.postContent && (
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
    );
  }
}

export default ObjectOfTypePage;
