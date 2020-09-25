import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { Tabs, Modal } from 'antd';
import ReactionsList from './ReactionsList';
import ApprovingCard from '../../object/AppendCard/ApprovingCard';

class ReactionsModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    upVotes: PropTypes.arrayOf(PropTypes.shape()),
    downVotes: PropTypes.arrayOf(PropTypes.shape()),
    ratio: PropTypes.number,
    tab: PropTypes.string,
    onClose: PropTypes.func,
    append: PropTypes.bool,
    post: PropTypes.shape({}),
    user: PropTypes.string,
    setTabs: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    upVotes: [],
    downVotes: [],
    ratio: 0,
    onOpen: () => {},
    onClose: () => {},
    tab: '1',
    append: false,
    post: {},
    moderatorsList: [],
    user: '',
    setTabs: () => {},
  };

  state = {
    visible: false,
    tabKey: '1',
  };

  handleModalClose = () => {
    this.setTabKey('1');
    this.props.onClose();
  };

  setTabKey = key => this.setState({ tabKey: key });

  render() {
    const { upVotes, downVotes, ratio, user, setTabs, tab, append } = this.props;
    const tabs = [];
    const currentSetter = append ? setTabs : this.setTabKey;
    const currentKey = append ? tab : this.state.tabKey;

    if (upVotes.length > 0) {
      tabs.push(
        <Tabs.TabPane
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
          <ReactionsList votes={upVotes} ratio={ratio} name={user} />
        </Tabs.TabPane>,
      );
    }

    if (downVotes.length > 0) {
      tabs.push(
        <Tabs.TabPane
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
          <ReactionsList votes={downVotes} ratio={ratio} name={user} />
        </Tabs.TabPane>,
      );
    }

    return (
      <Modal
        visible={this.props.visible && (upVotes.length > 0 || downVotes.length > 0)}
        footer={null}
        onCancel={this.handleModalClose}
        destroyOnClose
      >
        {this.props.append && <ApprovingCard post={this.props.post} modal />}
        <Tabs onTabClick={key => currentSetter(key)} activeKey={currentKey}>
          {tabs}
        </Tabs>
      </Modal>
    );
  }
}

export default ReactionsModal;
