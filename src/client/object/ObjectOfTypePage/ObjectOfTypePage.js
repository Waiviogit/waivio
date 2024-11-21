import React, { useEffect, useState } from 'react';
import { isEmpty, trimEnd } from 'lodash';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Form, Icon, message, Modal } from 'antd';
import Editor from '../../components/EditorExtended/EditorExtendedComponent';
import BodyContainer from '../../containers/Story/BodyContainer';
import { editorStateToMarkdownSlate } from '../../components/EditorExtended/util/editorStateToMarkdown';
import LikeSection from '../LikeSection';
import FollowObjectForm from '../FollowObjectForm';
import {
  getAppendData,
  getLastPermlinksFromHash,
  getObjectName,
  hasType,
} from '../../../common/helpers/wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import { appendObject } from '../../../store/appendStore/appendActions';
import IconButton from '../../components/IconButton';
import CatalogBreadcrumb from '../Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import { getDraftPage, getObject, saveDraftPage } from '../../../waivioApi/ApiClient';
import { setNestedWobject } from '../../../store/wObjectStore/wobjActions';
import Loading from '../../components/Icon/Loading';
import CatalogWrap from '../Catalog/CatalogWrap';
import { getFollowingObjectsList } from '../../../store/userStore/userSelectors';
import {
  getBreadCrumbs,
  getLoadingFlag,
  getWobjectNested,
} from '../../../store/wObjectStore/wObjectSelectors';
import { getLocale } from '../../../store/settingsStore/settingsSelectors';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import './ObjectOfTypePage.less';

const ObjectOfTypePage = props => {
  const { intl, form, isEditMode, locale, wobject, followingList, isLoadingFlag, userName } = props;
  const [content, setContent] = useState('');
  const [contentForPublish, setCurrentContent] = useState('');
  const [isReadyToPublish, setIsReadyToPublish] = useState(false);
  const [votePercent, setVotePercent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [draft, setDraft] = useState(null);
  const [littleVotePower, setLittleVotePower] = useState(null);
  const [isNotificaion, setNotification] = useState(null);
  const [editorInitialized, setEditorInitialized] = useState(false);
  const currObj = isEmpty(props.nestedWobject) ? wobject : props.nestedWobject;

  useEffect(() => {
    if (!isEditMode) {
      setCurrentContent(currObj.pageContent || '');
      setContent(currObj.pageContent || '');
      setEditorInitialized(false);
      setDraft(null);

      return;
    }

    if (draft) {
      setNotification(true);
    } else if (isEditMode && userName && currObj.object_type === 'page') {
      getDraftPage(userName, currObj.author_permlink).then(res => {
        if (res.message || !res.body) {
          setEditorInitialized(true);

          return;
        }
        setDraft(res.body);
        setEditorInitialized(false);
      });
    }
  }, [isEditMode, draft]);

  useEffect(() => {
    if (!wobject.author_permlink) return;
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    if (userName && currObj.object_type === 'page') {
      getDraftPage(userName, currObj.author_permlink).then(res => {
        if (res.message || !res.body) {
          setEditorInitialized(true);

          return;
        }
        setDraft(res.body);
        setEditorInitialized(false);
      });
    } else {
      setEditorInitialized(true);
      setNotification(false);
      setDraft(null);
    }
  }, [wobject.author_permlink, props.nestedWobject.author_permlink]);

  useEffect(() => {
    const {
      location: { hash },
      setNestedWobj,
    } = props;

    if (!isEmpty(wobject)) {
      if (hash) {
        const pathUrl = getLastPermlinksFromHash(hash);

        getObject(pathUrl, userName, locale).then(wObject => {
          setCurrentContent(wObject.pageContent || '');
          setContent(wObject.pageContent || '');
          setNestedWobj(wObject);
          setIsLoading(false);
        });
      } else {
        setCurrentContent(wobject.pageContent || '');
        setContent(wobject.pageContent || '');
        setIsLoading(false);
      }
    }
  }, [props.location.hash, props.wobject.author_permlink]);

  const handleChangeContent = editor => {
    const newContent = editorStateToMarkdownSlate(editor.children);

    if (trimEnd(content) !== trimEnd(newContent)) {
      setContent(newContent);
      if (newContent)
        saveDraftPage(
          userName,
          props.nestedWobject.author_permlink || props.wobject.author_permlink,
          newContent,
        );
    }
  };

  const handleVotePercentChange = percent => setVotePercent(percent);

  const handleSubmit = e => {
    e.preventDefault();

    props.form.validateFieldsAndScroll((err, values) => {
      const { appendPageContent, toggleViewEditMode, nestedWobject, breadcrumb } = props;
      const { follow } = values;

      if (!err) {
        const pageContentField = {
          name: objectFields.pageContent,
          body: content,
          locale,
        };
        const wobj = breadcrumb.length && !isEmpty(nestedWobject) ? nestedWobject : wobject;
        const postData = getAppendData(userName, wobj, '', pageContentField);

        appendPageContent(postData, { follow, votePercent: votePercent * 100, isLike: true })
          .then(() => {
            saveDraftPage(userName, props.nestedWobject.author_permlink || wobject.author_permlink);
          })
          .then(() => {
            message.success(
              intl.formatMessage(
                {
                  id: 'added_field_to_wobject',
                  defaultMessage: `You successfully have added the {field} field to {wobject} object`,
                },
                {
                  field: objectFields.pageContent,
                  wobject: getObjectName(wobj),
                },
              ),
            );
            toggleViewEditMode();
          })
          .catch(() => {
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
    setCurrentContent(content);
  };

  const renderBody = () => {
    if (isLoading) {
      return <Loading />;
    }

    if (content) {
      return <BodyContainer isPage full body={content} />;
    }

    return (
      <React.Fragment>
        <div className="object-of-type-page__empty-placeholder">
          <span>
            {intl.formatMessage({
              id: 'empty_page_content',
              defaultMessage: 'This page has no content',
            })}
          </span>
        </div>
      </React.Fragment>
    );
  };

  const classObjPage = `object-of-type-page ${
    isEditMode && !isReadyToPublish ? 'edit' : 'view'
  }-mode`;
  const editorLocale = locale === 'auto' ? 'en-US' : locale;

  return (
    <React.Fragment>
      {hasType(props.nestedWobject, 'list') ? (
        <CatalogWrap isEditMode={isEditMode} />
      ) : (
        <React.Fragment>
          {!isLoadingFlag && <CatalogBreadcrumb wobject={wobject} intl={intl} />}
          <div className={classObjPage}>
            {isEditMode && editorInitialized ? (
              <React.Fragment>
                {isReadyToPublish ? (
                  <div className="object-page-preview">
                    <div className="object-page-preview__header">
                      <div>Preview</div>
                      <IconButton
                        className="object-page-preview__close-btn"
                        icon={<Icon type="close" />}
                        onClick={handleReadyPublishClick}
                      />
                    </div>
                    {
                      <React.Fragment>
                        <BodyContainer isPage full body={content} />
                        <div className="object-page-preview__options">
                          <LikeSection
                            form={form}
                            onVotePercentChange={handleVotePercentChange}
                            selectedType={wobject}
                            setLittleVotePower={setLittleVotePower}
                          />
                          {followingList.includes(wobject.author_permlink) ? null : (
                            <FollowObjectForm form={form} />
                          )}
                        </div>
                        <div className="object-of-type-page__row align-center">
                          <Button
                            htmlType="submit"
                            disabled={form.getFieldError('like')}
                            onClick={handleSubmit}
                            size="large"
                          >
                            {intl.formatMessage({ id: 'append_send', defaultMessage: 'Submit' })}
                          </Button>
                        </div>
                      </React.Fragment>
                    }
                  </div>
                ) : (
                  <div className="object-of-type-page__editor-wrapper">
                    <Editor
                      withTitle={false}
                      enabled
                      initialContent={{ body: contentForPublish }}
                      locale={editorLocale}
                      onChange={handleChangeContent}
                      displayTitle={false}
                      match={props.match}
                    />
                  </div>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>{renderBody()}</React.Fragment>
            )}
          </div>
          {isEditMode && !isReadyToPublish && (
            <div className="object-of-type-page__row align-center">
              <Button
                htmlType="button"
                disabled={littleVotePower || !content}
                onClick={handleReadyPublishClick}
                size="large"
              >
                {intl.formatMessage({ id: 'ready_to_publish', defaultMessage: 'Ready to publish' })}
              </Button>
            </div>
          )}
        </React.Fragment>
      )}
      {isEditMode && (
        <Modal
          visible={isNotificaion}
          title="Page draft"
          onOk={() => {
            setCurrentContent(draft);
            setContent(draft);
            setNotification(false);
            setEditorInitialized(true);
          }}
          onCancel={() => {
            setNotification(false);
            setEditorInitialized(true);
          }}
          okText={intl.formatMessage({ defaultMessage: 'Continue', id: 'continue' })}
          cancelText={intl.formatMessage({ defaultMessage: 'Discard', id: 'discard' })}
        >
          You have one draft with unsaved changes. Do you want to continue editing?
        </Modal>
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
  location: PropTypes.string,
  isLoadingFlag: PropTypes.bool,
  appendPageContent: PropTypes.func.isRequired,
  setNestedWobj: PropTypes.func.isRequired,
  followingList: PropTypes.arrayOf(PropTypes.string),

  /* passed */
  wobject: PropTypes.shape(),
  match: PropTypes.shape(),
  nestedWobject: PropTypes.shape(),
  isEditMode: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  toggleViewEditMode: PropTypes.func.isRequired,
  breadcrumb: PropTypes.shape(),
};

ObjectOfTypePage.defaultProps = {
  wobject: {},
  nestedWobject: {},
  location: '',
  isLoadingFlag: false,
  locale: 'en-US',
  followingList: [],
  breadcrumb: [],
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  followingList: getFollowingObjectsList(state),
  isLoadingFlag: getLoadingFlag(state),
  nestedWobject: getWobjectNested(state),
  breadcrumb: getBreadCrumbs(state),
  userName: getAuthenticatedUserName(state),
});
const mapDispatchToProps = {
  appendPageContent: appendObject,
  setNestedWobj: setNestedWobject,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(injectIntl(Form.create()(ObjectOfTypePage))));
