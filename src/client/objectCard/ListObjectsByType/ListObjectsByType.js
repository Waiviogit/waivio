import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import './ListObjectsByType.less';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getClientWObj } from '../../adapters';

export default class ListObjectsByType extends React.Component {
  static propTypes = {
    wobjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    showSmallVersion: PropTypes.bool,
  };

  static defaultProps = {
    handleObjectCount: () => {},
    getObjectType: () => {},
    showSmallVersion: true,
  };

  state = {
    hasMore: true,
  };

  render() {
    const { hasMore } = this.state;
    const empty = !hasMore && this.props.wobjects.length === 0;

    return (
      <div className="ListObjectsByType">
        {_.map(this.props.wobjects, wobj => {
          const wo = getClientWObj(wobj);
          return (
            <ObjectCardView
              showSmallVersion={this.props.showSmallVersion}
              key={wo.id}
              wObject={wo}
            />
          );
        })}
        {empty && (
          <div className="ListObjectsByType__empty">
            <FormattedMessage id="list_empty" defaultMessage="Nothing is there" />
          </div>
        )}
      </div>
    );
  }
}
