import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Form, Row } from 'antd';
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
import { getIsAppendLoading, getLocale } from '../../reducers';
import './ObjectOfTypePage.less';

@Form.create()
@connect(
  state => ({
    locale: getLocale(state),
    isAppending: getIsAppendLoading(state),
  }),
  {
    appendPageContent: appendObject,
  },
)
class ObjectOfTypePage extends Component {
  static propTypes = {
    /* decorators */
    form: PropTypes.shape().isRequired,

    /* connect */
    locale: PropTypes.string,
    isAppending: PropTypes.bool,
    appendPageContent: PropTypes.func.isRequired,

    /* passed */
    wobject: PropTypes.shape(),
    // match: PropTypes.shape().isRequired,
    isEditMode: PropTypes.bool.isRequired,
    userName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    wobject: {},
    isAppending: false,
    locale: 'en-US',
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
      const { appendPageContent, locale, wobject, userName } = this.props;
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
        appendPageContent(postData, { follow, votePercent: votePercent * 100 });
      }
    });
  };

  render() {
    const { isEditMode, isAppending } = this.props;
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
                <FollowObjectForm form={this.props.form} />
              </Col>
              <Col span={4} align="middle" justify="center">
                <Form.Item className="object-of-type-page__submit-btn">
                  <Button
                    type="primary"
                    loading={isAppending}
                    disabled={!isContentValid || isAppending}
                    onClick={this.handleSubmit}
                  >
                    <FormattedMessage id="submit" defaultMessage="Submit" />
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
            // locale={locale === 'auto' ? 'en-US' : locale}
            locale={'en-US'}
            onChange={this.handleChangeContent}
          />
        ) : (
          <React.Fragment>
            <h1 className="StoryFull__title preview">{initialContent.title}</h1>
            <BodyContainer full body={initialContent.body} />
            {!this.postContent && (
              <div className="object-of-type-page__empty-placeholder">
                <FormattedMessage
                  id="empty_object_profile"
                  defaultMessage="This object doesn't have any"
                />
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default ObjectOfTypePage;
