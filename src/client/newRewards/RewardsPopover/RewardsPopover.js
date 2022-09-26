import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Icon, Input, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce, noop } from 'lodash';
import { Link } from 'react-router-dom';

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
import { checkUserFollowing, checkUserInBlackList } from '../../../waivioApi/ApiClient';
import { followUser, unfollowUser } from '../../../store/userStore/userActions';
import { changeBlackAndWhiteLists } from '../../../store/rewardsStore/rewardsActions';
import ids from '../BlackList/constants';
import { followObject, unfollowObject } from '../../../store/wObjectStore/wobjActions';
import { getObjectName } from '../../../common/helpers/wObjectHelper';

const RewardsPopover = ({ proposition, getProposition, type }) => {
  const [isVisiblePopover, setIsVisiblePopover] = useState(false);
  const [amount, setAmount] = useState(0);
  const [inBlackList, setInBlackList] = useState(false);
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

  useEffect(() => {
    if (isVisiblePopover && !bothStatus) {
      if (isSponsor)
        checkUserInBlackList(proposition?.userName, proposition?.guideName).then(res =>
          setInBlackList(res.inBlacklist),
        );
      if (isUser) {
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
  }, [isVisiblePopover]);

  const getPopoverItems = () => {
    const viewReservation = useMemo(
      () => (
        <PopoverMenuItem key={'view_reservation'}>
          <Link to={`/@${proposition?.userName}/${proposition?.reservationPermlink}`}>
            View reservation
          </Link>
        </PopoverMenuItem>
      ),
      [proposition?.userName, proposition?.reservationPermlink],
    );

    const decrease = useMemo(
      () => (
        <PopoverMenuItem key={'decrease'}>
          <div role="presentation" onClick={() => openDecreaseModal('decrease')}>
            Decrease reward
          </div>
        </PopoverMenuItem>
      ),
      [],
    );

    const increase = useMemo(
      () => (
        <PopoverMenuItem key={'increase'}>
          <div role="presentation" onClick={() => openDecreaseModal('increase')}>
            Increase reward
          </div>
        </PopoverMenuItem>
      ),
      [],
    );

    const openReview = useMemo(
      () => (
        <PopoverMenuItem key={'open_review'}>
          <Link to={`/@${proposition?.userName}/${proposition?.reviewPermlink}`}>Open review</Link>
        </PopoverMenuItem>
      ),
      [proposition?.userName, proposition?.reviewPermlink],
    );

    const rejectionNote = useMemo(
      () => (
        <PopoverMenuItem key={'rejection_note'}>
          <Link to={`/@${proposition?.userName}/${proposition?.rejectionPermlink}`}>
            Rejection note
          </Link>
        </PopoverMenuItem>
      ),
      [proposition?.userName, proposition?.reviewPermlink],
    );

    const report = useMemo(
      () => (
        <PopoverMenuItem key={'show_report'}>
          <div onClick={() => setIsModalReportOpen(true)}>Show report</div>
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
            {followingGuide ? 'Unfollow' : 'Follow'} @{proposition?.guideName}
          </div>
        </PopoverMenuItem>
      ),
      [followingGuide, loadingType],
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
            {followingObj ? 'Unfollow' : 'Follow'} {getObjectName(proposition?.requiredObject)}
          </div>
        </PopoverMenuItem>
      ),
      [followingGuide, loadingType],
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
            {inBlackList ? 'Remove from blacklist' : 'Add to blacklist'} @{proposition?.userName}
          </div>
        </PopoverMenuItem>
      ),
      [inBlackList, loadingType],
    );

    const rejectRewards = useMemo(
      () => (
        <PopoverMenuItem key={'release'}>
          <div role="presentation" onClick={rejectReward}>
            <Icon type="flag" /> Release reservation
          </div>
        </PopoverMenuItem>
      ),
      [],
    );

    const realeaseRewards = useMemo(
      () => (
        <PopoverMenuItem key={'release'}>
          <div role="presentation" onClick={realeaseReward}>
            <Icon type="flag" /> Release reservation
          </div>
        </PopoverMenuItem>
      ),
      [],
    );

    const reinstate = useMemo(
      () => (
        <PopoverMenuItem key={'release'}>
          <div role="presentation" onClick={handleReinstateReward}>
            Reinstate reward
          </div>
        </PopoverMenuItem>
      ),
      [],
    );

    switch (rewiewType) {
      case 'reserved':
      case 'assigned': {
        const mainList = [rejectRewards, viewReservation];

        if (bothStatus) return mainList;

        return isSponsor
          ? [...mainList, decrease, addToBlackList]
          : [...mainList, increase, followUserItem, followObjectItem];
      }
      case 'completed': {
        const mainList = [viewReservation, openReview, report];

        if (bothStatus) return mainList;

        return isSponsor
          ? [...mainList, rejectRewards, addToBlackList]
          : [...mainList, decrease, followUserItem, followObjectItem];
      }
      case 'rejected':
        return [viewReservation, rejectionNote, addToBlackList, reinstate];
      case 'unassigned':
      case 'expired': {
        const mainList = [viewReservation];

        if (bothStatus) return mainList;

        return isSponsor ? [...mainList, addToBlackList] : mainList;
      }
      default:
        return [realeaseRewards, viewReservation];
    }
  };

  const realeaseReward = () => {
    setIsVisiblePopover(false);
    Modal.confirm({
      title: 'Release reservation',
      content: 'Do you want to release this reservation?',
      onOk() {
        return new Promise(resolve => {
          dispatch(realiseRewards(proposition)).then(() => {
            getProposition().then(() => {
              resolve();
            });
          });
        });
      },
    });
  };

  const rejectReward = () => {
    setIsVisiblePopover(false);
    Modal.confirm({
      title: 'Release reservation',
      content: 'Do you want to release this reservation?',
      onOk() {
        return new Promise(resolve => {
          dispatch(rejectAuthorReview(proposition)).then(() => {
            getProposition().then(() => {
              resolve();
            });
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
          dispatch(reinstateReward(proposition)).then(() => {
            getProposition().then(() => {
              resolve();
            });
          });
        });
      },
    });
  };

  const openDecreaseModal = () => {
    setIsVisiblePopover(false);
    setOpenDecrease(true);
  };

  const setAmountDebounce = useCallback(
    debounce(value => {
      setAmount(value);
    }, 300),
    [],
  );

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
          visible={openDecrease}
          onCancel={() => {
            setOpenDecrease('');
            setAmount(0);
          }}
          onOk={() => {
            setOpenDecrease(false);
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
    </React.Fragment>
  );
};

RewardsPopover.propTypes = {
  proposition: PropTypes.shape({
    reservationPermlink: PropTypes.string,
    userName: PropTypes.string,
    reviewStatus: PropTypes.string,
    reviewPermlink: PropTypes.string,
    rejectionPermlink: PropTypes.string,
    requiredObject: PropTypes.string,
    guideName: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
  getProposition: PropTypes.func,
};

RewardsPopover.defaultProps = {
  getProposition: noop,
};

export default RewardsPopover;
