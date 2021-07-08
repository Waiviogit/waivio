import React from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';

import { getExpertiseCounters, getWobjectsWithUserWeight } from '../../waivioApi/ApiClient';
import ObjectDynamicList from '../object/ObjectDynamicList';
import { getUser } from '../../store/usersStore/usersSelectors';
import { getLocale } from '../../store/settingsStore/settingsSelectors';

import './UserExpertise.less';

const TabPane = Tabs.TabPane;

@connect((state, ownProps) => ({
  locale: getLocale(state),
  user: getUser(state, ownProps.match.params.name),
}))
export default class UserExpertise extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    locale: PropTypes.string.isRequired,
    user: PropTypes.shape().isRequired,
  };

  static limit = 30;

  state = {
    wobjectsExpCount: 0,
    hashtagsExpCount: 0,
  };

  componentDidMount() {
    getExpertiseCounters(this.props.user.name).then(({ hashtagsExpCount, wobjectsExpCount }) =>
      this.setState({
        hashtagsExpCount,
        wobjectsExpCount,
      }),
    );
  }

  fetcher = (skip, authUser, isOnlyHashtags) => {
    const { match, locale } = this.props;

    return getWobjectsWithUserWeight(
      match.params.name,
      skip,
      UserExpertise.limit,
      authUser,
      isOnlyHashtags ? ['hashtag'] : null,
      !isOnlyHashtags ? ['hashtag'] : null,
      locale,
    );
  };

  render() {
    const { wobjectsExpCount, hashtagsExpCount } = this.state;

    return (
      <div className="UserExpertise">
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <React.Fragment>
                <span className="UserExpertise__item">
                  <FormattedMessage id="hashtag_value_placeholder" defaultMessage="Hashtags" />
                </span>
                {!!hashtagsExpCount && (
                  <span className="UserExpertise__badge">
                    <FormattedNumber value={hashtagsExpCount} />
                  </span>
                )}
              </React.Fragment>
            }
            key="1"
          >
            <ObjectDynamicList
              isOnlyHashtags
              limit={UserExpertise.limit}
              fetcher={this.fetcher}
              expertize
            />
          </TabPane>
          <TabPane
            tab={
              <React.Fragment>
                <span className="UserExpertise__item">
                  <FormattedMessage id="objects" defaultMessage="Objects" />
                </span>
                {!!wobjectsExpCount && (
                  <span className="UserExpertise__badge">
                    <FormattedNumber value={wobjectsExpCount} />
                  </span>
                )}
              </React.Fragment>
            }
            key="2"
          >
            <ObjectDynamicList limit={UserExpertise.limit} fetcher={this.fetcher} expertize />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
