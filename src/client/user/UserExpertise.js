import React from 'react';
import { Icon, Tabs } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { getWobjectsWithUserWeight } from '../../waivioApi/ApiClient';
import ObjectDynamicList from '../object/ObjectDynamicList';
import './UserExpertise.less';

const TabPane = Tabs.TabPane;

export default class UserExpertise extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
  };

  static limit = 30;

  state = {
    objCount: 0,
    tagCount: 0,
  };

  fetcher = skip => {
    const { match } = this.props;
    return getWobjectsWithUserWeight(match.params.name, skip, UserExpertise.limit);
  };

  objectCount = count =>
    count ? this.setState({ objCount: count }) : this.setState({ objCount: 0 });

  render() {
    const { objCount, tagCount } = this.state;

    return (
      <div className="UserExpertise">
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <React.Fragment>
                <span className="UserExpertise__item">
                  <FormattedMessage id="objects" defaultMessage="Objects" />
                </span>
                <span className="UserExpertise__badge">
                  {objCount ? <FormattedNumber value={objCount} /> : <Icon type="loading" />}
                </span>
              </React.Fragment>
            }
            key="1"
          >
            <ObjectDynamicList
              limit={UserExpertise.limit}
              fetcher={this.fetcher}
              handleObjectCount={this.objectCount}
            />
          </TabPane>
          <TabPane
            tab={
              <React.Fragment>
                <span className="UserExpertise__item">
                  <FormattedMessage id="hashtag_value_placeholder" defaultMessage="Hashtags" />
                </span>
                <span className="UserExpertise__badge">
                  <FormattedNumber value={tagCount} />
                </span>
              </React.Fragment>
            }
            key="2"
          >
            Hashtags
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
