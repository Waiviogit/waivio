import React, { useEffect, useState } from 'react';
import { Modal, Rate } from 'antd';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { getLinkSafetyInfo } from '../../../store/wObjectStore/wObjectSelectors';
import { rateObject, resetLinkSafetyInfo } from '../../../store/wObjectStore/wobjActions';
import {
  getHostAddress,
  getIsWaivio,
  getUsedLocale,
  getWebsiteConfiguration,
} from '../../../store/appStore/appSelectors';
import { createWaivioObject } from '../../../store/wObjectStore/wobjectsActions';
import { getObjectTypesList } from '../../../store/objectTypesStore/objectTypesSelectors';
import { getObjectTypes } from '../../../store/objectTypesStore/objectTypesActions';
import { getAppendData } from '../../../common/helpers/wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import { appendObject } from '../../../store/appendStore/appendActions';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import { checkLinkSafety } from '../../../waivioApi/ApiClient';

const LinkSafetyModal = props => {
  const [hasVoted, setHasVoted] = useState(false);
  const votePercent = 100;
  const currHost = props.host || (typeof location !== 'undefined' && location.hostname);
  const siteName = props.isWaivio ? 'Waivio' : props.config?.header?.name || currHost;
  let status;

  switch (props.info?.rating) {
    case 1:
    case 2:
    case 3:
    case 4:
      status = 'Dangerous';
      break;
    case 5:
    case 6:
    case 7:
    case 8:
      status = 'Caution Advised';
      break;
    default:
      status = 'Safe';
  }
  // const noInfo = info?.rating === 0 && !info?.linkWaivio;
  const isDangerous = status === 'Dangerous';
  const showModal = props.info?.rating < 9 || (isMobile() && props.info.rating >= 9);
  let infoText;

  if (isMobile() && props.info.rating >= 9) {
    infoText = "You're about to leave the platform.";
  } else if (isDangerous) {
    infoText = 'Caution! This link has a low safety rating and may be dangerous.';
  } else if (props.info.rating === 0) {
    infoText = `Attention! You're about to leave the ${siteName} platform.`;
  } else {
    infoText = 'Attention! This link is mostly safe, but minor risks may exist.';
  }

  const cancelModal = () => {
    props.resetLinkSafetyInfo();
  };

  const goToSite = () => {
    const waivioLink =
      props.info?.url?.includes('/object/') ||
      (props.info?.url?.includes('/@') && !props.info?.url?.includes('http'));

    const finalUrl = props.info?.url?.endsWith('*')
      ? props.info?.url?.slice(0, -1)
      : props.info?.url;

    if (typeof window !== 'undefined') window.open(finalUrl, waivioLink ? '_self' : '_blank');
  };

  const openLink = () => {
    cancelModal();
    goToSite();
  };

  const getVote = () =>
    votePercent !== null
      ? Number(
          BigNumber(votePercent)
            .multipliedBy(100)
            .toFixed(0),
        )
      : null;

  const writeUpdates = (res, rate) => {
    const readyCb = async () => {
      const field = await checkLinkSafety(props.info?.url);

      props.rateObject(field?.fieldAuthor, field?.fieldPermlink, res.parentPermlink, rate * 2);
    };
    const url = new URL(props.info?.url);
    const hostname = url?.hostname?.startsWith('www.') ? url.hostname.slice(4) : url?.hostname;

    props.appendObject(
      getAppendData(
        props.user,
        {
          id: res.parentPermlink,
          author: res.parentAuthor,
          creator: props.user,
          name: hostname,
          locale: props.locale,
          author_permlink: res.parentPermlink,
        },
        '',
        {
          name: objectFields.url,
          body: `${url.protocol}//${url.host}`,
          locale: props.locale,
        },
      ),
      { isUpdateReady: true, readyCb },
    );
  };
  const handleRateClick = rate => {
    setHasVoted(true);
    const url = new URL(props.info?.url);

    const selectedType = props.objectTypes.link;
    const hostname = url?.hostname?.startsWith('www.') ? url.hostname.slice(4) : url?.hostname;

    const options = { subscribeSupposedUpdate: true, cb: res => writeUpdates(res, rate) };
    const data = {
      name: hostname,
      id: hostname,
      type: 'link',
      isExtendingOpen: true,
      isPostingOpen: true,
      votePower: getVote(),
      parentAuthor: selectedType.author,
      parentPermlink: selectedType.permlink,
    };

    if (!isEmpty(props.info?.linkWaivio)) {
      props.rateObject(
        props.info.fieldAuthor,
        props.info.fieldPermlink,
        props.info.linkWaivio,
        rate * 2,
      );
    } else {
      props.createWaivioObject(data, options);
    }
  };

  useEffect(() => {
    if (isEmpty(props.objectTypes)) props.getObjectTypes();

    if (
      !isMobile() &&
      ((props.info?.checkLinks && props.info?.rating > 8) ||
        (!props.info?.checkLinks && props.info?.rating > 4) ||
        (!props.info?.checkLinks && props.info?.rating === 0) ||
        props.info?.isWaivioLink) &&
      props.info?.url
    )
      goToSite();
  }, [props.info?.triggerId, props.info?.url]);
  const ratingClassList = classNames({
    myvote: hasVoted,
  });

  return showModal ? (
    <Modal
      title={'External link'}
      visible={props.info?.showModal}
      onCancel={cancelModal}
      onOk={openLink}
      okText={'Confirm'}
    >
      <div className={'flex items-center flex-column'}>
        <div className={isMobile() ? 'mb2 bolder-fw-center' : 'mb2 bolder-fw'}>{infoText}</div>
        <div className={'mb2'}>Do you want to proceed to the external site?</div>
        <b
          className={'main-color-button '}
          style={{ wordBreak: 'break-all', paddingLeft: '16px', paddingRight: '16px' }}
        >
          {props.info?.url}
        </b>
      </div>
      <br />
      <div className={'ml3'}>
        {' '}
        {props.info?.rating < 9 && props.info?.rating > 0 && (
          <div className={'mb2'}>
            <b>Status:</b>{' '}
            <span className={isDangerous ? 'text-red' : 'text-yellow'}>{status}</span>
          </div>
        )}
        <div className={'mb2 flex items-center'}>
          <b>Community rating:</b>{' '}
          <span className={'RatingsWrap__stars ml2'}>
            <Rate
              disabled={!props.isAuth}
              allowHalf
              defaultValue={props.info?.rating / 2}
              className={ratingClassList}
              onChange={handleRateClick}
            />
          </span>
        </div>
        {props.info?.linkWaivio && (
          <div className={'mb2'}>
            <b>Details:</b>{' '}
            <a
              href={`https://www.waivio.com/object/${props.info?.linkWaivio}`}
              target={'_blank'}
              rel="noreferrer"
            >
              https://www.waivio.com/object/{props.info?.linkWaivio}
            </a>
          </div>
        )}
        {props.info.rating === 0 && (
          <div className={'WebsitesAuthorities__grey-text'}>
            Note: This site has no rating yet. Proceed with caution or leave a rating to help
            others.
          </div>
        )}
      </div>
    </Modal>
  ) : null;
};

LinkSafetyModal.propTypes = {
  info: PropTypes.shape(),
  config: PropTypes.shape(),
  objectTypes: PropTypes.shape(),
  isAuth: PropTypes.bool,
  isWaivio: PropTypes.bool,
  host: PropTypes.string,
  user: PropTypes.string,
  locale: PropTypes.string,
  resetLinkSafetyInfo: PropTypes.func,
  rateObject: PropTypes.func,
  appendObject: PropTypes.func,
  createWaivioObject: PropTypes.func,
  getObjectTypes: PropTypes.func,
};
const mapStateToProps = state => ({
  info: getLinkSafetyInfo(state),
  isAuth: getIsAuthenticated(state),
  config: getWebsiteConfiguration(state),
  isWaivio: getIsWaivio(state),
  host: getHostAddress(state),
  objectTypes: getObjectTypesList(state),
  user: getAuthenticatedUserName(state),
  locale: getUsedLocale(state),
});

const mapDispatchToProps = {
  resetLinkSafetyInfo,
  rateObject,
  appendObject,
  createWaivioObject,
  getObjectTypes,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LinkSafetyModal));
