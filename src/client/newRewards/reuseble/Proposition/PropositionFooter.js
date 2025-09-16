import React, { useEffect, useMemo, useState } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty, noop } from 'lodash';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useLocation } from 'react-router';
import classnames from 'classnames';

import RewardsPopover from '../../RewardsPopover/RewardsPopover';
import Avatar from '../../../components/Avatar';
import QuickCommentEditor from '../../../components/Comments/QuickCommentEditor';
import {
  reserveProposition,
  sendCommentForMentions,
  sendCommentForReward,
  sendInitialCommentForMentions,
} from '../../../../store/newRewards/newRewardsActions';
import {
  getAuthenticatedUserName,
  getAuthUserSignature,
  getAuthenticatedUser,
} from '../../../../store/authStore/authSelectors';
import { getPostCommentsFromApi } from '../../../../waivioApi/ApiClient';
import CommentCard from '../../Comments/CommentCard';
import config from '../../../../waivioApi/routes';
import { getIsSocial, getIsWaivio } from '../../../../store/appStore/appSelectors';
import WebsiteReservedButtons from '../../../rewards/Proposition/WebsiteReservedButtons/WebsiteReservedButtons';
import { getDaysLeftForNew, campaignTypes } from '../../../rewards/rewardsHelper';
import ReservedButtons from '../../../rewards/Proposition/WebsiteReservedButtons/ReservedButtons';

import './Proposition.less';

const PropositionFooter = ({
  type,
  openDetailsModal,
  proposition,
  getProposition,
  permlink,
  intl,
  isJudges = false,
}) => {
  const dispatch = useDispatch();
  const authUserName = useSelector(getAuthenticatedUserName);
  const isWaivio = useSelector(getIsWaivio);
  const isSocial = useSelector(getIsSocial);
  const signatureAuth = useSelector(getAuthUserSignature);
  const user = useSelector(getAuthenticatedUser);
  const jsonMetadata = !isEmpty(user) ? JSON.parse(user?.posting_json_metadata) : {};
  const signature = jsonMetadata?.profile?.signature || null;
  const sign = signatureAuth || signature;

  const isMentions = [
    campaignTypes.MENTIONS,
    campaignTypes.GIVEAWAYS_OBJECT,
    campaignTypes.CONTESTS_OBJECT,
  ].includes(proposition?.type);
  const propositionFooterContainerClassList = classnames('Proposition-new__footer-container', {
    'Proposition-new__footer-container--noEligible': proposition.notEligible,
    'Proposition-new__footer-container--reserved': type === 'reserved',
  });
  const sortComents = commList =>
    commList.sort((a, b) => {
      const timestamp1 = new Date(a.created).getTime();
      const timestamp2 = new Date(b.created).getTime();

      return timestamp1 - timestamp2;
    });

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(proposition?.commentsCount);
  const [messagesPermlink, setMessagesPermlink] = useState(proposition?.messagesPermlink);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    if (showComment) setShowComment(false);
    if (location.search?.includes(proposition.reservationPermlink)) handleCommentsClick();
  }, [location.search]);

  const getCommentsList = async (editing, perml, value) => {
    setCommentsLoading(true);
    if (editing) {
      setComments(
        comments.reduce((acc, curr) => {
          if (curr.permlink === perml) return [...acc, { ...curr, body: value }];

          return [...acc, curr];
        }, []),
      );
    } else {
      let opt = {
        author: proposition?.reserved ? authUserName : proposition?.rootName,
        permlink: proposition?.reservationPermlink,
      };

      if (isMentions) {
        const [parent_author, parent_permlink] = messagesPermlink.split('/');

        opt = {
          author: parent_author,
          permlink: parent_permlink,
        };
      }

      const postInfo = await getPostCommentsFromApi({
        ...opt,
        userName: authUserName,
        category: config.appName,
      });

      const commensList = Object.values(postInfo?.content)?.filter(
        comment => comment.permlink !== proposition?.reservationPermlink,
      );

      await setComments(commensList);
      await setShowComment(true);
      await setCommentsCount(commensList?.length);
    }

    await setCommentsLoading(false);
  };

  const handleCommentsClick = async () => {
    if (!showComment && commentsCount) {
      getCommentsList();
    } else {
      setShowComment(false);
    }
  };

  const sendComment = (parentP, commentValue) => {
    setLoading(true);

    if (isMentions) {
      const method = () =>
        messagesPermlink
          ? dispatch(sendCommentForMentions({ ...proposition, messagesPermlink }, commentValue))
          : dispatch(sendInitialCommentForMentions(proposition, commentValue));

      return method().then(comment => {
        const commentList = [
          ...comments,
          {
            body: commentValue,
            created: moment()
              .utc()
              .format('YYYY-MM-DDTHH:mm:ss'),
            author: authUserName,
            active_votes: [],
            ...comment,
          },
        ];

        if (!messagesPermlink) setMessagesPermlink(comment?.messagesPermlink);

        setComments(commentList);
        setCommentsCount(commentList?.length);
        setLoading(false);
      });
    }

    return dispatch(sendCommentForReward(proposition, commentValue)).then(comment => {
      const commentList = [
        ...comments,
        {
          body: commentValue,
          created: moment()
            .utc()
            .format('YYYY-MM-DDTHH:mm:ss'),
          author: authUserName,
          active_votes: [],
          ...comment,
        },
      ];

      setComments(commentList);
      setCommentsCount(commentList?.length);
      setLoading(false);
    });
  };

  const handleReserveForPopup = () => dispatch(reserveProposition(proposition, authUserName));

  const userCard = useMemo(
    () => (
      <div className={'Proposition-new__userCard'}>
        <Avatar size={24} username={proposition?.userName || proposition.rootName} />
        <a href={`/@${proposition?.userName || proposition.rootName}`}>
          {proposition?.userName || proposition.rootName}
        </a>
      </div>
    ),
    [proposition.userName, proposition.rootName],
  );

  const getFooter = () => {
    switch (type) {
      case 'reserved':
        return (
          <React.Fragment>
            <div className={propositionFooterContainerClassList}>
              <div className="Proposition-new__button-container">
                <b>
                  {intl.formatMessage({
                    id: 'campaign_buttons_reserved',
                    defaultMessage: 'Reserved',
                  })}
                </b>
                <b>
                  <span className="Proposition-new__minus">{'-'}</span>
                  {getDaysLeftForNew(
                    proposition?.reservationCreatedAt,
                    proposition?.countReservationDays,
                  )}{' '}
                  {intl.formatMessage({
                    id: 'campaign_buttons_days_left',
                    defaultMessage: 'days left',
                  })}
                </b>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <i className="iconfont icon-message_fill" onClick={handleCommentsClick} />
                  {Boolean(commentsCount) && (
                    <span className="Proposition-new__commentCounter">{commentsCount}</span>
                  )}
                </span>
                <RewardsPopover proposition={proposition} getProposition={getProposition} />
              </div>
              {authUserName === proposition.guideName &&
              proposition.guideName !== proposition.rootName ? (
                userCard
              ) : (
                <Button type="primary" onClick={openDetailsModal}>
                  <span className="Proposition-new__yourRewards">
                    {isWaivio || isSocial ? (
                      intl.formatMessage({ id: 'submit', defaultMessage: 'Submit' })
                    ) : (
                      <span>
                        <b>Submit</b>
                      </span>
                    )}{' '}
                    {isMentions
                      ? intl.formatMessage({ id: 'mentions_lowercase', defaultMessage: 'mentions' })
                      : intl.formatMessage({ id: 'photos_lowercase', defaultMessage: 'photos' })}
                  </span>
                </Button>
              )}
            </div>
            {showComment &&
              sortComents(comments).map(comment => (
                <CommentCard
                  key={`${comment?.author}/${comment?.permlink}`}
                  comment={comment}
                  getMessageHistory={getCommentsList}
                  proposition={proposition}
                />
              ))}
            <QuickCommentEditor onSubmit={sendComment} isLoading={loading} signature={sign} />
          </React.Fragment>
        );
      case 'history':
      case 'reservations':
      case 'messages':
      case 'fraud':
        return (
          <React.Fragment>
            <div className={propositionFooterContainerClassList}>
              <div className="Proposition-new__button-container">
                <b>
                  {intl.formatMessage({
                    id: `type_${proposition?.reviewStatus}`,
                    defaultMessage: proposition?.reviewStatus,
                  })}
                </b>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {commentsLoading ? (
                    <Icon type="loading" />
                  ) : (
                    <i className="iconfont icon-message_fill" onClick={handleCommentsClick} />
                  )}
                  {Boolean(commentsCount) && (
                    <span className="Proposition-new__commentCounter">{commentsCount}</span>
                  )}
                </span>
                <RewardsPopover
                  proposition={proposition}
                  getProposition={getProposition}
                  type={type}
                />
              </div>
              {proposition?.userName && userCard}
            </div>
            {!isEmpty(proposition?.fraudCodes) && (
              <div>
                {intl.formatMessage({ id: 'codes', defaultMessage: 'Codes' })}:{' '}
                {proposition?.fraudCodes.join(', ')}
              </div>
            )}
            {showComment &&
              sortComents(comments).map(comment => (
                <CommentCard
                  key={`${comment?.author}/${comment?.permlink}`}
                  comment={comment}
                  getMessageHistory={getCommentsList}
                  proposition={proposition}
                />
              ))}
            <QuickCommentEditor onSubmit={sendComment} isLoading={loading} signature={sign} />
          </React.Fragment>
        );

      default:
        return isWaivio || isSocial ? (
          <div className="Proposition-new__button-container">
            <ReservedButtons
              handleReserveForPopover={handleReserveForPopup}
              handleReserve={() => {
                openDetailsModal();

                return Promise.resolve();
              }}
              permlink={permlink}
              isJudges={isJudges}
              reservedDays={proposition?.countReservationDays}
              inCard
              type={proposition?.type}
              activationPermlink={proposition?.activationPermlink}
              giveawayUrl={`/@${proposition.guideName}/${proposition.giveawayPermlink}`}
            />
            <span className="Proposition-new__details" onClick={openDetailsModal}>
              {intl.formatMessage({ id: 'details', defaultMessage: 'Details' })}{' '}
              <Icon type="right" />
            </span>
          </div>
        ) : (
          <WebsiteReservedButtons
            dish={{
              ...proposition,
              reserved: type === 'reserved',
              ...proposition.object,
              parent: proposition?.object?.parent,
            }}
            reserved={type === 'reserved'}
            handleReserve={handleReserveForPopup}
            isNewReward
          />
        );
    }
  };

  return (
    <div>
      <div className="Proposition-new__footer">{getFooter()}</div>
    </div>
  );
};

PropositionFooter.propTypes = {
  type: PropTypes.string.isRequired,
  permlink: PropTypes.string,
  openDetailsModal: PropTypes.func.isRequired,
  getProposition: PropTypes.func,
  isJudges: PropTypes.bool,
  proposition: PropTypes.shape({
    reviewStatus: PropTypes.string,
    activationPermlink: PropTypes.string,
    userName: PropTypes.string,
    messagesPermlink: PropTypes.string,
    rootName: PropTypes.string,
    guideName: PropTypes.string,
    giveawayPermlink: PropTypes.string,
    notEligible: PropTypes.bool,
    reserved: PropTypes.bool,
    type: PropTypes.string,
    commentsCount: PropTypes.number,
    countReservationDays: PropTypes.number,
    reservationPermlink: PropTypes.string,
    reservationCreatedAt: PropTypes.string,
    fraudCodes: PropTypes.arrayOf(PropTypes.number),
    object: PropTypes.shape(),
    requiredObject: PropTypes.shape(),
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

PropositionFooter.defaultProps = {
  getProposition: noop,
};

export default injectIntl(PropositionFooter);
