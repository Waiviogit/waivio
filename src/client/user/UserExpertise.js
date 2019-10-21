import React from 'react';
import { Tabs } from 'antd';
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
    hashtagsCount: 0,
    tagCount: 0,
  };

  fetcher = (skip, isOnlyHashtags) => {
    const { match } = this.props;
    return getWobjectsWithUserWeight(
      match.params.name,
      skip,
      UserExpertise.limit,
      isOnlyHashtags ? ['hashtag'] : null,
      !isOnlyHashtags ? ['hashtag'] : null,
    );
  };

  objectCount = (count, isOnlyHashtags) => {
    const { hashtagsCount, objCount } = this.state;
    if (isOnlyHashtags && hashtagsCount !== count) {
      this.setState({ hashtagsCount: count });
    } else if (!isOnlyHashtags && objCount !== count) {
      this.setState({ objCount: count });
    }
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
              handleObjectCount={this.objectCount}
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
            <ObjectDynamicList
              limit={UserExpertise.limit}
              fetcher={this.fetcher}
              handleObjectCount={this.objectCount}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
