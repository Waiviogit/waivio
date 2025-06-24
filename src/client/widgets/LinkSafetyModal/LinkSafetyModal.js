import React, { useEffect, useState } from 'react';
import { Modal, Rate } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';
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
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { checkLinkSafety } from '../../../waivioApi/ApiClient';

const LinkSafetyModal = () => {
  const [hasVoted, setHasVoted] = useState(false);
  const dispatch = useDispatch();
  const info = useSelector(getLinkSafetyInfo);
  const config = useSelector(getWebsiteConfiguration);
  const isWaivio = useSelector(getIsWaivio);
  const host = useSelector(getHostAddress);
  const objectTypes = useSelector(getObjectTypesList);
  const user = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const votePercent = 100;
  const currHost = host || (typeof location !== 'undefined' && location.hostname);
  const siteName = isWaivio ? 'Waivio' : config?.header?.name || currHost;
  let status;

  switch (info?.rating) {
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
  const dangerous = info?.rating < 9;
  const infoText = isDangerous
    ? 'Caution! This link has a low safety rating and may be dangerous.'
    : 'Attention! This link is mostly safe, but minor risks may exist.';
  const cancelModal = () => {
    dispatch(resetLinkSafetyInfo());
  };

  const goToSite = () => {
    const waivioLink =
      info?.url?.includes('/object/') ||
      (info?.url?.includes('/@') && !info?.url?.includes('http'));

    window.open(
      info?.url?.endsWith('*') ? info?.url?.slice(0, -1) : info?.url,
      waivioLink ? '_self' : '_blank',
    );
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
      const field = await checkLinkSafety(info?.url);

      dispatch(rateObject(field?.fieldAuthor, field?.fieldPermlink, res.parentPermlink, rate * 2));
    };
    const url = new URL(info?.url);
    const hostname = url?.hostname?.startsWith('www.') ? url.hostname.slice(4) : url?.hostname;

    dispatch(
      appendObject(
        getAppendData(
          user,
          {
            id: res.parentPermlink,
            author: res.parentAuthor,
            creator: user,
            name: hostname,
            locale,
            author_permlink: res.parentPermlink,
          },
          '',
          {
            name: objectFields.url,
            body: info?.url,
            locale,
          },
        ),
        { isUpdateReady: true, readyCb },
      ),
    );
  };
  const handleRateClick = rate => {
    setHasVoted(true);
    const url = new URL(info?.url);

    const selectedType = objectTypes.link;
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

    if (!isEmpty(info?.linkWaivio)) {
      dispatch(rateObject(info.fieldAuthor, info.fieldPermlink, info.linkWaivio, rate * 2));
    } else {
      dispatch(createWaivioObject(data, options));
    }
  };

  useEffect(() => {
    if (isEmpty(objectTypes)) dispatch(getObjectTypes());
    if (!dangerous && info?.url) goToSite();
  }, [info?.triggerId, info?.url]);
  const ratingClassList = classNames({
    myvote: hasVoted,
  });

  return dangerous ? (
    <Modal
      title={'External link'}
      visible={info?.showModal}
      onCancel={cancelModal}
      onOk={openLink}
      okText={'Confirm'}
    >
      <div className={'flex items-center flex-column'}>
        <div className={isMobile() ? 'mb2 bolder-fw-center' : 'mb2 bolder-fw'}>
          {info.rating === 0
            ? `Attention! You're about to leave the ${siteName} platform.`
            : infoText}
        </div>
        <div className={'mb2'}>Do you want to proceed to the external site?</div>
        <b
          className={'main-color-button '}
          style={{ wordBreak: 'break-all', paddingLeft: '16px', paddingRight: '16px' }}
        >
          {info?.url}
        </b>
      </div>
      <br />
      <div className={'ml3'}>
        {' '}
        {dangerous && info?.rating > 0 && (
          <div className={'mb2'}>
            <b>Status:</b>{' '}
            <span className={isDangerous ? 'text-red' : 'text-yellow'}>{status}</span>
          </div>
        )}
        <div className={'mb2 flex items-center'}>
          <b>Community rating:</b>{' '}
          <span className={'RatingsWrap__stars ml2'}>
            <Rate
              allowHalf
              defaultValue={info?.rating / 2}
              className={ratingClassList}
              onChange={handleRateClick}
            />
          </span>
        </div>
        {info?.linkWaivio && (
          <div className={'mb2'}>
            <b>Details:</b>{' '}
            <a
              href={`https://www.waivio.com/object/${info?.linkWaivio}`}
              target={'_blank'}
              rel="noreferrer"
            >
              https://www.waivio.com/object/{info?.linkWaivio}
            </a>
          </div>
        )}
        {info.rating === 0 && (
          <div className={'WebsitesAuthorities__grey-text'}>
            Note: This site has no rating yet. Proceed with caution or leave a rating to help
            others.
          </div>
        )}
      </div>
    </Modal>
  ) : null;
};

export default LinkSafetyModal;
