import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Icon, Input, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce, noop } from 'lodash';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import Popover from '../../components/Popover';
import PopoverMenu, { PopoverMenuItem } from '../../components/PopoverMenu/PopoverMenu';
import {
  decreaseReward,
  realiseRewards,
  reinstateReward,
  rejectAuthorReview,
} from '../../../store/newRewards/newRewardsActions';
import Report from '../../rewards/Report/Report';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { checkUserFollowing, checkUserInBlackList, getContent } from '../../../waivioApi/ApiClient';
import { followUser, unfollowUser } from '../../../store/userStore/userActions';
import { changeBlackAndWhiteLists } from '../../../store/rewardsStore/rewardsActions';
import { campaignTypes } from '../../rewards/rewardsHelper';
import ids from '../BlackList/constants';
import { followObject, unfollowObject } from '../../../store/wObjectStore/wobjActions';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { handleHidePost, muteAuthorPost } from '../../../store/postsStore/postActions';
import RemoveObjFomPost from '../../components/RemoveObjFomPost/RemoveObjFomPost';

const RewardsPopover = ({ proposition, getProposition, type, intl }) => {
  const [isVisiblePopover, setIsVisiblePopover] = useState(false);
  const [amount, setAmount] = useState(0);
  const [inBlackList, setInBlackList] = useState(false);
  const [mutedAuthor, setMutedAuthort] = useState(false);
  const [hidedPost, setHidedPost] = useState(false);
  const [openRejectCapm, setOpenRejectCapm] = useState(false);
  const [linkedObjs, setLinkedObjs] = useState([]);
  const [followingObj, setFollowingObj] = useState(false);
  const [followingGuide, setFollowingGuide] = useState(false);
  const [openDecrease, setOpenDecrease] = useState('');
  const [isModalReportOpen, setIsModalReportOpen] = useState(false);
  const [loadingType, setLoadingType] = useState('');
  const authUserName = useSelector(getAuthenticatedUserName);
  const dispatch = useDispatch();
  const isSponsor = authUserName === proposition?.guideName;
  const isUser = authUserName === proposition?.userName;
  const bothStatus = isUser && isSponsor;
  const rewiewType = type === 'reserved' ? 'reserved' : proposition.reviewStatus;
  const isGiveaways = [campaignTypes.GIVEAWAYS, campaignTypes.CONTESTS_OBJECT].includes(
    proposition?.type,
  );

  useEffect(() => {
    if (isVisiblePopover && !bothStatus) {
      if (isSponsor)
        checkUserInBlackList(proposition?.guideName, proposition?.userName).then(res =>
          setInBlackList(res.inBlacklist),
        );
      if (isUser && !isGiveaways) {
        checkUserFollowing(
          proposition?.userName,
          [proposition?.guideName],
          [proposition?.requiredObject?.author_permlink],
        ).then(res => {
          setFollowingObj(res.objects[0]?.follow);
          setFollowingGuide(res.users[0]?.follow);
        });
      }
    }
    setMutedAuthort(proposition.muted);
    setHidedPost(proposition.isHide);
  }, [isVisiblePopover]);

  const realeaseReward = () => {
    setIsVisiblePopover(false);
    Modal.confirm({
      title: 'Release reservation',
      content: 'Do you want to release this reservation?',
      onOk() {
        return new Promise(resolve => {
          dispatch(realiseRewards(proposition))
            .then(() => {
              getProposition().then(() => {
                resolve();
              });
            })
            .catch(error => {
              console.error('Component error:', error);
              resolve();
            });
        });
      },
    });
  };

  const rejectReservation = () => {
    setIsVisiblePopover(false);
    Modal.confirm({
      title: 'Reject reservation',
      content: 'Do you want to reject this reservation?',
      onOk() {
        return new Promise(resolve => {
          dispatch(rejectAuthorReview(proposition))
            .then(() => {
              getProposition().then(() => {
                resolve();
              });
            })
            .catch(error => {
              console.error('Component error:', error);
              resolve();
            });
        });
      },
    });
  };

  const handleReinstateReward = () => {
    setIsVisiblePopover(false);
    Modal.confirm({
      title: 'Reinstate reward',
      content: 'Do you want to reinstate this reservation?',
      onOk() {
        return new Promise(resolve => {
          dispatch(reinstateReward(proposition))
            .then(() => {
              getProposition().then(() => {
                resolve();
              });
            })
            .catch(error => {
              console.error('Component error:', error);
              resolve();
            });
        });
      },
    });
  };

  const openDecreaseModal = typeAction => {
    setIsVisiblePopover(false);
    setOpenDecrease(typeAction);
  };

  const setAmountDebounce = useCallback(
    debounce(value => {
      setAmount(value);
    }, 300),
    [],
  );

  const viewReservation = useMemo(
    () => (
      <PopoverMenuItem key={'view_reservation'}>
        <Link to={`/@${proposition?.userName}/${proposition?.reservationPermlink}`}>
          {intl.formatMessage({ id: 'view_reservation', defaultMessage: 'View reservation' })}
        </Link>
      </PopoverMenuItem>
    ),
    [proposition?.userName, proposition?.reservationPermlink],
  );

  const decrease = useMemo(
    () => (
      <PopoverMenuItem key={'decrease'}>
        <div role="presentation" onClick={() => openDecreaseModal('decrease')}>
          {intl.formatMessage({ id: 'decrease_reward', defaultMessage: 'Decrease reward' })}
        </div>
      </PopoverMenuItem>
    ),
    [],
  );

  const increase = useMemo(
    () => (
      <PopoverMenuItem key={'increase'}>
        <div role="presentation" onClick={() => openDecreaseModal('increase')}>
          {intl.formatMessage({ id: 'increase_reward', defaultMessage: 'Increase reward' })}
        </div>
      </PopoverMenuItem>
    ),
    [],
  );

  const openReview = useMemo(
    () => (
      <PopoverMenuItem key={'open_review'}>
        <Link
          to={
            isGiveaways
              ? `/@${proposition?.reviewPermlink}`
              : `/@${proposition?.userName}/${proposition?.reviewPermlink}`
          }
        >
          {intl.formatMessage({ id: 'open_review', defaultMessage: 'Open review' })}
        </Link>
      </PopoverMenuItem>
    ),
    [proposition?.userName, proposition?.reviewPermlink],
  );

  const rejectionNote = useMemo(
    () => (
      <PopoverMenuItem key={'rejection_note'}>
        <Link to={`/@${proposition?.guideName}/${proposition?.rejectionPermlink}`}>
          {intl.formatMessage({ id: 'rejection_note', defaultMessage: 'Rejection note' })}
        </Link>
      </PopoverMenuItem>
    ),
    [proposition?.userName, proposition?.reviewPermlink],
  );

  const report = useMemo(
    () => (
      <PopoverMenuItem key={'show_report'}>
        <div onClick={() => setIsModalReportOpen(true)}>
          {intl.formatMessage({ id: 'show_report', defaultMessage: 'Show report' })}
        </div>
      </PopoverMenuItem>
    ),
    [],
  );

  const followUserItem = useMemo(
    () => (
      <PopoverMenuItem key={'follow_user'}>
        <div
          onClick={() => {
            setLoadingType('user');
            const followMethod = followingGuide ? unfollowUser : followUser;

            dispatch(followMethod(proposition?.guideName)).then(() => {
              setFollowingGuide(!followingGuide);
              setLoadingType('');
            });
          }}
        >
          {loadingType === 'user' && <Icon type={'loading'} />}{' '}
          {followingGuide
            ? intl.formatMessage({ id: 'unfollow', defaultMessage: 'Unfollow' })
            : intl.formatMessage({ id: 'follow', defaultMessage: 'Follow' })}{' '}
          @{proposition?.guideName}
        </div>
      </PopoverMenuItem>
    ),
    [followingGuide, loadingType, proposition?.guideName],
  );

  const followObjectItem = useMemo(
    () => (
      <PopoverMenuItem key={'follow_object'}>
        <div
          onClick={() => {
            setLoadingType('object');
            const followMethod = followingObj ? unfollowObject : followObject;

            dispatch(followMethod(proposition?.requiredObject?.author_permlink)).then(() => {
              setFollowingObj(!followingObj);
              setLoadingType('');
            });
          }}
        >
          {loadingType === 'object' && <Icon type={'loading'} />}{' '}
          {followingObj
            ? intl.formatMessage({ id: 'unfollow', defaultMessage: 'Unfollow' })
            : intl.formatMessage({ id: 'follow', defaultMessage: 'Follow' })}{' '}
          {getObjectName(proposition?.requiredObject)}
        </div>
      </PopoverMenuItem>
    ),
    [followingGuide, loadingType, proposition?.requiredObject],
  );

  const addToBlackList = useMemo(
    () => (
      <PopoverMenuItem key={'blacklist'}>
        <div
          onClick={() => {
            setLoadingType('blackList');
            const methodType = inBlackList ? ids.blackList.remove : ids.blackList.add;

            dispatch(changeBlackAndWhiteLists(methodType, [proposition?.userName])).then(() => {
              setInBlackList(!inBlackList);
              setLoadingType('');
            });
          }}
        >
          {loadingType === 'blackList' && <Icon type={'loading'} />}{' '}
          {inBlackList
            ? intl.formatMessage({
                id: 'remove_from_blacklist',
                defaultMessage: 'Remove from blacklist',
              })
            : intl.formatMessage({
                id: 'add_to_blacklist',
                defaultMessage: 'Add to blacklist',
              })}{' '}
          @{proposition?.userName}
        </div>
      </PopoverMenuItem>
    ),
    [inBlackList, loadingType, proposition?.userName],
  );

  const rejectRewards = useMemo(
    () => (
      <PopoverMenuItem key={'release'}>
        <div
          role="presentation"
          onClick={() => {
            setIsVisiblePopover(false);
            setOpenRejectCapm(true);
            getContent(proposition.userName, proposition.reviewPermlink).then(p =>
              setLinkedObjs(p.wobjects),
            );
          }}
        >
          {intl.formatMessage({ id: 'reject_review', defaultMessage: 'Reject review' })}
        </div>
      </PopoverMenuItem>
    ),
    [],
  );

  const rejectReservations = useMemo(
    () => (
      <PopoverMenuItem key={'rejectReservation'}>
        <div role="presentation" onClick={rejectReservation}>
          {intl.formatMessage({ id: 'reject_reservation', defaultMessage: 'Reject reservation' })}
        </div>
      </PopoverMenuItem>
    ),
    [],
  );

  const realeaseRewards = useMemo(
    () => (
      <PopoverMenuItem key={'release'}>
        <div role="presentation" onClick={realeaseReward}>
          {intl.formatMessage({ id: 'reject_campaign', defaultMessage: 'Release reservation' })}
        </div>
      </PopoverMenuItem>
    ),
    [realeaseReward],
  );

  const reinstate = useMemo(
    () => (
      <PopoverMenuItem key={'release'}>
        <div role="presentation" onClick={handleReinstateReward}>
          {intl.formatMessage({ id: 'reinstate_reward', defaultMessage: 'Reinstate reward' })}
        </div>
      </PopoverMenuItem>
    ),
    [],
  );

  const hidePost = useMemo(
    () => (
      <PopoverMenuItem key={'hidepost'}>
        <div
          onClick={() => {
            setLoadingType('hidepost');

            dispatch(
              handleHidePost({
                ...proposition,
                permlink: proposition.reviewPermlink,
                author: proposition.userName,
              }),
            ).then(() => {
              setHidedPost(!hidedPost);
              setLoadingType('');
            });
          }}
        >
          {loadingType === 'hidepost' && <Icon type={'loading'} />}{' '}
          {hidedPost
            ? intl.formatMessage({ id: 'unhide_post', defaultMessage: 'Unhide post' })
            : intl.formatMessage({ id: 'hide_post', defaultMessage: 'Hide post' })}
        </div>
      </PopoverMenuItem>
    ),
    [loadingType, hidedPost, proposition?.userName],
  );

  const muteUser = useMemo(
    () => (
      <PopoverMenuItem key={'muteuser'}>
        <div
          onClick={() => {
            setLoadingType('muteuser');

            dispatch(muteAuthorPost({ ...proposition, author: proposition.userName })).then(() => {
              setMutedAuthort(!mutedAuthor);
              setLoadingType('');
            });
          }}
        >
          {loadingType === 'muteuser' && <Icon type={'loading'} />}{' '}
          {mutedAuthor
            ? intl.formatMessage({ id: 'unmute_user', defaultMessage: 'Unmute user' })
            : intl.formatMessage({ id: 'mute_user', defaultMessage: 'Mute user' })}{' '}
          @{proposition?.userName}
        </div>
      </PopoverMenuItem>
    ),
    [loadingType, mutedAuthor, proposition?.userName],
  );

  const dopFun = () => {
    if (bothStatus) return [];

    return isSponsor ? [addToBlackList] : [followUserItem, followObjectItem];
  };

  const getPopoverItems = () => {
    const toolList = dopFun();

    switch (rewiewType) {
      case 'reserved':
      case 'assigned': {
        return isUser
          ? [viewReservation, realeaseRewards, decrease, ...toolList]
          : [viewReservation, rejectReservations, increase, ...toolList];
      }

      case 'completed': {
        const mainList = [
          campaignTypes.CONTESTS_OBJECT,
          campaignTypes.MENTIONS,
          campaignTypes.GIVEAWAYS,
          campaignTypes.GIVEAWAYS_OBJECT,
        ].includes(proposition?.type)
          ? [openReview, report]
          : [viewReservation, openReview, report];

        if (campaignTypes.CONTESTS_OBJECT === proposition?.type)
          return isSponsor
            ? [...mainList, rejectRewards, hidePost, muteUser, ...toolList]
            : mainList;

        if (isGiveaways)
          return isSponsor
            ? [...mainList, rejectRewards, muteUser, ...toolList]
            : [...mainList, muteUser, ...toolList];

        return isSponsor && !isGiveaways
          ? [...mainList, rejectRewards, hidePost, muteUser, ...toolList]
          : mainList;
      }
      case 'rejected':
        if (
          [
            campaignTypes.CONTESTS_OBJECT,
            campaignTypes.MENTIONS,
            campaignTypes.GIVEAWAYS,
            campaignTypes.GIVEAWAYS_OBJECT,
          ].includes(proposition?.type)
        )
          return isSponsor ? [reinstate, ...toolList] : [];

        return isSponsor
          ? [viewReservation, rejectionNote, reinstate, ...toolList]
          : [viewReservation, rejectionNote];
      case 'unassigned':
      case 'expired': {
        const mainList = [
          campaignTypes.CONTESTS_OBJECT,
          campaignTypes.MENTIONS,
          campaignTypes.GIVEAWAYS,
          campaignTypes.GIVEAWAYS_OBJECT,
        ].includes(proposition?.type)
          ? []
          : [viewReservation];

        if (bothStatus || isUser) return mainList;

        return [...mainList, ...toolList];
      }
      default:
        return [
          campaignTypes.CONTESTS_OBJECT,
          campaignTypes.MENTIONS,
          campaignTypes.GIVEAWAYS,
          campaignTypes.GIVEAWAYS_OBJECT,
        ].includes(proposition?.type)
          ? [realeaseRewards, ...toolList]
          : [realeaseRewards, viewReservation, ...toolList];
    }
  };

  // const getLinkedObj = () => {
  //   if (proposition?.object) {
  //     return proposition?.object?.author_permlink !== proposition?.requiredObject?.author_permlink
  //       ? [proposition?.requiredObject, proposition?.object]
  //       : [proposition?.object];
  //   }
  //
  //   return [];
  // };

  return (
    <React.Fragment>
      <Popover
        placement="bottomRight"
        trigger="click"
        visible={isVisiblePopover}
        onVisibleChange={() => setIsVisiblePopover(!isVisiblePopover)}
        content={<PopoverMenu>{getPopoverItems()}</PopoverMenu>}
      >
        <i className="Buttons__post-menu iconfont icon-more" />
      </Popover>
      {openDecrease && (
        <Modal
          visible={!!openDecrease}
          onCancel={() => {
            setOpenDecrease('');
            setAmount(0);
          }}
          onOk={() => {
            setOpenDecrease('');
            dispatch(decreaseReward(proposition, amount, openDecrease));
          }}
        >
          <b>Amount:</b>
          <Input
            placeholder={'Enter amount'}
            type={'number'}
            onInput={e => setAmountDebounce(e.target.value)}
          />
        </Modal>
      )}
      <Report
        isModalReportOpen={isModalReportOpen}
        toggleModal={() => setIsModalReportOpen(false)}
        sponsor={proposition}
        reservPermlink={proposition?.reservationPermlink}
      />
      <RemoveObjFomPost
        onClose={() => setOpenRejectCapm(false)}
        visible={openRejectCapm}
        campaigns={[{ ...proposition, name: proposition.campaignName }]}
        linkedObj={linkedObjs}
        post={proposition}
      />
    </React.Fragment>
  );
};

RewardsPopover.propTypes = {
  proposition: PropTypes.shape({
    reservationPermlink: PropTypes.string,
    campaignName: PropTypes.string,
    object: PropTypes.shape({ author_permlink: PropTypes.string }),
    userName: PropTypes.string,
    reviewStatus: PropTypes.string,
    reviewPermlink: PropTypes.string,
    rejectionPermlink: PropTypes.string,
    requiredObject: PropTypes.shape({
      author_permlink: PropTypes.string,
    }),
    guideName: PropTypes.string,
    type: PropTypes.string,
    muted: PropTypes.bool,
    isHide: PropTypes.bool,
  }).isRequired,
  type: PropTypes.string.isRequired,
  getProposition: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

RewardsPopover.defaultProps = {
  getProposition: noop,
};

export default injectIntl(RewardsPopover);
