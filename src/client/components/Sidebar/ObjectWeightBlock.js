import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import * as api from '../../../waivioApi/ApiClient';
import ObjectWeightModal from './ObjectWeightModal';
import ObjectCard from './ObjectCard';
import WeightTag from '../WeightTag';
import './ObjectWeightBlock.less';
import RightSidebarLoading from '../../../client/app/Sidebar/RightSidebarLoading';

class ObjectWeightBlock extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
  };

  state = {
    wObjects: [],
    wObjectsCount: 0,
    showModal: false,
    loading: true,
  };

  async componentDidMount() {
    try {
      const response = await api.getWobjectsWithUserWeight(this.props.username, 0, 5);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        wObjects: response.wobjects,
        wObjectsCount: response.wobjects_count,
        loading: false,
      });
    } catch (error) {
      this.setState({ wObjects: [], loading: false }); // eslint-disable-line react/no-did-mount-set-state
      console.log(error);
    }
  }

  toggleModal = () =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));

  render() {
    const { wObjects, loading, showModal, wObjectsCount } = this.state;

    if (loading) {
      return <RightSidebarLoading />;
    }

    return wObjects.length ? (
      <div className="ObjectWeightBlock SidebarContentBlock">
        <h4 className="SidebarContentBlock__title title">
          <Icon type="codepen" className="ObjectWeightBlock__icon" />{' '}
          <FormattedMessage id="related_objects" defaultMessage="Related objects" />
        </h4>
        <div className="SidebarContentBlock__content">
          {wObjects &&
            wObjects.map(wobject => (
              <ObjectCard
                key={wobject.author_permlink}
                wobject={wobject}
                alt={<WeightTag weight={wobject.user_weight} rank={wobject.rank} />}
              />
            ))}
          {wObjectsCount > 5 && (
            <React.Fragment>
              <h4 className="ObjectWeightBlock__more">
                <a role="presentation" onClick={this.toggleModal}>
                  <FormattedMessage id="show_more_objects" defaultMessage="Show more objects" />
                </a>
              </h4>
              <ObjectWeightModal
                username={this.props.username}
                visible={showModal}
                onClose={this.toggleModal}
              />
            </React.Fragment>
          )}
        </div>
      </div>
    ) : null;
  }
}

export default ObjectWeightBlock;
