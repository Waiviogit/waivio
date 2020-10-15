import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Form, Icon, message } from 'antd';
import { isEmpty } from 'lodash';
import Editor from '../../components/EditorExtended/EditorExtended';
import BodyContainer from '../../containers/Story/BodyContainer';
import toMarkdown from '../../components/EditorExtended/util/editorStateToMarkdown';
import LikeSection from '../LikeSection';
import FollowObjectForm from '../FollowObjectForm';
import { getFieldWithMaxWeight } from '../wObjectHelper';
import { getAppendData, getPermLink } from '../../helpers/wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import { appendObject } from '../appendActions';
import {
  getAuthenticatedUserName,
  getFollowingObjectsList,
  getIsAppendLoading,
  getLocale,
} from '../../reducers';
import IconButton from '../../components/IconButton';
import { getObject } from '../../../waivioApi/ApiClient';
import { setNestedWobject } from '../wobjActions';
import CatalogBreadcrumb from '../Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import Loading from '../../components/Icon/Loading';
import './ObjectOfTypePage.less';

const ObjectOfTypePage = props => {
  const [content, setContent] = useState('');
  const [isReadyToPublish, setIsReadyToPublish] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [votePercent, setVotePercent] = useState(false);

  useEffect(() => {
    const {
      userName,
      locale,
      wobject,
      // eslint-disable-next-line react/prop-types
      location: { hash },
      setNestedWobj,
    } = props;

    if (!isEmpty(wobject)) {
      setLoadingContent(true);
      if (hash) {
        const pathUrl = getPermLink(hash);
        getObject(pathUrl, userName, locale).then(wObject => {
          setContent(wObject.pageContent);
          setNestedWobj(wObject);
          setLoadingContent(false);
        });
      } else {
        setContent(wobject.pageContent);
        setLoadingContent(false);
      }
    }
  }, [props.wobject]);

  const handleChangeContent = contentRaw => {
    const newContent = toMarkdown(contentRaw);
    setContent(newContent);
  };

  const handleVotePercentChange = percent => setVotePercent(percent);

  const handleSubmit = e => {
    e.preventDefault();

    props.form.validateFieldsAndScroll((err, values) => {
      const { appendPageContent, locale, wobject, userName, intl, toggleViewEditMode } = props;
      const { follow } = values;
      if (!err) {
        const pageContentField = {
          name: objectFields.pageContent,
          body: content,
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

  const handleReadyPublishClick = e => {
    e.preventDefault();
    setIsReadyToPublish(!isReadyToPublish);
  };

  const showContent = () => {
    const { wobject, intl } = props;
    if (loadingContent) {
      return <Loading />;
    } else if (connect) {
      return (
        <React.Fragment>
          <CatalogBreadcrumb wobject={wobject} intl={intl} />
          <BodyContainer full body={content} />
        </React.Fragment>
      );
    }
    return (
      <div className="object-of-type-page__empty-placeholder">
        <span>
          {intl.formatMessage({
            id: 'empty_page_content',
            defaultMessage: 'The page is not full yet',
          })}
        </span>
      </div>
    );
  };

  const { intl, form, isEditMode, isAppending, locale, wobject, followingList } = props;

  return (
    <React.Fragment>
      <div
        className={`object-of-type-page ${isEditMode && !isReadyToPublish ? 'edit' : 'view'}-mode`}
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
                    onClick={handleReadyPublishClick}
                  />
                </div>
                <BodyContainer full body={content} />
                <div className="object-page-preview__options">
                  <LikeSection form={form} onVotePercentChange={handleVotePercentChange} />
                  {followingList.includes(wobject.author_permlink) ? null : (
                    <FollowObjectForm form={form} />
                  )}
                </div>
                <div className="object-of-type-page__row align-center">
                  <Button
                    htmlType="submit"
                    disabled={form.getFieldError('like')}
                    loading={isAppending}
                    onClick={handleSubmit}
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
                  initialContent={{ body: content }}
                  locale={locale === 'auto' ? 'en-US' : locale}
                  onChange={handleChangeContent}
                  displayTitle={false}
                />
              </div>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>{showContent()}</React.Fragment>
        )}
      </div>
      {isEditMode && !isReadyToPublish && (
        <div className="object-of-type-page__row align-center">
          <Button
            htmlType="button"
            disabled={!content}
            onClick={handleReadyPublishClick}
            size="large"
          >
            {intl.formatMessage({ id: 'ready_to_publish', defaultMessage: 'Ready to publish' })}
          </Button>
        </div>
      )}
    </React.Fragment>
  );
};

ObjectOfTypePage.propTypes = {
  /* decorators */
  form: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,

  /* connect */
  locale: PropTypes.string,
  isAppending: PropTypes.bool,
  appendPageContent: PropTypes.func.isRequired,
  setNestedWobj: PropTypes.func,
  followingList: PropTypes.arrayOf(PropTypes.string),

  /* passed */
  wobject: PropTypes.shape(),
  isEditMode: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  toggleViewEditMode: PropTypes.func.isRequired,
};

ObjectOfTypePage.defaultProps = {
  wobject: {},
  isAppending: false,
  locale: 'en-US',
  followingList: [],
  setNestedWobj: () => {},
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  isAppending: getIsAppendLoading(state),
  followingList: getFollowingObjectsList(state),
  userName: getAuthenticatedUserName(state),
});

const mapDispatchToProps = {
  appendPageContent: appendObject,
  setNestedWobj: setNestedWobject,
};

export default compose(
  Form.create(),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(injectIntl(ObjectOfTypePage));

// export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(injectIntl(ObjectOfTypePage))));
