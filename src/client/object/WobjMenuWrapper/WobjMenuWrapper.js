import { withRouter } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { accessTypesArr, haveAccess } from '../../helpers/wObjectHelper';
import ObjectMenu from '../../components/ObjectMenu';

@withRouter
class WobjMenuWrapper extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    wobject: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    albumsAndImagesCount: PropTypes.number,
  };

  static defaultProps = {
    albumsAndImagesCount: 0,
  };

  onChange = key => {
    const { match, history } = this.props;
    const section = key === 'reviews' ? '' : `/${key}`;
    history.push(`${match.url.replace(/\/$/, '')}${section}`);
  };

  render() {
    const { ...otherProps } = this.props;
    const current = this.props.location.pathname.split('/')[3];
    const currentKey = current || 'reviews';
    let fieldsCount = 0;
    if (this.props.wobject && this.props.wobject.fields && this.props.wobject.fields.length) {
      fieldsCount = this.props.wobject.fields.length + this.props.albumsAndImagesCount;
    }
    const accessExtend = haveAccess(this.props.wobject, this.props.username, accessTypesArr[0]);
    return (
      <ObjectMenu
        accessExtend={accessExtend}
        defaultKey={currentKey}
        onChange={this.onChange}
        {...otherProps}
        fieldsCount={fieldsCount}
      />
    );
  }
}

export default WobjMenuWrapper;
