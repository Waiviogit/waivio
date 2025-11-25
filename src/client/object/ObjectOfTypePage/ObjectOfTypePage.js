import { Button, Form, Icon, message, Modal, Alert } from 'antd';
import classNames from 'classnames';
import { isEmpty, size, trimEnd, debounce, unescape } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Lightbox from 'react-image-lightbox';
import { injectIntl } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { objectFields } from '../../../common/constants/listOfFields';
import { analyzePastedCode } from '../../../common/helpers/htmlContent';
import { parseJSON } from '../../../common/helpers/parseJSON';
import { extractImageTags } from '../../../common/helpers/parser';
import {
  getAppendData,
  getLastPermlinksFromHash,
  getObjectName,
  hasType,
} from '../../../common/helpers/wObjectHelper';
import HtmlSandbox from '../../../components/HtmlSandbox';
import { appendObject } from '../../../store/appendStore/appendActions';
import { getIsAddingAppendLoading } from '../../../store/appendStore/appendSelectors';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getLocale } from '../../../store/settingsStore/settingsSelectors';
import { getFollowingObjectsList } from '../../../store/userStore/userSelectors';
import { setEditMode, setNestedWobject } from '../../../store/wObjectStore/wobjActions';
import {
  getBreadCrumbs,
  getIsEditMode,
  getLoadingFlag,
  getWobjectNested,
} from '../../../store/wObjectStore/wObjectSelectors';
import {
  getDraftPage,
  getObject,
  saveDraftPage,
  validateAppend,
} from '../../../waivioApi/ApiClient';
import Editor from '../../components/EditorExtended/EditorExtendedComponent';
import { editorStateToMarkdownSlate } from '../../components/EditorExtended/util/editorStateToMarkdown';
import Loading from '../../components/Icon/Loading';
import IconButton from '../../components/IconButton';
import { getHtml } from '../../components/Story/Body';
import BodyContainer from '../../containers/Story/BodyContainer';
import CatalogBreadcrumb from '../Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import CatalogWrap from '../Catalog/CatalogWrap';
import FollowObjectForm from '../FollowObjectForm';
import LikeSection from '../LikeSection';

import './ObjectOfTypePage.less';
import { getFieldsCount } from '../wObjectHelper';

const ObjectOfTypePage = props => {
  const { intl, form, isEditMode, locale, wobject, followingList, isLoadingFlag, userName } = props;

  const [content, setContent] = useState('');
  const [contentForPublish, setCurrentContent] = useState('');
  const [isReadyToPublish, setIsReadyToPublish] = useState(false);
  const [votePercent, setVotePercent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [validationScript, setValidationScript] = useState(false);
  const [loadingForButton, setLoadingForButton] = useState(false);
  const [draft, setDraft] = useState(null);
  const [littleVotePower, setLittleVotePower] = useState(null);
  const [isNotificaion, setNotification] = useState(null);
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const appendAdding = useSelector(getIsAddingAppendLoading);
  const currObj = isEmpty(props.nestedWobject) ? wobject : props.nestedWobject;
  const isCode = currObj.object_type === 'html';
  const getContent = (obj, isWobjCode) => (isWobjCode ? obj.htmlContent : obj.pageContent);
  const parseCodeField = raw => {
    const parsed = parseJSON(raw);

    if (parsed) {
      return {
        code: parsed.code,
      };
    }

    return {
      code: raw,
    };
  };
  const seedFromSource = (value, isObjTypeCode) => {
    if (isObjTypeCode) {
      const { code } = parseCodeField(value);

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
      seedFromSource(getContent(currObj, isCode), isCode);
      setEditorInitialized(false);
      setDraft(null);

      return;
    }

    if (draft) {
      setNotification(true);
    } else if (isEditMode && userName && ['page', 'html'].includes(currObj.object_type)) {
      setIsReadyToPublish(false);

      getDraftPage(userName, currObj.author_permlink)
        .then(res => {
          if (res.message || !res.body) {
            setEditorInitialized(true);

            return;
          }
          setDraft(res.body);
          setEditorInitialized(false);
        })
        .catch(error => {
          console.error('Component error:', error);
          setEditorInitialized(true);
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
      getDraftPage(userName, currObj.author_permlink)
        .then(res => {
          if (res.message || !res.body) {
            setEditorInitialized(true);

            return;
          }
          setDraft(res.body);
          setEditorInitialized(false);
        })
        .catch(error => {
          console.error('Component error:', error);
          setEditorInitialized(true);
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

        getObject(pathUrl, userName, locale)
          .then(wObject => {
            seedFromSource(
              getContent(wObject, wObject.object_type === 'html'),
              wObject.object_type === 'html',
            );
            setNestedWobj(wObject);
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Component error:', error);
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
          ).catch(error => {
            console.error('Component error:', error);
            // Ignore draft save errors
          });
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
        const fieldsCount = getFieldsCount(wobj, objectFields.htmlContent);
        const safeCount = Number(fieldsCount) || 0;
        const bodyMessage = isCode
          ? `@${userName} added ${objectFields.htmlContent} (${locale}): site ${safeCount + 1}`
          : '';
        const pageContentField = {
          name: isCode ? objectFields.htmlContent : objectFields.pageContent,
          body: content,
          locale,
        };

        const postData = getAppendData(userName, wobj, bodyMessage, pageContentField);

        setLoadingForButton(true);
        appendPageContent(postData, {
          follow,
          votePercent: votePercent * 100,
          isLike: true,
          isObjectPage: true,
        })
          .then(res => {
            setLoadingForButton(false);
            if (res.message) return Promise.reject(res);
            saveDraftPage(
              userName,
              props.nestedWobject.author_permlink || wobject.author_permlink,
            ).catch(error => {
              console.error('Component error:', error);
              // Ignore draft save errors
            });

            return res;
          })
          .then(() => {
            setLoadingForButton(false);
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
          // eslint-disable-next-line consistent-return
          .catch(error => {
            console.error(error);
            if (error.message) return message.error(error.message);
            setIsLoading(false);
            message.error(
              intl.formatMessage({
                id: 'couldnt_append',
                defaultMessage: "Couldn't add the field to object.",
              }),
            );
            setLoadingForButton(false);
          });
      }
    });
  };

  const handleReadyPublishClick = e => {
    const { nestedWobject, breadcrumb } = props;
    e.preventDefault();
    if (isCode) {
      const pageContentField = {
        name: objectFields.htmlContent,
        body: content,
        locale,
      };
      const wobj = breadcrumb.length && !isEmpty(nestedWobject) ? nestedWobject : wobject;
      const fieldsCount = getFieldsCount(wobj, objectFields.htmlContent);
      const safeCount = Number(fieldsCount) || 0;
      const bodyMessage = isCode
        ? `@${userName} added ${objectFields.htmlContent} (${locale}): site ${safeCount + 1}`
        : '';
      const postData = getAppendData(userName, wobject, bodyMessage, pageContentField);

      setValidationScript(true);
      validateAppend(postData)
        .then(res => {
          if (res.status === 200) {
            setIsReadyToPublish(!isReadyToPublish);
            setValidationScript(false);
          } else {
            setValidationScript(false);
            if (res.message) message.error(res.message);
          }
        })
        .catch(() => {
          setValidationScript(false);
          message.error('Something went wrong. Please try again later.');
        });
    } else {
      setIsReadyToPublish(!isReadyToPublish);
    }
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
      if (isCode) return <HtmlSandbox html={content} />;

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
      <h2 className={'object-page-preview-title'}>{getObjectName(wobject)}</h2>
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
            <HtmlSandbox html={content} autoSize padding={16} />
          ) : (
            <BodyContainer isPage full body={content} />
          )}
          <div className="object-page-preview__options">
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
              disabled={form.getFieldError('like') || loadingForButton}
              onClick={handleSubmit}
              size="large"
              loading={loadingForButton}
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
  const isNotHtml = isCode && analyzePastedCode(content);

  const isPageType = hasType(wobject, 'page');
  const shouldShowBreadcrumbs = !isLoadingFlag && (!isEmpty(props.nestedWobject) || isPageType);

  return (
    <React.Fragment>
      {hasType(props.nestedWobject, 'list') ? (
        <CatalogWrap isEditMode={isEditMode} />
      ) : (
        <React.Fragment>
          {shouldShowBreadcrumbs && <CatalogBreadcrumb wobject={wobject} intl={intl} />}
          {isCode && isEditMode && (
            <Alert
              type={'warning'}
              style={{ textAlign: 'center', marginBottom: '10px' }}
              message={
                <div>
                  Check out the{' '}
                  <a
                    rel="noreferrer"
                    href={'/object/qci-creating-a-website-with-chatgpt-and-waivio-html-object/page'}
                    target={'_blank'}
                  >
                    {' '}
                    instructions
                  </a>{' '}
                  for creating your website with the HTML Object.
                </div>
              }
              closable
            />
          )}
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
          {isNotHtml && isEditMode && content && (
            <Alert
              style={{ textAlign: 'center', marginTop: '20px', marginBottom: '10px' }}
              type={'error'}
              message={
                'The code must use only HTML, CSS, and JavaScript (script). Other technologies are not allowed.'
              }
            />
          )}
          {isEditMode && !isReadyToPublish && (
            <div className="object-of-type-page__row align-center">
              <Button
                htmlType="button"
                disabled={littleVotePower || !content || isNotHtml}
                onClick={handleReadyPublishClick}
                loading={validationScript}
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
