import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { getObject } from '../../../waivioApi/ApiClient';

const ShopMainForWobject = ({ wobjPermlink }) => {
  useEffect(() => {
    getObject(wobjPermlink);
  }, []);

  return <div>fefefgser</div>;
};

ShopMainForWobject.propTypes = {
  wobjPermlink: PropTypes.string.isRequired,
};

export default ShopMainForWobject;
