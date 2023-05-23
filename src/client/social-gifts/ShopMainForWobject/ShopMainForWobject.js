import React from 'react';
// import PropTypes from 'prop-types';
// import { get } from 'lodash';
//
// import { getObject, getObjectsByIds } from '../../../waivioApi/ApiClient';
// import { parseJSON } from '../../../common/helpers/parseJSON';

const ShopMainForWobject = () => (
  // useEffect(() => {
  //   getObject(wobjPermlink).then(res => {
  //     const menuItemLinks = res.menuItem.map(item => parseJSON(item.body)?.linkToObject);
  //     const customSort = get(res, 'sortCustom.include', []);
  //
  //     getObjectsByIds({ authorPermlinks: menuItemLinks }).then(u => {
  //       const compareList = res.menuItem.map(l => {
  //         const y = u.wobjects.find(
  //           wobj => wobj.author_permlink === parseJSON(l.body)?.linkToObject,
  //         );
  //
  //         return {
  //           ...l,
  //           ...y,
  //         };
  //       });
  //
  //       const sortingButton = customSort.reduce((acc, curr) => {
  //         const findObj = compareList.find(wobj => wobj.permlink === curr);
  //
  //         return findObj ? [...acc, findObj] : acc;
  //       }, []);
  //     });
  //   });
  // }, []);

  <div>fefefgser</div>
);

// ShopMainForWobject.propTypes = {
// wobjPermlink: PropTypes.string.isRequired,
// };

export default ShopMainForWobject;
