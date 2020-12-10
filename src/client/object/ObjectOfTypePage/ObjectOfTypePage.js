import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Form, Icon, message } from 'antd';
import Editor from '../../components/EditorExtended/EditorExtended';
import BodyContainer from '../../containers/Story/BodyContainer';
import toMarkdown from '../../components/EditorExtended/util/editorStateToMarkdown';
import LikeSection from '../LikeSection';
import FollowObjectForm from '../FollowObjectForm';
import {
  getAppendData,
  getLastPermlinksFromHash,
  getObjectName,
  hasType,
} from '../../helpers/wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import { appendObject } from '../appendActions';
import {
  getBreadCrumbs,
  getFollowingObjectsList,
  getIsAppendLoading,
  getLoadingFlag,
  getLocale,
  getWobjectNested,
} from '../../reducers';
import IconButton from '../../components/IconButton';
import CatalogBreadcrumb from '../Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import { getObject } from '../../../waivioApi/ApiClient';
import { setLoadedNestedWobject, setNestedWobject } from '../wobjActions';
import Loading from '../../components/Icon/Loading';

import './ObjectOfTypePage.less';
import CatalogWrap from '../Catalog/CatalogWrap';

const ObjectOfTypePage = props => {
  const { isLoadingFlag } = props;
  const [content, setContent] = useState('');
  const [contentForPublish, setCurrentContent] = useState('');
  const [isReadyToPublish, setIsReadyToPublish] = useState(false);
  const [votePercent, setVotePercent] = useState('');

  useEffect(() => {
    const {
      location: { hash },
      userName,
      locale,
      setNestedWobj,
      setLoadingNestedWobject,
      wobject,
    } = props;
    setLoadingNestedWobject(true);

    if (!isEmpty(wobject)) {
      if (hash) {
        const pathUrl = getLastPermlinksFromHash(hash);
        getObject(pathUrl, userName, locale).then(wObject => {
          setCurrentContent(wObject.pageContent);
          setContent(wObject.pageContent);
          setNestedWobj(wObject);
          setLoadingNestedWobject(false);
        });
      } else {
        setCurrentContent(wobject.pageContent);
        setContent(wobject.pageContent);
        setLoadingNestedWobject(false);
      }
    }
  }, [props.location.hash, props.wobject.author_permlink]);

  const { intl, form, isEditMode, isAppending, locale, wobject, followingList } = props;

  const handleChangeContent = contentRaw => {
    const newContent = toMarkdown(contentRaw);

    if (content !== newContent) setContent(newContent);
  };

  const handleVotePercentChange = percent => setVotePercent(percent);

  const handleSubmit = e => {
    e.preventDefault();

    props.form.validateFieldsAndScroll((err, values) => {
      const { appendPageContent, userName, toggleViewEditMode, nestedWobject, breadcrumb } = props;
      const { follow } = values;
      if (!err) {
        const pageContentField = {
          name: objectFields.pageContent,
          body: content,
          locale,
        };
        const wobj = breadcrumb.length > 1 ? nestedWobject : wobject;
        const postData = getAppendData(userName, wobj, '', pageContentField);
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
                  wobject: getObjectName(wobject),
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
    if (!isLoadingFlag) {
      if (content) {
        return <BodyContainer full body={content} />;
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
    }

    return <Loading />;
  };

  const classObjPage = `object-of-type-page ${
    isEditMode && !isReadyToPublish ? 'edit' : 'view'
  }-mode`;
  const editorLocale = locale === 'auto' ? 'en-US' : locale;

  return (
    <React.Fragment>
      {hasType(props.nestedWobject, 'list') ? (
        <CatalogWrap />
      ) : (
        <React.Fragment>
          {!isLoadingFlag && <CatalogBreadcrumb wobject={wobject} intl={intl} />}
          <div className={classObjPage}>
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
                    {
                      <React.Fragment>
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
                      </React.Fragment>
                    }
                  </div>
                ) : (
                  <div className="object-of-type-page__editor-wrapper">
                    <Editor
                      enabled={!isAppending}
                      withTitle={false}
                      initialContent={{ body: contentForPublish }}
                      locale={editorLocale}
                      onChange={handleChangeContent}
                      displayTitle={false}
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
                disabled={!content}
                onClick={handleReadyPublishClick}
                size="large"
              >
                {intl.formatMessage({ id: 'ready_to_publish', defaultMessage: 'Ready to publish' })}
              </Button>
            </div>
          )}
        </React.Fragment>
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
  isAppending: PropTypes.bool,
  isLoadingFlag: PropTypes.bool,
  appendPageContent: PropTypes.func.isRequired,
  setNestedWobj: PropTypes.func.isRequired,
  followingList: PropTypes.arrayOf(PropTypes.string),
  setLoadingNestedWobject: PropTypes.func,

  /* passed */
  wobject: PropTypes.shape(),
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
  isAppending: false,
  isLoadingFlag: false,
  locale: 'en-US',
  followingList: [],
  setLoadingNestedWobject: () => {},
  breadcrumb: [],
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  isAppending: getIsAppendLoading(state),
  followingList: getFollowingObjectsList(state),
  isLoadingFlag: getLoadingFlag(state),
  nestedWobject: getWobjectNested(state),
  breadcrumb: getBreadCrumbs(state),
});
const mapDispatchToProps = {
  appendPageContent: appendObject,
  setNestedWobj: setNestedWobject,
  setLoadingNestedWobject: setLoadedNestedWobject,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(injectIntl(Form.create()(ObjectOfTypePage))));
