import classNames from 'classnames';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { isEmpty, size, trimEnd, debounce } from 'lodash';
import { withRouter } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import { injectIntl } from 'react-intl';
import { Button, Form, Icon, message, Modal, Checkbox } from 'antd';
import { parseJSON } from '../../../common/helpers/parseJSON';
import HtmlSandbox from '../../../components/HtmlSandbox';
import { getIsAddingAppendLoading } from '../../../store/appendStore/appendSelectors';
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
import { setEditMode, setNestedWobject } from '../../../store/wObjectStore/wobjActions';
import Loading from '../../components/Icon/Loading';
import { getHtml } from '../../components/Story/Body';
import { extractImageTags } from '../../../common/helpers/parser';
import CatalogWrap from '../Catalog/CatalogWrap';
import { getFollowingObjectsList } from '../../../store/userStore/userSelectors';
import {
  getBreadCrumbs,
  getIsEditMode,
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

  // NEW: flags to hide sections
  const [hideSignInState, setHideSignIn] = useState(true);
  const [hideMenuState, setHideMenu] = useState(true);
  const appendAdding = useSelector(getIsAddingAppendLoading);
  const currObj = isEmpty(props.nestedWobject) ? wobject : props.nestedWobject;
  const isCode = currObj.object_type === 'html';
  const getContent = (obj, isWobjCode) => (isWobjCode ? obj.htmlContent : obj.pageContent);
  const parseCodeField = raw => {
    const parsed = parseJSON(raw);

    if (parsed) {
      return {
        code: parsed.code,
        hideSignIn: Boolean(parsed.hideSignIn),
        hideMenu: Boolean(parsed.hideMenu),
      };
    }

    return {
      code: raw,
      hideSignIn: true,
      hideMenu: true,
    };
  };
  const seedFromSource = (value, isObjTypeCode) => {
    if (isObjTypeCode) {
      const { code, hideMenu, hideSignIn } = parseCodeField(value);

      setHideMenu(hideMenu);
      setHideSignIn(hideSignIn);
      setCurrentContent(code);
      setContent(code);
    } else {
      setCurrentContent(value);
      setContent(value);
    }
  };

  const parsedBody = getHtml(content, {}, 'text', { isPost: true });
  const contentDiv = useRef();

  const images = extractImageTags(parsedBody).map(image => ({
    ...image,
    src: unescape(image.src.replace('https://images.hive.blog/0x0/', '')),
  }));
  const imagesArraySize = size(images);

  const handleContentClick = e => {
    if (e.target.tagName === 'IMG' && images && !isEditMode) {
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

  // when switching edit/view modes initially
  useEffect(() => {
    if (!isEditMode) {
      seedFromSource(
        getContent(currObj, currObj.object_type === 'html'),
        currObj.object_type === 'html',
      );
      setEditorInitialized(false);
      setDraft(null);

      return;
    }

    if (draft) {
      setNotification(true);
    } else if (isEditMode && userName && ['page', 'html'].includes(currObj.object_type)) {
      setIsReadyToPublish(false);

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
    seedFromSource(getContent(wobject, isCode), isCode);
  }, [wobject.htmlContent, wobject.pageContent]);

  // when route target changes
  useEffect(() => {
    if (!wobject.author_permlink) return;
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });

    if (userName && ['page', 'html'].includes(currObj.object_type)) {
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

  // initial content fetch (hash changes etc.)
  useEffect(() => {
    const {
      location: { hash },
      setNestedWobj,
    } = props;

    if (!isEmpty(wobject)) {
      if (hash) {
        const pathUrl = getLastPermlinksFromHash(hash);

        getObject(pathUrl, userName, locale).then(wObject => {
          seedFromSource(
            getContent(wObject, wObject.object_type === 'html'),
            wObject.object_type === 'html',
          );
          setNestedWobj(wObject);
          setIsLoading(false);
        });
      } else {
        seedFromSource(
          getContent(wobject, wobject.object_type === 'html'),
          wobject.object_type === 'html',
        );
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
      const { appendPageContent, nestedWobject, breadcrumb } = props;
      const { follow } = values;

      if (!err) {
        const wobj = breadcrumb.length && !isEmpty(nestedWobject) ? nestedWobject : wobject;

        // pack body: for code pages we send JSON with flags
        const bodyOut = isCode
          ? JSON.stringify({
              code: content,
              hideSignIn: hideSignInState,
              hideMenu: hideMenuState,
            })
          : content;

        const pageContentField = isCode
          ? {
              name: objectFields.htmlContent,
              body: bodyOut,
              locale,
            }
          : {
              name: objectFields.pageContent,
              body: bodyOut,
              locale,
            };

        const postData = getAppendData(userName, wobj, '', pageContentField);

        appendPageContent(postData, {
          follow,
          votePercent: votePercent * 100,
          isLike: true,
          isObjectPage: true,
        })
          .then(res => {
            saveDraftPage(userName, props.nestedWobject.author_permlink || wobject.author_permlink);

            return res;
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
            props.setEditMode(!props.isEditMode);
          })
          .catch(error => {
            console.error(error);
            setIsLoading(false);
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
    if (isLoading || appendAdding) {
      return <Loading />;
    }

    if (content) {
      if (isCode) return <HtmlSandbox html={content} autoSize maxHeight={2000} padding={16} />;

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

  const editorLocale = locale === 'auto' ? 'en-US' : locale;

  const getComponentEdit = () => (
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
          {isCode ? (
            <HtmlSandbox html={content} autoSize maxHeight={2000} padding={16} />
          ) : (
            <BodyContainer isPage full body={content} />
          )}
          <div className="object-page-preview__options">
            {isCode && (
              <div className="object-page-preview__flags" style={{ marginBottom: 20 }}>
                <Checkbox
                  checked={hideSignInState}
                  onChange={e => setHideSignIn(e.target.checked)}
                  style={{ display: 'block', marginBottom: 8 }}
                >
                  Hide sign-in section
                </Checkbox>
                <Checkbox
                  checked={hideMenuState}
                  onChange={e => setHideMenu(e.target.checked)}
                  style={{ display: 'block' }}
                >
                  Hide site main menu section
                </Checkbox>
              </div>
            )}
            <LikeSection
              form={form}
              onVotePercentChange={handleVotePercentChange}
              selectedType={wobject}
              setLittleVotePower={setLittleVotePower}
            />
            {followingList?.includes(wobject.author_permlink) ? null : (
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
          placeholder={
            isCode
              ? intl.formatMessage({
                  id: 'code_placeholder',
                  defaultMessage: 'Write your code',
                })
              : ''
          }
          isWobjCode={isCode}
        />
      </div>
    </React.Fragment>
  );

  const classObjPage = `object-of-type-page ${
    isEditMode && !isReadyToPublish ? 'edit' : 'view'
  }-mode`;

  return (
    <React.Fragment>
      {hasType(props.nestedWobject, 'list') ? (
        <CatalogWrap isEditMode={isEditMode} />
      ) : (
        <React.Fragment>
          {!isLoadingFlag && <CatalogBreadcrumb wobject={wobject} intl={intl} />}
          <div className={classObjPage} ref={contentDiv} onClick={handleContentClick}>
            {isEditMode && editorInitialized ? getComponentEdit() : renderBody()}
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
          {!isReadyToPublish && content?.includes('<script>') && (
            <p style={{ padding: '15px 0', textAlign: 'center', color: 'red' }}>
              The script tag is not allowed in code updates.
            </p>
          )}
          {isEditMode && !isReadyToPublish && (
            <div className="object-of-type-page__row align-center">
              <Button
                htmlType="button"
                disabled={littleVotePower || !content || content.includes('<script>')}
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
            seedFromSource(draft, isCode);
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
  location: PropTypes.shape(),
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
  setEditMode: PropTypes.func.isRequired,
  breadcrumb: PropTypes.shape(),
};

ObjectOfTypePage.defaultProps = {
  wobject: {},
  nestedWobject: {},
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
  isEditMode: getIsEditMode(state),
});
const mapDispatchToProps = {
  appendPageContent: appendObject,
  setNestedWobj: setNestedWobject,
  setEditMode,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(injectIntl(Form.create()(ObjectOfTypePage))));
