import React from 'react';
import { Icon, message } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import RightSidebarLoading from '../../../client/app/Sidebar/RightSidebarLoading';
import { getWobjectsWithUserWeight } from '../../../waivioApi/ApiClient';
import ObjectCard from './ObjectCard';
import WeightTag from '../WeightTag';

import './ObjectWeightBlock.less';

class ObjectWeightBlock extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    authUser: PropTypes.string,
    locale: PropTypes.string,
  };

  static defaultProps = {
    authUser: '',
    locale: 'en-US',
  };

  state = {
    wObjects: [],
    wObjectsCount: 0,
    loading: true,
  };

  componentDidMount() {
    getWobjectsWithUserWeight(
      this.props.username,
      0,
      5,
      this.props.authUser,
      null,
      null,
      this.props.locale,
    )
      .then(response => {
        this.setState({
          wObjects: response.wobjects,
          wObjectsCount: response.wobjects_count,
          loading: false,
        });
      })
      .catch(error => {
        this.setState({ wObjects: [], loading: false });
        message.error(error);
      });
  }

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
          {wObjectsCount > 5 && (
            <React.Fragment>
              <h4 className="ObjectWeightBlock__more">
                <Link to={`/@${username}/expertise`}>
                  <FormattedMessage id="show_more" defaultMessage="Show more" />
                </Link>
              </h4>
            </React.Fragment>
          )}
        </div>
      </div>
    ) : null;
  }
}

export default ObjectWeightBlock;
