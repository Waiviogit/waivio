import React, { useEffect } from 'react';
import { Modal, Rate } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { getLinkSafetyInfo } from '../../../store/wObjectStore/wObjectSelectors';
import { resetLinkSafetyInfo } from '../../../store/wObjectStore/wobjActions';

const LinkSafetyModal = () => {
  const info = useSelector(getLinkSafetyInfo);
  const dispatch = useDispatch();
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
  const noInfo = info?.rating === 0 && !info?.linkWaivio;

  const isDangerous = status === 'Dangerous';
  const infoText = isDangerous
    ? 'Caution! This link has a low safety rating and may be dangerous.'
    : 'Attention! This link is mostly safe, but minor risks may exist.';
  const cancelModal = () => {
    dispatch(resetLinkSafetyInfo());
  };
  const goToSite = () =>
    window.open(info?.url?.endsWith('*') ? info?.url?.slice(0, -1) : info?.url, '_blank');
  const openLink = () => {
    cancelModal();
    goToSite();
  };

  useEffect(() => {
    if (!info?.dangerous && info?.url) goToSite();

    return () => dispatch(resetLinkSafetyInfo());
  }, [info?.url]);

  return info?.dangerous ? (
    <Modal
      title={'External link'}
      visible={info?.showModal}
      onCancel={cancelModal}
      onOk={openLink}
      okText={'Confirm'}
    >
      <div className={'mb2 flex items-center flex-column'}>
        <b>{noInfo ? 'Attention! You`re about to leave the Waivio platform.' : infoText}</b>
        <div className={'main-color-button'}>{info?.url}</div>
        <div>Do you want to proceed to the external site?</div>
      </div>
      <br />
      {
        <div className={'mb2'}>
          <b>Status:</b> <span className={isDangerous ? 'text-red' : 'text-yellow'}>{status}</span>
        </div>
      }
      {info?.rating > 0 && (
        <div className={'mb2 flex items-center'}>
          <b>Community rating:</b>{' '}
          <span className={'RatingsWrap__stars ml2'}>
            <Rate allowHalf defaultValue={info?.rating / 2} disabled />
          </span>
        </div>
      )}
      {info.linkWaivio && (
        <div className={'mb2'}>
          <b>Details:</b>{' '}
          <a
            href={`https://www.waivio.com/object/${info?.linkWaivio}`}
            target={'_blank'}
            rel="noreferrer"
          >
            https://www.waivio.com/object/{info.linkWaivio}
          </a>
        </div>
      )}
      {noInfo && (
        <div className={'WebsitesAuthorities__grey-text'}>
          Note: We do not have a community rating for this site. Proceed with caution when visiting
          external links.
        </div>
      )}
    </Modal>
  ) : null;
};

export default LinkSafetyModal;
