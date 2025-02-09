import classNames from 'classnames';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { isEmpty, size, trimEnd, debounce } from 'lodash';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
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
import { getHtml } from '../../components/Story/Body';
import { extractImageTags } from '../../../common/helpers/parser';
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
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const currObj = isEmpty(props.nestedWobject) ? wobject : props.nestedWobject;
  const parsedBody = getHtml(content, {}, 'text', { isPost: true });
  const contentDiv = useRef();

  const images = extractImageTags(parsedBody).map(image => ({
    ...image,
    src: unescape(image.src.replace('https://images.hive.blog/0x0/', '')),
  }));

  const imagesArraySize = size(images);

  const handleContentClick = e => {
    if (e.target.tagName === 'IMG' && images) {
      const tags = contentDiv.current?.getElementsByTagName('img');

      for (let i = 0; i < tags.length; i += 1) {
        if (tags[i] === e.target && images.length > i) {
          if (e.target?.parentNode && e.target?.parentNode.tagName === 'A') return;

          setIndex(i);
          setOpen(true);
        }
      }
    }
  };

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

  const handleChangeContent = useCallback(
    debounce(editor => {
      const newContent = editorStateToMarkdownSlate(editor.children);

      if (trimEnd(content) !== trimEnd(newContent)) {
        setContent(newContent);
        if (newContent) {
          saveDraftPage(
            userName,
            props.nestedWobject.author_permlink || props.wobject.author_permlink,
            newContent,
          );
        }
      }
    }, 500),
    [content, userName, props.nestedWobject.author_permlink, props.wobject.author_permlink],
  );

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
  };

  const closePublishViev = e => {
    e.preventDefault();
    setIsReadyToPublish(!isReadyToPublish);
    setLittleVotePower(null);
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
          <div className={classObjPage} ref={contentDiv} onClick={handleContentClick}>
            {isEditMode && editorInitialized ? (
              <React.Fragment>
                {isReadyToPublish && (
                  <div className="object-page-preview">
                    <div className="object-page-preview__header">
                      <div>Preview</div>
                      <IconButton
                        className="object-page-preview__close-btn"
                        icon={<Icon type="close" />}
                        onClick={closePublishViev}
                      />
                    </div>
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
                  </div>
                )}
                <div
                  className={classNames('object-of-type-page__editor-wrapper', {
                    'object-of-type-page__editor-wrapper--hide': isReadyToPublish,
                  })}
                >
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
              </React.Fragment>
            ) : (
              <React.Fragment>{renderBody()}</React.Fragment>
            )}
            {open && (
              <Lightbox
                wrapperClassName="LightboxTools"
                mainSrc={images[index].src}
                nextSrc={imagesArraySize > 1 && images[(index + 1) % imagesArraySize].src}
                prevSrc={
                  imagesArraySize > 1 &&
                  images[(index + (imagesArraySize - 1)) % imagesArraySize].src
                }
                onCloseRequest={() => {
                  setOpen(false);
                }}
                onMovePrevRequest={() =>
                  setIndex((index + (imagesArraySize - 1)) % imagesArraySize)
                }
                onMoveNextRequest={() => setIndex((index + (images.length + 1)) % images.length)}
              />
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
