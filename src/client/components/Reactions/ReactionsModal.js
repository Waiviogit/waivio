import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { Tabs, Modal } from 'antd';
import ReactionsList from './ReactionsList';
import ApprovingCard from '../../object/AppendCard/ApprovingCard';
import { getCommentReactions } from '../../../waivioApi/ApiClient';

const { TabPane } = Tabs;

const ReactionsModal = ({
  visible = false,

  downVotes = [],
  tab = '1',
  onClose = () => {},
  append = false,
  post = {},
  user = '',
  setTabs = () => {},
  comment,
}) => {
  const [tabKey, setTabKey] = useState('1');
  const [upVotes, setUpVotes] = useState([]);

  useEffect(() => {
    comment &&
      visible &&
      getCommentReactions(comment.author, comment.permlink).then(r => setUpVotes(r));
  }, [visible, comment?.url]);

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
            <ReactionsList votes={upVotes} name={user} />
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
  downVotes: PropTypes.arrayOf(PropTypes.shape({})),
  tab: PropTypes.string,
  onClose: PropTypes.func,
  append: PropTypes.bool,
  post: PropTypes.shape({}),
  user: PropTypes.string,
  setTabs: PropTypes.func,
};

export default ReactionsModal;
