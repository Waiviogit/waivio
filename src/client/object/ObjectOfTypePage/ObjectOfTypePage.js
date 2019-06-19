import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Form, Row } from 'antd';
import Editor from '../../components/EditorExtended/EditorExtended';
import toMarkdown from '../../components/EditorExtended/util/editorStateToMarkdown';
import LikeSection from '../LikeSection';
import FollowObjectForm from '../FollowObjectForm';
import { getFieldWithMaxWeight, validateContent } from '../wObjectHelper';
import { getAppendData } from '../../helpers/wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import { splitPostContent } from '../../helpers/postHelpers';
import { appendObject } from '../appendActions';
import { getLocale } from '../../settings/settingsReducer';
import './ObjectOfTypePage.less';

@Form.create()
@connect(
  state => ({
    locale: getLocale(state),
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
    appendPageContent: PropTypes.func.isRequired,

    /* passed */
    wobject: PropTypes.shape(),
    // match: PropTypes.shape().isRequired,
    isEditMode: PropTypes.bool.isRequired,
    userName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    wobject: {},
    locale: 'en-US',
  };

  constructor(props) {
    super(props);

    const postContent = getFieldWithMaxWeight(props.wobject, objectFields.pageContent);
    this.state = {
      initialContent: splitPostContent(postContent, { titleKey: 'title', bodyKey: 'body' }),
      content: '',
    };
  }

  handleChangeContent = content => {
    this.setState({ content: toMarkdown(content) });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll(err => {
      const { appendPageContent, locale, wobject, userName } = this.props;
      const isContentValid = validateContent(this.state.content);
      if (!err && isContentValid) {
        const { postTitle, postBody } = splitPostContent(this.state.content);
        const pageContentField = {
          name: objectFields.pageContent,
          body: `#${postTitle}\n${postBody}`,
          locale,
        };
        const postData = getAppendData(userName, wobject, '', pageContentField);
        appendPageContent(postData);
      }
    });
  };

  render() {
    const { isEditMode } = this.props;
    return (
      <div className="object-of-type-page">
        {isEditMode && (
          <div className="object-of-type-page__header-controls">
            <Row type="flex" align="middle">
              <Col span={20}>
                <LikeSection
                  form={this.props.form}
                  onVotePercentChange={percent => console.log('votePercent', percent)}
                />
                <FollowObjectForm form={this.props.form} />
              </Col>
              <Col span={4} align="middle" justify="center">
                <Form.Item className="object-of-type-page__submit-btn">
                  <Button
                    type="primary"
                    loading={false}
                    disabled={false}
                    onClick={this.handleSubmit}
                  >
                    <FormattedMessage id="submit" defaultMessage="Submit" />
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}
        <Editor
          enabled
          initialContent={this.state.initialContent}
          // locale={locale === 'auto' ? 'en-US' : locale}
          locale={'en-US'}
          onChange={this.handleChangeContent}
        />
      </div>
    );
  }
}

export default ObjectOfTypePage;
