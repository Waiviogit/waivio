import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { getObjectTypesList, getObjectTypeLoading } from '../reducers';
import { getObjectType } from '../objectTypes/objectTypeActions';
import { getObjectTypes } from '../objectTypes/objectTypesActions';
import Loading from '../components/Icon/Loading';

@connect(
  state => ({
    typesList: getObjectTypesList(state),
    isFetching: getObjectTypeLoading(state),
  }),
  {
    dispatchGetObjectType: getObjectType,
    dispatchGetObjectTypes: getObjectTypes,
  },
)
class DiscoverObjectsContent extends Component {
  static propTypes = {
    /* from connect */
    typesList: PropTypes.shape().isRequired,
    isFetching: PropTypes.bool.isRequired,
    dispatchGetObjectType: PropTypes.func.isRequired,
    dispatchGetObjectTypes: PropTypes.func.isRequired,
    /* passed props */
    typeName: PropTypes.string,
  };

  static defaultProps = {
    typeName: '',
  };

  componentDidMount() {
    const { dispatchGetObjectType, dispatchGetObjectTypes, typeName, typesList } = this.props;
    dispatchGetObjectType(typeName, 0, {});
    if (isEmpty(typesList)) dispatchGetObjectTypes();
  }

  render() {
    const { isFetching, typeName } = this.props;
    return isFetching ? (
      <Loading />
    ) : (
      <React.Fragment>
        Discover objects content
        <div>match.path: {typeName}</div>
      </React.Fragment>
    );
  }
}

export default DiscoverObjectsContent;
