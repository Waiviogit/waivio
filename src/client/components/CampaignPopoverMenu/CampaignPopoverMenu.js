// import React from 'react';
// import PropTypes from 'prop-types';
// import {Icon} from 'antd';
// import classNames from 'classnames';
// import Popover from '../Popover';
// import PopoverMenu, {PopoverMenuItem} from '../PopoverMenu/PopoverMenu';
//
// const propTypes = {
//   pendingFollow: PropTypes.bool,
//   pendingFollowObject: PropTypes.bool,
//   postState: PropTypes.shape({
//     objectFollowed: PropTypes.bool,
//     userFollowed: PropTypes.bool,
//   }).isRequired,
//   handlePostPopoverMenuClick: PropTypes.func,
//   requiredObjectName: PropTypes.string.isRequired,
//   propositionGuideName: PropTypes.string.isRequired,
//   match: PropTypes.shape().isRequired,
//   proposition: PropTypes.shape().isRequired,
//   user: PropTypes.shape().isRequired,
//   toggleModal: PropTypes.func,
//   intl: PropTypes.shape().isRequired,
// };
//
// const defaultProps = {
//   pendingFollow: false,
//   pendingFollowObject: false,
//   handlePostPopoverMenuClick: () => {},
//   toggleModal: () => {},
// };
//
// const CampaignPopoverMenu = (pendingFollow, pendingFollowObject, postState, handlePostPopoverMenuClick,
//                              requiredObjectName, postAuthor,
//                              propositionGuideName, match, proposition, user, toggleModal, intl ) => {
//   let followText = "";
//
//   if (postState.userFollowed) {
//     followText = intl.formatMessage(
//       { id: 'unfollow_username', defaultMessage: 'Unfollow {username}' },
//       { username: propositionGuideName },
//     );
//   } else {
//     followText = intl.formatMessage(
//       { id: 'follow_username', defaultMessage: 'Follow {username}' },
//       { username: propositionGuideName },
//     );
//   }
//
//   const followObjText = "";
//
//   let popoverMenu = [];
//   popoverMenu = [
//     ...popoverMenu,
//     <PopoverMenuItem key="follow" disabled={pendingFollow}>
//       {pendingFollow ? <Icon type="loading" /> : <i className="iconfont icon-people" />}
//       {followText}
//     </PopoverMenuItem>
//   ];
//   popoverMenu = [
//     ...popoverMenu,
//     <PopoverMenuItem key="followObject" disabled={pendingFollowObject}>
//       {pendingFollowObject ? (
//         <Icon type="loading" />
//       ) : (
//         <Icon type="codepen" className="CampaignFooter__button-icon" />
//       )}
//       {followObjText}
//     </PopoverMenuItem>,
//   ];
//
//   popoverMenu = [
//     ...popoverMenu,
//     <PopoverMenuItem key="release" disabled={pendingFollow}>
//       <i
//         className={classNames('iconfont', {
//           'icon-flag': !postState.isReported,
//           'icon-flag_fill': postState.isReported,
//         })}
//       />
//       {this.props.intl.formatMessage({
//         id: 'campaign_buttons_release',
//         defaultMessage: 'Release reservation',
//       })}
//     </PopoverMenuItem>,
//   ];
//
//   return (
//   <Popover
//     placement="bottomRight"
//     trigger="click"
//     visible={visible}
//     onVisibleChange={onVisibleChange}
//     content={
//       <PopoverMenu onSelect={handlePostPopoverMenuClick} bold={false}>
//         {popoverMenu}
//       </PopoverMenu>
//     }
//   >
//     <i className="Buttons__post-menu iconfont icon-more"/>
//   </Popover>
// )}
//
// CampaignPopoverMenu.propTypes = propTypes;
// CampaignPopoverMenu.defaultProps = defaultProps;
//
// export default CampaignPopoverMenu;
