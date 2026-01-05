/**
 * Icon compatibility layer for antd v3 -> v4 migration
 * Maps old Icon type prop to new @ant-design/icons components
 */
import React from 'react';
import * as AntdIcons from '@ant-design/icons';

// Map of old icon type names to new component names
const iconMap = {
  // Navigation
  'menu': 'MenuOutlined',
  'menu-fold': 'MenuFoldOutlined',
  'menu-unfold': 'MenuUnfoldOutlined',
  'close': 'CloseOutlined',
  'close-circle': 'CloseCircleOutlined',
  'close-circle-o': 'CloseCircleOutlined',
  'close-square': 'CloseSquareOutlined',
  'check': 'CheckOutlined',
  'check-circle': 'CheckCircleOutlined',
  'check-circle-o': 'CheckCircleOutlined',
  'check-square': 'CheckSquareOutlined',
  
  // Arrows
  'arrow-left': 'ArrowLeftOutlined',
  'arrow-right': 'ArrowRightOutlined',
  'arrow-up': 'ArrowUpOutlined',
  'arrow-down': 'ArrowDownOutlined',
  'left': 'LeftOutlined',
  'right': 'RightOutlined',
  'up': 'UpOutlined',
  'down': 'DownOutlined',
  'caret-left': 'CaretLeftOutlined',
  'caret-right': 'CaretRightOutlined',
  'caret-up': 'CaretUpOutlined',
  'caret-down': 'CaretDownOutlined',
  'double-left': 'DoubleLeftOutlined',
  'double-right': 'DoubleRightOutlined',
  'swap': 'SwapOutlined',
  'swap-right': 'SwapRightOutlined',
  'swap-left': 'SwapLeftOutlined',
  
  // Actions
  'plus': 'PlusOutlined',
  'plus-circle': 'PlusCircleOutlined',
  'plus-circle-o': 'PlusCircleOutlined',
  'plus-square': 'PlusSquareOutlined',
  'minus': 'MinusOutlined',
  'minus-circle': 'MinusCircleOutlined',
  'minus-circle-o': 'MinusCircleOutlined',
  'minus-square': 'MinusSquareOutlined',
  'edit': 'EditOutlined',
  'form': 'FormOutlined',
  'copy': 'CopyOutlined',
  'delete': 'DeleteOutlined',
  'scissor': 'ScissorOutlined',
  'search': 'SearchOutlined',
  'zoom-in': 'ZoomInOutlined',
  'zoom-out': 'ZoomOutOutlined',
  'fullscreen': 'FullscreenOutlined',
  'fullscreen-exit': 'FullscreenExitOutlined',
  'expand': 'ExpandOutlined',
  'compress': 'CompressOutlined',
  
  // Files
  'file': 'FileOutlined',
  'file-text': 'FileTextOutlined',
  'file-add': 'FileAddOutlined',
  'file-excel': 'FileExcelOutlined',
  'file-word': 'FileWordOutlined',
  'file-pdf': 'FilePdfOutlined',
  'file-image': 'FileImageOutlined',
  'file-done': 'FileDoneOutlined',
  'folder': 'FolderOutlined',
  'folder-add': 'FolderAddOutlined',
  'folder-open': 'FolderOpenOutlined',
  'picture': 'PictureOutlined',
  'paper-clip': 'PaperClipOutlined',
  'upload': 'UploadOutlined',
  'download': 'DownloadOutlined',
  'cloud': 'CloudOutlined',
  'cloud-upload': 'CloudUploadOutlined',
  'cloud-download': 'CloudDownloadOutlined',
  
  // Communication
  'mail': 'MailOutlined',
  'message': 'MessageOutlined',
  'bell': 'BellOutlined',
  'notification': 'NotificationOutlined',
  'phone': 'PhoneOutlined',
  'mobile': 'MobileOutlined',
  'comment': 'CommentOutlined',
  'wechat': 'WechatOutlined',
  'qq': 'QqOutlined',
  'weibo': 'WeiboOutlined',
  'twitter': 'TwitterOutlined',
  'facebook': 'FacebookOutlined',
  'instagram': 'InstagramOutlined',
  'youtube': 'YoutubeOutlined',
  'github': 'GithubOutlined',
  'gitlab': 'GitlabOutlined',
  'linkedin': 'LinkedinOutlined',
  'google': 'GoogleOutlined',
  
  // Media
  'play-circle': 'PlayCircleOutlined',
  'play-circle-o': 'PlayCircleOutlined',
  'pause': 'PauseOutlined',
  'pause-circle': 'PauseCircleOutlined',
  'stop': 'StopOutlined',
  'caret-right': 'CaretRightOutlined',
  'step-backward': 'StepBackwardOutlined',
  'step-forward': 'StepForwardOutlined',
  'backward': 'BackwardOutlined',
  'forward': 'ForwardOutlined',
  'sound': 'SoundOutlined',
  'camera': 'CameraOutlined',
  'camera-o': 'CameraOutlined',
  'video-camera': 'VideoCameraOutlined',
  
  // Data
  'database': 'DatabaseOutlined',
  'pie-chart': 'PieChartOutlined',
  'bar-chart': 'BarChartOutlined',
  'dot-chart': 'DotChartOutlined',
  'line-chart': 'LineChartOutlined',
  'area-chart': 'AreaChartOutlined',
  'stock': 'StockOutlined',
  'rise': 'RiseOutlined',
  'fall': 'FallOutlined',
  'fund': 'FundOutlined',
  'table': 'TableOutlined',
  
  // User
  'user': 'UserOutlined',
  'user-add': 'UserAddOutlined',
  'user-delete': 'UserDeleteOutlined',
  'team': 'TeamOutlined',
  'solution': 'SolutionOutlined',
  'idcard': 'IdcardOutlined',
  'contacts': 'ContactsOutlined',
  
  // UI
  'setting': 'SettingOutlined',
  'tool': 'ToolOutlined',
  'filter': 'FilterOutlined',
  'appstore': 'AppstoreOutlined',
  'appstore-o': 'AppstoreOutlined',
  'layout': 'LayoutOutlined',
  'block': 'BlockOutlined',
  'build': 'BuildOutlined',
  'control': 'ControlOutlined',
  'dashboard': 'DashboardOutlined',
  'home': 'HomeOutlined',
  'shop': 'ShopOutlined',
  'shopping': 'ShoppingOutlined',
  'shopping-cart': 'ShoppingCartOutlined',
  'gift': 'GiftOutlined',
  'calendar': 'CalendarOutlined',
  'clock-circle': 'ClockCircleOutlined',
  'clock-circle-o': 'ClockCircleOutlined',
  'schedule': 'ScheduleOutlined',
  
  // Status
  'info': 'InfoOutlined',
  'info-circle': 'InfoCircleOutlined',
  'info-circle-o': 'InfoCircleOutlined',
  'question': 'QuestionOutlined',
  'question-circle': 'QuestionCircleOutlined',
  'question-circle-o': 'QuestionCircleOutlined',
  'exclamation': 'ExclamationOutlined',
  'exclamation-circle': 'ExclamationCircleOutlined',
  'exclamation-circle-o': 'ExclamationCircleOutlined',
  'warning': 'WarningOutlined',
  'loading': 'LoadingOutlined',
  'loading-3-quarters': 'Loading3QuartersOutlined',
  'sync': 'SyncOutlined',
  'reload': 'ReloadOutlined',
  'redo': 'RedoOutlined',
  'undo': 'UndoOutlined',
  
  // Shapes
  'star': 'StarOutlined',
  'star-o': 'StarOutlined',
  'heart': 'HeartOutlined',
  'heart-o': 'HeartOutlined',
  'like': 'LikeOutlined',
  'like-o': 'LikeOutlined',
  'dislike': 'DislikeOutlined',
  'dislike-o': 'DislikeOutlined',
  'fire': 'FireOutlined',
  'thunderbolt': 'ThunderboltOutlined',
  'trophy': 'TrophyOutlined',
  'crown': 'CrownOutlined',
  'rocket': 'RocketOutlined',
  'flag': 'FlagOutlined',
  'tag': 'TagOutlined',
  'tags': 'TagsOutlined',
  'tags-o': 'TagsOutlined',
  'pushpin': 'PushpinOutlined',
  'pushpin-o': 'PushpinOutlined',
  'book': 'BookOutlined',
  'read': 'ReadOutlined',
  'link': 'LinkOutlined',
  'disconnect': 'DisconnectOutlined',
  'branches': 'BranchesOutlined',
  'fork': 'ForkOutlined',
  'share-alt': 'ShareAltOutlined',
  'highlight': 'HighlightOutlined',
  
  // Location
  'environment': 'EnvironmentOutlined',
  'environment-o': 'EnvironmentOutlined',
  'global': 'GlobalOutlined',
  'compass': 'CompassOutlined',
  'aim': 'AimOutlined',
  
  // Misc
  'lock': 'LockOutlined',
  'unlock': 'UnlockOutlined',
  'key': 'KeyOutlined',
  'eye': 'EyeOutlined',
  'eye-o': 'EyeOutlined',
  'eye-invisible': 'EyeInvisibleOutlined',
  'safety': 'SafetyOutlined',
  'safety-certificate': 'SafetyCertificateOutlined',
  'insurance': 'InsuranceOutlined',
  'audit': 'AuditOutlined',
  'qrcode': 'QrcodeOutlined',
  'barcode': 'BarcodeOutlined',
  'scan': 'ScanOutlined',
  'wifi': 'WifiOutlined',
  'api': 'ApiOutlined',
  'code': 'CodeOutlined',
  'code-sandbox': 'CodeSandboxOutlined',
  'bug': 'BugOutlined',
  'robot': 'RobotOutlined',
  'experiment': 'ExperimentOutlined',
  'bulb': 'BulbOutlined',
  'smile': 'SmileOutlined',
  'smile-o': 'SmileOutlined',
  'frown': 'FrownOutlined',
  'frown-o': 'FrownOutlined',
  'meh': 'MehOutlined',
  'meh-o': 'MehOutlined',
  
  // Edit
  'bold': 'BoldOutlined',
  'italic': 'ItalicOutlined',
  'underline': 'UnderlineOutlined',
  'strikethrough': 'StrikethroughOutlined',
  'font-size': 'FontSizeOutlined',
  'font-colors': 'FontColorsOutlined',
  'bg-colors': 'BgColorsOutlined',
  'align-left': 'AlignLeftOutlined',
  'align-center': 'AlignCenterOutlined',
  'align-right': 'AlignRightOutlined',
  'ordered-list': 'OrderedListOutlined',
  'unordered-list': 'UnorderedListOutlined',
  'menu': 'MenuOutlined',
  'bars': 'BarsOutlined',
  'more': 'MoreOutlined',
  'ellipsis': 'EllipsisOutlined',
  'drag': 'DragOutlined',
  'holder': 'HolderOutlined',
  
  // Money
  'dollar': 'DollarOutlined',
  'dollar-circle': 'DollarCircleOutlined',
  'euro': 'EuroOutlined',
  'euro-circle': 'EuroCircleOutlined',
  'pound': 'PoundOutlined',
  'pound-circle': 'PoundCircleOutlined',
  'money-collect': 'MoneyCollectOutlined',
  'wallet': 'WalletOutlined',
  'bank': 'BankOutlined',
  'transaction': 'TransactionOutlined',
  'pay-circle': 'PayCircleOutlined',
  'credit-card': 'CreditCardOutlined',
  'red-envelope': 'RedEnvelopeOutlined',
  'account-book': 'AccountBookOutlined',
  
  // Filled versions (map -o suffix to Outlined)
  'customer-service': 'CustomerServiceOutlined',
  'man': 'ManOutlined',
  'woman': 'WomanOutlined',
  'login': 'LoginOutlined',
  'logout': 'LogoutOutlined',
  'poweroff': 'PoweroffOutlined',
  'save': 'SaveOutlined',
  'printer': 'PrinterOutlined',
  'export': 'ExportOutlined',
  'import': 'ImportOutlined',
  'enter': 'EnterOutlined',
  'rollback': 'RollbackOutlined',
  'issues-close': 'IssuesCloseOutlined',
  'pull-request': 'PullRequestOutlined',
  'merge-cells': 'MergeCellsOutlined',
  'split-cells': 'SplitCellsOutlined',
  'vertical-align-top': 'VerticalAlignTopOutlined',
  'vertical-align-middle': 'VerticalAlignMiddleOutlined',
  'vertical-align-bottom': 'VerticalAlignBottomOutlined',
  'sort-ascending': 'SortAscendingOutlined',
  'sort-descending': 'SortDescendingOutlined',
  'radius-setting': 'RadiusSettingOutlined',
  'radius-upleft': 'RadiusUpleftOutlined',
  'radius-upright': 'RadiusUprightOutlined',
  'radius-bottomleft': 'RadiusBottomleftOutlined',
  'radius-bottomright': 'RadiusBottomrightOutlined',
};

// Filled icon mappings
const filledMap = {
  'star': 'StarFilled',
  'heart': 'HeartFilled',
  'like': 'LikeFilled',
  'dislike': 'DislikeFilled',
  'check-circle': 'CheckCircleFilled',
  'close-circle': 'CloseCircleFilled',
  'info-circle': 'InfoCircleFilled',
  'question-circle': 'QuestionCircleFilled',
  'exclamation-circle': 'ExclamationCircleFilled',
  'warning': 'WarningFilled',
  'play-circle': 'PlayCircleFilled',
  'pause-circle': 'PauseCircleFilled',
  'clock-circle': 'ClockCircleFilled',
  'plus-circle': 'PlusCircleFilled',
  'minus-circle': 'MinusCircleFilled',
  'dollar-circle': 'DollarCircleFilled',
  'euro-circle': 'EuroCircleFilled',
  'pound-circle': 'PoundCircleFilled',
  'pay-circle': 'PayCircleFilled',
  'eye': 'EyeFilled',
  'eye-invisible': 'EyeInvisibleFilled',
  'camera': 'CameraFilled',
  'bell': 'BellFilled',
  'fire': 'FireFilled',
  'thunderbolt': 'ThunderboltFilled',
  'trophy': 'TrophyFilled',
  'crown': 'CrownFilled',
  'rocket': 'RocketFilled',
  'pushpin': 'PushpinFilled',
  'flag': 'FlagFilled',
  'smile': 'SmileFilled',
  'frown': 'FrownFilled',
  'meh': 'MehFilled',
  'setting': 'SettingFilled',
  'home': 'HomeFilled',
  'appstore': 'AppstoreFilled',
  'folder': 'FolderFilled',
  'folder-open': 'FolderOpenFilled',
  'file': 'FileFilled',
  'file-text': 'FileTextFilled',
  'picture': 'PictureFilled',
  'calendar': 'CalendarFilled',
  'environment': 'EnvironmentFilled',
  'lock': 'LockFilled',
  'unlock': 'UnlockFilled',
  'sound': 'SoundFilled',
  'notification': 'NotificationFilled',
  'message': 'MessageFilled',
  'mail': 'MailFilled',
  'mobile': 'MobileFilled',
  'phone': 'PhoneFilled',
  'tag': 'TagFilled',
  'tags': 'TagsFilled',
  'book': 'BookFilled',
  'bank': 'BankFilled',
  'wallet': 'WalletFilled',
  'credit-card': 'CreditCardFilled',
  'red-envelope': 'RedEnvelopeFilled',
  'gift': 'GiftFilled',
  'shop': 'ShopFilled',
  'shopping': 'ShoppingFilled',
  'bulb': 'BulbFilled',
  'bug': 'BugFilled',
  'api': 'ApiFilled',
  'database': 'DatabaseFilled',
  'container': 'ContainerFilled',
  'project': 'ProjectFilled',
  'contacts': 'ContactsFilled',
  'idcard': 'IdcardFilled',
  'user': 'UserFilled',
  'team': 'TeamFilled',
  'safety-certificate': 'SafetyCertificateFilled',
  'security-scan': 'SecurityScanFilled',
  'insurance': 'InsuranceFilled',
  'experiment': 'ExperimentFilled',
  'robot': 'RobotFilled',
};

// TwoTone icon mappings
const twoToneMap = {
  'star': 'StarTwoTone',
  'heart': 'HeartTwoTone',
  'like': 'LikeTwoTone',
  'dislike': 'DislikeTwoTone',
  'check-circle': 'CheckCircleTwoTone',
  'close-circle': 'CloseCircleTwoTone',
  'info-circle': 'InfoCircleTwoTone',
  'question-circle': 'QuestionCircleTwoTone',
  'exclamation-circle': 'ExclamationCircleTwoTone',
  'warning': 'WarningTwoTone',
  'plus-circle': 'PlusCircleTwoTone',
  'minus-circle': 'MinusCircleTwoTone',
  'clock-circle': 'ClockCircleTwoTone',
  'smile': 'SmileTwoTone',
  'frown': 'FrownTwoTone',
  'meh': 'MehTwoTone',
  'setting': 'SettingTwoTone',
  'home': 'HomeTwoTone',
  'appstore': 'AppstoreTwoTone',
  'folder': 'FolderTwoTone',
  'folder-open': 'FolderOpenTwoTone',
  'file': 'FileTwoTone',
  'picture': 'PictureTwoTone',
  'calendar': 'CalendarTwoTone',
  'environment': 'EnvironmentTwoTone',
  'lock': 'LockTwoTone',
  'unlock': 'UnlockTwoTone',
  'sound': 'SoundTwoTone',
  'notification': 'NotificationTwoTone',
  'camera': 'CameraTwoTone',
  'fire': 'FireTwoTone',
  'thunderbolt': 'ThunderboltTwoTone',
  'trophy': 'TrophyTwoTone',
  'crown': 'CrownTwoTone',
  'rocket': 'RocketTwoTone',
  'bulb': 'BulbTwoTone',
  'gift': 'GiftTwoTone',
  'shop': 'ShopTwoTone',
  'tag': 'TagTwoTone',
  'tags': 'TagsTwoTone',
  'book': 'BookTwoTone',
  'bank': 'BankTwoTone',
  'wallet': 'WalletTwoTone',
  'eye': 'EyeTwoTone',
  'eye-invisible': 'EyeInvisibleTwoTone',
  'highlight': 'HighlightTwoTone',
  'edit': 'EditTwoTone',
  'delete': 'DeleteTwoTone',
  'tool': 'ToolTwoTone',
  'experiment': 'ExperimentTwoTone',
  'api': 'ApiTwoTone',
  'database': 'DatabaseTwoTone',
  'container': 'ContainerTwoTone',
  'project': 'ProjectTwoTone',
  'contacts': 'ContactsTwoTone',
  'idcard': 'IdcardTwoTone',
  'safety-certificate': 'SafetyCertificateTwoTone',
  'security-scan': 'SecurityScanTwoTone',
  'insurance': 'InsuranceTwoTone',
  'robot': 'RobotTwoTone',
  'dollar-circle': 'DollarCircleTwoTone',
  'euro-circle': 'EuroCircleTwoTone',
  'pound-circle': 'PoundCircleTwoTone',
  'money-collect': 'MoneyCollectTwoTone',
  'credit-card': 'CreditCardTwoTone',
  'bell': 'BellTwoTone',
  'mail': 'MailTwoTone',
  'message': 'MessageTwoTone',
  'phone': 'PhoneTwoTone',
  'mobile': 'MobileTwoTone',
  'play-circle': 'PlayCircleTwoTone',
  'pause-circle': 'PauseCircleTwoTone',
  'video-camera': 'VideoCameraTwoTone',
  'code': 'CodeTwoTone',
  'pie-chart': 'PieChartTwoTone',
  'fund': 'FundTwoTone',
};

/**
 * Get the component name for a given icon type
 */
function getIconComponentName(type, theme = 'outlined') {
  if (!type) return null;
  
  // Normalize type name (remove -o suffix for outlined, handle filled/twoTone)
  let normalizedType = type.toLowerCase();
  
  // Handle -o suffix (old outlined icons)
  if (normalizedType.endsWith('-o')) {
    normalizedType = normalizedType.slice(0, -2);
  }
  
  // Select the right map based on theme
  let componentName;
  if (theme === 'filled') {
    componentName = filledMap[normalizedType];
  } else if (theme === 'twoTone') {
    componentName = twoToneMap[normalizedType];
  }
  
  // Fall back to outlined
  if (!componentName) {
    componentName = iconMap[normalizedType];
  }
  
  // If still not found, try to construct it
  if (!componentName) {
    // Convert kebab-case to PascalCase and add suffix
    const pascalCase = normalizedType
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    
    const suffix = theme === 'filled' ? 'Filled' : theme === 'twoTone' ? 'TwoTone' : 'Outlined';
    componentName = pascalCase + suffix;
  }
  
  return componentName;
}

/**
 * Icon compatibility component
 * Supports old antd v3 Icon API: <Icon type="check" theme="filled" spin />
 * Maps to new @ant-design/icons components
 */
const Icon = React.forwardRef(({ type, theme = 'outlined', spin, rotate, twoToneColor, style, className, onClick, ...props }, ref) => {
  if (!type) {
    console.warn('Icon component requires a type prop');
    return null;
  }
  
  const componentName = getIconComponentName(type, theme);
  const IconComponent = AntdIcons[componentName];
  
  if (!IconComponent) {
    console.warn(`Icon "${type}" (${componentName}) not found in @ant-design/icons`);
    // Return a placeholder or fallback
    return <span className={className} style={style} onClick={onClick} {...props}>?</span>;
  }
  
  return (
    <IconComponent
      ref={ref}
      spin={spin}
      rotate={rotate}
      twoToneColor={twoToneColor}
      style={style}
      className={className}
      onClick={onClick}
      {...props}
    />
  );
});

Icon.displayName = 'Icon';

export default Icon;

// Also export named icons for direct imports
export * from '@ant-design/icons';


