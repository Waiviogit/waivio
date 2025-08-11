import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Cookie from 'js-cookie';
import { FormattedNumber } from 'react-intl';
import { get } from 'lodash';
import { Tabs, Modal } from 'antd';
import ReactionsList from './ReactionsList';
import ApprovingCard from '../../object/AppendCard/ApprovingCard';
import { getCommentReactions } from '../../../waivioApi/ApiClient';
import { getRate, getRewardFund } from '../../../store/appStore/appSelectors';
import { getTokenRatesInUSD } from '../../../store/walletStore/walletSelectors';

const { TabPane } = Tabs;

const ReactionsModal = ({
  visible = false,
  initialUpVotes,
  initialDownVotes = [],
  tab = '1',
  onClose = () => {},
  append = false,
  post = {},
  user = '',
  setTabs = () => {},
  comment,
}) => {
  const [tabKey, setTabKey] = useState('1');
  const [upVotes, setUpVotes] = useState(initialUpVotes || []);
  const [downVotes, setDownVotes] = useState(initialDownVotes || []);
  const rewardFund = useSelector(getRewardFund);
  const rate = useSelector(getRate);
  const isFullParams = rewardFund && rewardFund.recent_claims && rewardFund.reward_balance && rate;
  const rates = useSelector(state => getTokenRatesInUSD(state, 'WAIV'));
  const waivPayout = comment?.total_rewards_WAIV
    ? get(comment, 'total_rewards_WAIV', 0) * rates
    : get(comment, 'total_payout_WAIV', 0) * rates;
  const userPin = Cookie.get('userPin');

  useEffect(() => {
    if ((comment && visible && !initialUpVotes) || userPin)
      getCommentReactions(
        comment?.author || post?.author,
        comment?.permlink || post?.permlink,
      ).then(r => {
        const ups = [];
        const downs = [];

        r.forEach(vote => {
          if (vote.percent && vote.percent < 0) {
            downs.push(vote);
          }
          if (vote.percent && vote.percent > 0 && vote.rshares > 0) {
            ups.push(vote);
          }
        });

        setUpVotes(ups);
        setDownVotes(downs);
      });
  }, [visible, comment?.url]);

  const upVotesWithPayout =
    initialUpVotes && !userPin
      ? upVotes
      : upVotes.map(v => {
          const rewardBalance = parseFloat(rewardFund.reward_balance.replace(' HIVE', ''));
          const recentClaims = parseFloat(rewardFund.recent_claims);
          const payout = (v.rshares / recentClaims) * rewardBalance * rate;

          return {
            ...v,
            payout: isFullParams ? payout + waivPayout / upVotes.length : 0,
          };
        });

  const handleModalClose = () => {
    setTabKey('1');
    onClose();
  };

  const currentSetter = append ? setTabs : setTabKey;
  const currentKey = append ? tab : tabKey;

  const hasVotes = upVotes?.length > 0 || downVotes.length > 0;

  return (
    <Modal visible={visible && hasVotes} footer={null} onCancel={handleModalClose} destroyOnClose>
      {append && <ApprovingCard post={post} modal />}
      <Tabs onTabClick={key => currentSetter(key)} activeKey={currentKey}>
        {upVotes.length > 0 && (
          <TabPane
            tab={
              <span>
                <i className="iconfont icon-praise_fill" />
                <span className="StoryFooter__icon-text StoryFooter__icon-text--margin">
                  <FormattedNumber value={upVotes.length} />
                </span>
              </span>
            }
            key="1"
          >
            <ReactionsList votes={upVotesWithPayout} name={user} />
          </TabPane>
        )}
        {downVotes.length > 0 && (
          <TabPane
            tab={
              <span>
                <i className="iconfont icon-praise_fill StoryFooter__dislike" />
                <span className="StoryFooter__icon-text StoryFooter__icon-text-dislike StoryFooter__icon-text--margin">
                  <FormattedNumber value={downVotes.length} />
                </span>
              </span>
            }
            key="2"
          >
            <ReactionsList votes={downVotes} name={user} />
          </TabPane>
        )}
      </Tabs>
    </Modal>
  );
};

ReactionsModal.propTypes = {
  visible: PropTypes.bool,
  comment: PropTypes.shape(),
  initialDownVotes: PropTypes.arrayOf(PropTypes.shape({})),
  initialUpVotes: PropTypes.arrayOf(PropTypes.shape({})),
  tab: PropTypes.string,
  onClose: PropTypes.func,
  append: PropTypes.bool,
  post: PropTypes.shape({}),
  user: PropTypes.string,
  setTabs: PropTypes.func,
};

export default ReactionsModal;
