import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import * as api from '../../../waivioApi/ApiClient';
import ObjectCard from './ObjectCard';
import WeightTag from '../WeightTag';
import './ObjectWeightBlock.less';
import RightSidebarLoading from '../../../client/app/Sidebar/RightSidebarLoading';

const OBJECTS_COUNT = 5;

class ObjectWeightBlock extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
  };

  state = {
    wObjects: [],
    wObjectsCount: 0,
    loading: true,
    limit: OBJECTS_COUNT,
  };

  async componentDidMount() {
    try {
      const response = await api.getWobjectsWithUserWeight(this.props.username, 0, OBJECTS_COUNT);
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

  showMoreExpertise = () => {
    api
      .getWobjectsWithUserWeight(this.props.username, this.state.wObjects.length, OBJECTS_COUNT)
      .then(data =>
        this.setState({
          wObjects: [...this.state.wObjects, ...data.wobjects],
        }),
      );
  };

  render() {
    const { username } = this.props;
    const { wObjects, loading, wObjectsCount } = this.state;

    if (loading) {
      return <RightSidebarLoading />;
    }

    return wObjects.length ? (
      <div className="ObjectWeightBlock SidebarContentBlock">
        <h4 className="SidebarContentBlock__title title">
          <Icon type="codepen" className="ObjectWeightBlock__icon" />{' '}
          <FormattedMessage id="user_expertise" defaultMessage="Expertise" />
        </h4>
        <div className="SidebarContentBlock__content">
          {wObjects &&
            wObjects.map(wobject => (
              <ObjectCard
                key={wobject.author_permlink}
                wobject={wobject}
                showFollow={false}
                alt={<WeightTag weight={wobject.user_weight} />}
              />
            ))}
          {wObjectsCount > OBJECTS_COUNT && (
            <div className="ObjectWeightBlock__buttons-wrap">
              <Link
                className="ObjectWeightBlock__buttons-wrap-show-all-btn"
                to={`/@${username}/expertise`}
              >
                <FormattedMessage id="show_all" defaultMessage="Show All" />
              </Link>
              <div
                className="ObjectWeightBlock__buttons-wrap-show-more-btn"
                onClick={this.showMoreExpertise}
                role="presentation"
              >
                <FormattedMessage id="show_more" defaultMessage="Show more" />
              </div>
            </div>
          )}
        </div>
      </div>
    ) : null;
  }
}

export default ObjectWeightBlock;
