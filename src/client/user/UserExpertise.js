import React from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';

import { getLocale, getUser } from '../reducers';
import { getWobjectsWithUserWeight } from '../../waivioApi/ApiClient';
import ObjectDynamicList from '../object/ObjectDynamicList';

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
    objCount: this.props.user.wobjectsExpCount,
    hashtagsCount: this.props.user.hashtagsExpCount,
  };

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
    const { objCount, hashtagsCount } = this.state;

    return (
      <div className="UserExpertise">
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <React.Fragment>
                <span className="UserExpertise__item">
                  <FormattedMessage id="hashtag_value_placeholder" defaultMessage="Hashtags" />
                </span>
                {!!hashtagsCount && (
                  <span className="UserExpertise__badge">
                    <FormattedNumber value={hashtagsCount} />
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
                {!!objCount && (
                  <span className="UserExpertise__badge">
                    <FormattedNumber value={objCount} />
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
