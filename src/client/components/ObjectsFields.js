import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ObjectField from '../components/ObjectField';
import Loading from '../components/Icon/Loading';
import './ObjectsFields.less';

class ObjectsFields extends Component {
  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.shape()),
    maxItems: PropTypes.number,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    fields: [],
    maxItems: 5,
    loading: false,
  };

  state = {
    showMore: false,
  };

  changeVisibility(showMore) {
    this.setState({ showMore });
  }

  render() {
    const { fields, maxItems, loading } = this.props;

    const displayedFields = this.state.showMore ? fields : fields.slice(0, maxItems);

    return (
      <div className="Topics">
        <h4>
          <FormattedMessage id="object_fields" defaultMessage="Object's Links" />
        </h4>
        {loading && <Loading center={false} />}
        {!loading && (
          <ul className="Topics__list">
            {_.map(displayedFields, (field, idx) => (
              <li key={idx}>
                <ObjectField name={field.name} />
              </li>
            ))}
          </ul>
        )}
        {!loading && fields.length > maxItems && !this.state.showMore ? (
          <a role="button" tabIndex={0} onClick={() => this.changeVisibility(true)}>
            <FormattedMessage id="show_more" defaultMessage="View more" />
          </a>
        ) : null}
        {!loading && fields.length > maxItems && this.state.showMore ? (
          <a role="button" tabIndex={0} onClick={() => this.changeVisibility(false)}>
            <FormattedMessage id="show_less" defaultMessage="View less" />
          </a>
        ) : null}
      </div>
    );
  }
}

export default ObjectsFields;
