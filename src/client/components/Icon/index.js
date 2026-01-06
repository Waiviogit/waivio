import React from 'react';
import PropTypes from 'prop-types';
import * as Icons from '@ant-design/icons';

// Map old icon type names to new @ant-design/icons components
const iconTypeMap = {
  // Navigation icons
  'menu': Icons.MenuOutlined,
  'menu-fold': Icons.MenuFoldOutlined,
  'menu-unfold': Icons.MenuUnfoldOutlined,
  'close': Icons.CloseOutlined,
  'close-circle': Icons.CloseCircleOutlined,
  'close-circle-o': Icons.CloseCircleOutlined,
  'check': Icons.CheckOutlined,
  'check-circle': Icons.CheckCircleOutlined,
  'check-circle-o': Icons.CheckCircleOutlined,
  
  // Arrows
  'arrow-left': Icons.ArrowLeftOutlined,
  'arrow-right': Icons.ArrowRightOutlined,
  'arrow-up': Icons.ArrowUpOutlined,
  'arrow-down': Icons.ArrowDownOutlined,
  'left': Icons.LeftOutlined,
  'right': Icons.RightOutlined,
  'up': Icons.UpOutlined,
  'down': Icons.DownOutlined,
  'caret-down': Icons.CaretDownOutlined,
  'caret-up': Icons.CaretUpOutlined,
  'caret-left': Icons.CaretLeftOutlined,
  'caret-right': Icons.CaretRightOutlined,
  'double-left': Icons.DoubleLeftOutlined,
  'double-right': Icons.DoubleRightOutlined,
  
  // User and people
  'user': Icons.UserOutlined,
  'user-add': Icons.UserAddOutlined,
  'team': Icons.TeamOutlined,
  
  // Actions
  'search': Icons.SearchOutlined,
  'plus': Icons.PlusOutlined,
  'plus-circle': Icons.PlusCircleOutlined,
  'plus-circle-o': Icons.PlusCircleOutlined,
  'minus': Icons.MinusOutlined,
  'minus-circle': Icons.MinusCircleOutlined,
  'minus-circle-o': Icons.MinusCircleOutlined,
  'edit': Icons.EditOutlined,
  'delete': Icons.DeleteOutlined,
  'setting': Icons.SettingOutlined,
  'reload': Icons.ReloadOutlined,
  'sync': Icons.SyncOutlined,
  'save': Icons.SaveOutlined,
  'undo': Icons.UndoOutlined,
  'redo': Icons.RedoOutlined,
  'copy': Icons.CopyOutlined,
  'scissor': Icons.ScissorOutlined,
  'loading': Icons.LoadingOutlined,
  
  // Status
  'info': Icons.InfoOutlined,
  'info-circle': Icons.InfoCircleOutlined,
  'info-circle-o': Icons.InfoCircleOutlined,
  'exclamation': Icons.ExclamationOutlined,
  'exclamation-circle': Icons.ExclamationCircleOutlined,
  'exclamation-circle-o': Icons.ExclamationCircleOutlined,
  'question': Icons.QuestionOutlined,
  'question-circle': Icons.QuestionCircleOutlined,
  'question-circle-o': Icons.QuestionCircleOutlined,
  'warning': Icons.WarningOutlined,
  
  // Media
  'picture': Icons.PictureOutlined,
  'camera': Icons.CameraOutlined,
  'video-camera': Icons.VideoCameraOutlined,
  'play-circle': Icons.PlayCircleOutlined,
  'play-circle-o': Icons.PlayCircleOutlined,
  'pause-circle': Icons.PauseCircleOutlined,
  'pause-circle-o': Icons.PauseCircleOutlined,
  'sound': Icons.SoundOutlined,
  'file': Icons.FileOutlined,
  'file-text': Icons.FileTextOutlined,
  'folder': Icons.FolderOutlined,
  'folder-open': Icons.FolderOpenOutlined,
  
  // Communication
  'mail': Icons.MailOutlined,
  'message': Icons.MessageOutlined,
  'notification': Icons.NotificationOutlined,
  'bell': Icons.BellOutlined,
  'bell-o': Icons.BellOutlined,
  'comment': Icons.CommentOutlined,
  'send': Icons.SendOutlined,
  
  // Social
  'heart': Icons.HeartOutlined,
  'heart-o': Icons.HeartOutlined,
  'star': Icons.StarOutlined,
  'star-o': Icons.StarOutlined,
  'like': Icons.LikeOutlined,
  'like-o': Icons.LikeOutlined,
  'dislike': Icons.DislikeOutlined,
  'dislike-o': Icons.DislikeOutlined,
  'share': Icons.ShareAltOutlined,
  'share-alt': Icons.ShareAltOutlined,
  'link': Icons.LinkOutlined,
  'disconnect': Icons.DisconnectOutlined,
  
  // Commerce
  'shopping-cart': Icons.ShoppingCartOutlined,
  'shopping': Icons.ShoppingOutlined,
  'wallet': Icons.WalletOutlined,
  'dollar': Icons.DollarOutlined,
  'dollar-circle': Icons.DollarCircleOutlined,
  'pay-circle': Icons.PayCircleOutlined,
  'pay-circle-o': Icons.PayCircleOutlined,
  'credit-card': Icons.CreditCardOutlined,
  'gift': Icons.GiftOutlined,
  'tag': Icons.TagOutlined,
  'tags': Icons.TagsOutlined,
  
  // Common UI
  'home': Icons.HomeOutlined,
  'global': Icons.GlobalOutlined,
  'bars': Icons.BarsOutlined,
  'appstore': Icons.AppstoreOutlined,
  'appstore-o': Icons.AppstoreOutlined,
  'desktop': Icons.DesktopOutlined,
  'laptop': Icons.LaptopOutlined,
  'tablet': Icons.TabletOutlined,
  'mobile': Icons.MobileOutlined,
  'qrcode': Icons.QrcodeOutlined,
  'scan': Icons.ScanOutlined,
  'eye': Icons.EyeOutlined,
  'eye-o': Icons.EyeOutlined,
  'eye-invisible': Icons.EyeInvisibleOutlined,
  'eye-invisible-o': Icons.EyeInvisibleOutlined,
  'lock': Icons.LockOutlined,
  'unlock': Icons.UnlockOutlined,
  'key': Icons.KeyOutlined,
  'poweroff': Icons.PoweroffOutlined,
  'login': Icons.LoginOutlined,
  'logout': Icons.LogoutOutlined,
  'vertical-left': Icons.VerticalLeftOutlined,
  'vertical-right': Icons.VerticalRightOutlined,
  'fullscreen': Icons.FullscreenOutlined,
  'fullscreen-exit': Icons.FullscreenExitOutlined,
  'shrink': Icons.ShrinkOutlined,
  'arrows-alt': Icons.ArrowsAltOutlined,
  
  // Calendar and time
  'calendar': Icons.CalendarOutlined,
  'clock-circle': Icons.ClockCircleOutlined,
  'clock-circle-o': Icons.ClockCircleOutlined,
  'schedule': Icons.ScheduleOutlined,
  
  // Form elements
  'filter': Icons.FilterOutlined,
  'sort-ascending': Icons.SortAscendingOutlined,
  'sort-descending': Icons.SortDescendingOutlined,
  
  // Location
  'environment': Icons.EnvironmentOutlined,
  'environment-o': Icons.EnvironmentOutlined,
  'pushpin': Icons.PushpinOutlined,
  'pushpin-o': Icons.PushpinOutlined,
  'compass': Icons.CompassOutlined,
  
  // Chart and data
  'area-chart': Icons.AreaChartOutlined,
  'pie-chart': Icons.PieChartOutlined,
  'bar-chart': Icons.BarChartOutlined,
  'line-chart': Icons.LineChartOutlined,
  'dot-chart': Icons.DotChartOutlined,
  'rise': Icons.RiseOutlined,
  'fall': Icons.FallOutlined,
  'stock': Icons.StockOutlined,
  'fund': Icons.FundOutlined,
  
  // Misc
  'robot': Icons.RobotOutlined,
  'bulb': Icons.BulbOutlined,
  'experiment': Icons.ExperimentOutlined,
  'fire': Icons.FireOutlined,
  'thunderbolt': Icons.ThunderboltOutlined,
  'highlight': Icons.HighlightOutlined,
  'trophy': Icons.TrophyOutlined,
  'crown': Icons.CrownOutlined,
  'flag': Icons.FlagOutlined,
  'safety-certificate': Icons.SafetyCertificateOutlined,
  'audit': Icons.AuditOutlined,
  'api': Icons.ApiOutlined,
  'cloud': Icons.CloudOutlined,
  'cloud-upload': Icons.CloudUploadOutlined,
  'cloud-download': Icons.CloudDownloadOutlined,
  'cloud-o': Icons.CloudOutlined,
  'upload': Icons.UploadOutlined,
  'download': Icons.DownloadOutlined,
  'paper-clip': Icons.PaperClipOutlined,
  'attachment': Icons.PaperClipOutlined,
  'book': Icons.BookOutlined,
  'read': Icons.ReadOutlined,
  'form': Icons.FormOutlined,
  'table': Icons.TableOutlined,
  'profile': Icons.ProfileOutlined,
  'solution': Icons.SolutionOutlined,
  'layout': Icons.LayoutOutlined,
  'build': Icons.BuildOutlined,
  'tool': Icons.ToolOutlined,
  'block': Icons.BlockOutlined,
  'database': Icons.DatabaseOutlined,
  'cluster': Icons.ClusterOutlined,
  'code': Icons.CodeOutlined,
  'code-o': Icons.CodeOutlined,
  'file-add': Icons.FileAddOutlined,
  'file-done': Icons.FileDoneOutlined,
  'file-excel': Icons.FileExcelOutlined,
  'file-image': Icons.FileImageOutlined,
  'file-markdown': Icons.FileMarkdownOutlined,
  'file-pdf': Icons.FilePdfOutlined,
  'file-ppt': Icons.FilePptOutlined,
  'file-word': Icons.FileWordOutlined,
  'file-zip': Icons.FileZipOutlined,
  'file-unknown': Icons.FileUnknownOutlined,
  'more': Icons.MoreOutlined,
  'ellipsis': Icons.EllipsisOutlined,
  'retweet': Icons.RetweetOutlined,
  'swap': Icons.SwapOutlined,
  'swap-left': Icons.SwapLeftOutlined,
  'swap-right': Icons.SwapRightOutlined,
  'rollback': Icons.RollbackOutlined,
  'enter': Icons.EnterOutlined,
  'import': Icons.ImportOutlined,
  'export': Icons.ExportOutlined,
  'verticalLeft': Icons.VerticalLeftOutlined,
  'verticalRight': Icons.VerticalRightOutlined,
  
  // Filled variants
  'star-filled': Icons.StarFilled,
  'heart-filled': Icons.HeartFilled,
  'like-filled': Icons.LikeFilled,
  'dislike-filled': Icons.DislikeFilled,
  'check-circle-filled': Icons.CheckCircleFilled,
  'close-circle-filled': Icons.CloseCircleFilled,
  'info-circle-filled': Icons.InfoCircleFilled,
  'exclamation-circle-filled': Icons.ExclamationCircleFilled,
  'question-circle-filled': Icons.QuestionCircleFilled,
  'warning-filled': Icons.WarningFilled,
  'bell-filled': Icons.BellFilled,
};

/**
 * Compatibility Icon component for antd v5
 * Maps old <Icon type="xxx" /> usage to new @ant-design/icons components
 */
const Icon = ({ type, spin, rotate, twoToneColor, style, className, theme, onClick, ...rest }) => {
  if (!type) return null;
  
  // Normalize the type name
  let normalizedType = type.toLowerCase().replace(/_/g, '-');
  
  // Handle theme suffix (outline, filled, twotone)
  if (theme === 'filled' && !normalizedType.endsWith('-filled')) {
    normalizedType = `${normalizedType}-filled`;
  }
  
  // Try to find the icon component
  let IconComponent = iconTypeMap[normalizedType];
  
  // If not found, try to convert to PascalCase and find in Icons
  if (!IconComponent) {
    const pascalName = normalizedType
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Outlined';
    IconComponent = Icons[pascalName];
  }
  
  // If still not found, try filled version
  if (!IconComponent) {
    const pascalNameFilled = normalizedType
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Filled';
    IconComponent = Icons[pascalNameFilled];
  }
  
  // Fallback to QuestionCircleOutlined for unknown icons
  if (!IconComponent) {
    console.warn(`Icon type "${type}" not found, using fallback`);
    IconComponent = Icons.QuestionCircleOutlined;
  }
  
  return (
    <IconComponent
      spin={spin}
      rotate={rotate}
      twoToneColor={twoToneColor}
      style={style}
      className={className}
      onClick={onClick}
      {...rest}
    />
  );
};

Icon.propTypes = {
  type: PropTypes.string,
  spin: PropTypes.bool,
  rotate: PropTypes.number,
  twoToneColor: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  theme: PropTypes.oneOf(['outlined', 'filled', 'twoTone']),
  onClick: PropTypes.func,
};

Icon.defaultProps = {
  spin: false,
  theme: 'outlined',
};

export default Icon;
