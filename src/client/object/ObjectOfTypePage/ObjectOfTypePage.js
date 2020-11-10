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
} from '../../helpers/wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import { appendObject } from '../appendActions';
import {
  getFollowingObjectsList,
  getIsAppendLoading,
  getLoadingFlag,
  getLocale,
} from '../../reducers';
import IconButton from '../../components/IconButton';
import CatalogBreadcrumb from '../Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import { getObject } from '../../../waivioApi/ApiClient';
import { setLoadedNestedWobject, setNestedWobject } from '../wobjActions';
import './ObjectOfTypePage.less';
import Loading from '../../components/Icon/Loading';

const ObjectOfTypePage = props => {
  const { isLoadingFlag } = props;
  const [content, setContent] = useState('');
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
          setContent(wObject.pageContent);
          setNestedWobj(wObject);
          setLoadingNestedWobject(false);
        });
      } else {
        setContent(wobject.pageContent);
        setLoadingNestedWobject(false);
      }
    }
  }, [props.location.hash, props.wobject]);

  const { intl, form, isEditMode, isAppending, locale, wobject, followingList } = props;

  const handleChangeContent = contentRaw => {
    const newContent = toMarkdown(contentRaw);
    setContent(newContent);
  };

  // eslint-disable-next-line no-shadow
  const handleVotePercentChange = votePercent => setVotePercent(votePercent);

  const handleSubmit = e => {
    e.preventDefault();

    props.form.validateFieldsAndScroll((err, values) => {
      const { appendPageContent, userName, toggleViewEditMode } = props;
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
                  wobject: getObjectName(wobject),
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

  const renderBody = () => {
    if (!isLoadingFlag) {
      if (content) {
        return (
          <React.Fragment>
            <CatalogBreadcrumb wobject={wobject} intl={intl} />
            <BodyContainer full body={content} />
          </React.Fragment>
        );
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
                {isLoadingFlag ? (
                  <Loading />
                ) : (
                  <React.Fragment>
                    <CatalogBreadcrumb wobject={wobject} intl={intl} />
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
                )}
              </div>
            ) : (
              <div className="object-of-type-page__editor-wrapper">
                <Editor
                  enabled={!isAppending}
                  withTitle={false}
                  initialContent={{ body: content }}
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
  isEditMode: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  toggleViewEditMode: PropTypes.func.isRequired,
};

ObjectOfTypePage.defaultProps = {
  wobject: {},
  location: '',
  isAppending: false,
  isLoadingFlag: false,
  locale: 'en-US',
  followingList: [],
  setLoadingNestedWobject: () => {},
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  isAppending: getIsAppendLoading(state),
  followingList: getFollowingObjectsList(state),
  isLoadingFlag: getLoadingFlag(state),
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
