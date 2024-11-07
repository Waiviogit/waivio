import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { ReactEditor, useSlate } from 'slate-react';
import { Modal } from 'antd';
import './emoji.less';

export const allEmojis = [
  '😀',
  '😁',
  '😂',
  '😃',
  '😄',
  '😅',
  '😆',
  '😇',
  '😈',
  '👿',
  '😉',
  '😊',
  '😋',
  '😌',
  '😍',
  '😎',
  '😏',
  '😐',
  '😑',
  '😒',
  '😓',
  '😔',
  '😕',
  '😖',
  '😗',
  '😘',
  '😙',
  '😚',
  '😛',
  '😜',
  '😝',
  '😞',
  '😟',
  '😠',
  '😡',
  '😢',
  '😣',
  '😤',
  '😥',
  '😦',
  '😧',
  '😨',
  '😩',
  '😪',
  '😫',
  '😬',
  '😭',
  '😮',
  '😯',
  '😰',
  '😱',
  '😲',
  '😳',
  '😴',
  '😵',
  '😶',
  '😷',
  '😸',
  '😹',
  '😺',
  '😻',
  '😼',
  '😽',
  '😾',
  '😿',
  '🙀',
  '👣',
  '👤',
  '👥',
  '👶',
  '👶🏻',
  '👶🏼',
  '👶🏽',
  '👶🏾',
  '👶🏿',
  '👦',
  '👦🏻',
  '👦🏼',
  '👦🏽',
  '👦🏾',
  '👦🏿',
  '👧',
  '👧🏻',
  '👧🏼',
  '👧🏽',
  '👧🏾',
  '👧🏿',
  '👨',
  '👨🏻',
  '👨🏼',
  '👨🏽',
  '👨🏾',
  '👨🏿',
  '👩',
  '👩🏻',
  '👩🏼',
  '👩🏽',
  '👩🏾',
  '👩🏿',
  '👪',
  '👨‍👩‍👧',
  '👨‍👩‍👧‍👦',
  '👨‍👩‍👦‍👦',
  '👨‍👩‍👧‍👧',
  '👩‍👩‍👦',
  '👩‍👩‍👧',
  '👩‍👩‍👧‍👦',
  '👩‍👩‍👦‍👦',
  '👩‍👩‍👧‍👧',
  '👨‍👨‍👦',
  '👨‍👨‍👧',
  '👨‍👨‍👧‍👦',
  '👨‍👨‍👦‍👦',
  '👨‍👨‍👧‍👧',
  '👫',
  '👬',
  '👭',
  '👯',
  '👰',
  '👰🏻',
  '👰🏼',
  '👰🏽',
  '👰🏾',
  '👰🏿',
  '👱',
  '👱🏻',
  '👱🏼',
  '👱🏽',
  '👱🏾',
  '👱🏿',
  '👲',
  '👲🏻',
  '👲🏼',
  '👲🏽',
  '👲🏾',
  '👲🏿',
  '👳',
  '👳🏻',
  '👳🏼',
  '👳🏽',
  '👳🏾',
  '👳🏿',
  '👴',
  '👴🏻',
  '👴🏼',
  '👴🏽',
  '👴🏾',
  '👴🏿',
  '👵',
  '👵🏻',
  '👵🏼',
  '👵🏽',
  '👵🏾',
  '👵🏿',
  '👮',
  '👮🏻',
  '👮🏼',
  '👮🏽',
  '👮🏾',
  '👮🏿',
  '👷',
  '👷🏻',
  '👷🏼',
  '👷🏽',
  '👷🏾',
  '👷🏿',
  '👸',
  '👸🏻',
  '👸🏼',
  '👸🏽',
  '👸🏾',
  '👸🏿',
  '💂',
  '💂🏻',
  '💂🏼',
  '💂🏽',
  '💂🏾',
  '💂🏿',
  '👼',
  '👼🏻',
  '👼🏼',
  '👼🏽',
  '👼🏾',
  '👼🏿',
  '🎅',
  '🎅🏻',
  '🎅🏼',
  '🎅🏽',
  '🎅🏾',
  '🎅🏿',
  '👻',
  '👹',
  '👺',
  '💩',
  '💀',
  '👽',
  '👾',
  '🙇',
  '🙇🏻',
  '🙇🏼',
  '🙇🏽',
  '🙇🏾',
  '🙇🏿',
  '💁',
  '💁🏻',
  '💁🏼',
  '💁🏽',
  '💁🏾',
  '💁🏿',
  '🙅',
  '🙅🏻',
  '🙅🏼',
  '🙅🏽',
  '🙅🏾',
  '🙅🏿',
  '🙆',
  '🙆🏻',
  '🙆🏼',
  '🙆🏽',
  '🙆🏾',
  '🙆🏿',
  '🙋',
  '🙋🏻',
  '🙋🏼',
  '🙋🏽',
  '🙋🏾',
  '🙋🏿',
  '🙎',
  '🙎🏻',
  '🙎🏼',
  '🙎🏽',
  '🙎🏾',
  '🙎🏿',
  '🙍',
  '🙍🏻',
  '🙍🏼',
  '🙍🏽',
  '🙍🏾',
  '🙍🏿',
  '💆',
  '💆🏻',
  '💆🏼',
  '💆🏽',
  '💆🏾',
  '💆🏿',
  '💇',
  '💇🏻',
  '💇🏼',
  '💇🏽',
  '💇🏾',
  '💇🏿',
  '💑',
  '👩‍❤️‍👩',
  '👨‍❤️‍👨',
  '💏',
  '👩‍❤️‍💋‍👩',
  '👨‍❤️‍💋‍👨',
  '🙌',
  '🙌🏻',
  '🙌🏼',
  '🙌🏽',
  '🙌🏾',
  '🙌🏿',
  '👏',
  '👏🏻',
  '👏🏼',
  '👏🏽',
  '👏🏾',
  '👏🏿',
  '👂',
  '👂🏻',
  '👂🏼',
  '👂🏽',
  '👂🏾',
  '👂🏿',
  '👀',
  '👃',
  '👃🏻',
  '👃🏼',
  '👃🏽',
  '👃🏾',
  '👃🏿',
  '👄',
  '💋',
  '👅',
  '💅',
  '💅🏻',
  '💅🏼',
  '💅🏽',
  '💅🏾',
  '💅🏿',
  '👋',
  '👋🏻',
  '👋🏼',
  '👋🏽',
  '👋🏾',
  '👋🏿',
  '👍',
  '👍🏻',
  '👍🏼',
  '👍🏽',
  '👍🏾',
  '👍🏿',
  '👎',
  '👎🏻',
  '👎🏼',
  '👎🏽',
  '👎🏾',
  '👎🏿',
  '☝',
  '☝🏻',
  '☝🏼',
  '☝🏽',
  '☝🏾',
  '☝🏿',
  '👆',
  '👆🏻',
  '👆🏼',
  '👆🏽',
  '👆🏾',
  '👆🏿',
  '👇',
  '👇🏻',
  '👇🏼',
  '👇🏽',
  '👇🏾',
  '👇🏿',
  '👈',
  '👈🏻',
  '👈🏼',
  '👈🏽',
  '👈🏾',
  '👈🏿',
  '👉',
  '👉🏻',
  '👉🏼',
  '👉🏽',
  '👉🏾',
  '👉🏿',
  '👌',
  '👌🏻',
  '👌🏼',
  '👌🏽',
  '👌🏾',
  '👌🏿',
  '✌',
  '✌🏻',
  '✌🏼',
  '✌🏽',
  '✌🏾',
  '✌🏿',
  '👊',
  '👊🏻',
  '👊🏼',
  '👊🏽',
  '👊🏾',
  '👊🏿',
  '✊',
  '✊🏻',
  '✊🏼',
  '✊🏽',
  '✊🏾',
  '✊🏿',
  '✋',
  '✋🏻',
  '✋🏼',
  '✋🏽',
  '✋🏾',
  '✋🏿',
  '💪',
  '💪🏻',
  '💪🏼',
  '💪🏽',
  '💪🏾',
  '💪🏿',
  '👐',
  '👐🏻',
  '👐🏼',
  '👐🏽',
  '👐🏾',
  '👐🏿',
  '🙏',
  '🙏🏻',
  '🙏🏼',
  '🙏🏽',
  '🙏🏾',
  '🙏🏿',
  '🌱',
  '🌲',
  '🌳',
  '🌴',
  '🌵',
  '🌷',
  '🌸',
  '🌹',
  '🌺',
  '🌻',
  '🌼',
  '💐',
  '🌾',
  '🌿',
  '🍀',
  '🍁',
  '🍂',
  '🍃',
  '🍄',
  '🌰',
  '🐀',
  '🐁',
  '🐭',
  '🐹',
  '🐂',
  '🐃',
  '🐄',
  '🐮',
  '🐅',
  '🐆',
  '🐯',
  '🐇',
  '🐰',
  '🐈',
  '🐱',
  '🐎',
  '🐴',
  '🐏',
  '🐑',
  '🐐',
  '🐓',
  '🐔',
  '🐤',
  '🐣',
  '🐥',
  '🐦',
  '🐧',
  '🐘',
  '🐪',
  '🐫',
  '🐗',
  '🐖',
  '🐷',
  '🐽',
  '🐕',
  '🐩',
  '🐶',
  '🐺',
  '🐻',
  '🐨',
  '🐼',
  '🐵',
  '🙈',
  '🙉',
  '🙊',
  '🐒',
  '🐉',
  '🐲',
  '🐊',
  '🐍',
  '🐢',
  '🐸',
  '🐋',
  '🐳',
  '🐬',
  '🐙',
  '🐟',
  '🐠',
  '🐡',
  '🐚',
  '🐌',
  '🐛',
  '🐜',
  '🐝',
  '🐞',
  '🐾',
  '⚡️',
  '🔥',
  '🌙',
  '☀️',
  '⛅️',
  '☁️',
  '💧',
  '💦',
  '☔️',
  '💨',
  '❄️',
  '🌟',
  '⭐️',
  '🌠',
  '🌄',
  '🌅',
  '🌈',
  '🌊',
  '🌋',
  '🌌',
  '🗻',
  '🗾',
  '🌐',
  '🌍',
  '🌎',
  '🌏',
  '🌑',
  '🌒',
  '🌓',
  '🌔',
  '🌕',
  '🌖',
  '🌗',
  '🌘',
  '🌚',
  '🌝',
  '🌛',
  '🌜',
  '🌞',
  '🍅',
  '🍆',
  '🌽',
  '🍠',
  '🍇',
  '🍈',
  '🍉',
  '🍊',
  '🍋',
  '🍌',
  '🍍',
  '🍎',
  '🍏',
  '🍐',
  '🍑',
  '🍒',
  '🍓',
  '🍔',
  '🍕',
  '🍖',
  '🍗',
  '🍘',
  '🍙',
  '🍚',
  '🍛',
  '🍜',
  '🍝',
  '🍞',
  '🍟',
  '🍡',
  '🍢',
  '🍣',
  '🍤',
  '🍥',
  '🍦',
  '🍧',
  '🍨',
  '🍩',
  '🍪',
  '🍫',
  '🍬',
  '🍭',
  '🍮',
  '🍯',
  '🍰',
  '🍱',
  '🍲',
  '🍳',
  '🍴',
  '🍵',
  '☕️',
  '🍶',
  '🍷',
  '🍸',
  '🍹',
  '🍺',
  '🍻',
  '🍼',
  '🎀',
  '🎁',
  '🎂',
  '🎃',
  '🎄',
  '🎋',
  '🎍',
  '🎑',
  '🎆',
  '🎇',
  '🎉',
  '🎊',
  '🎈',
  '💫',
  '✨',
  '💥',
  '🎓',
  '👑',
  '🎎',
  '🎏',
  '🎐',
  '🎌',
  '🏮',
  '💍',
  '❤️',
  '💔',
  '💌',
  '💕',
  '💞',
  '💓',
  '💗',
  '💖',
  '💘',
  '💝',
  '💟',
  '💜',
  '💛',
  '💚',
  '💙',
  '🏃',
  '🏃🏻',
  '🏃🏼',
  '🏃🏽',
  '🏃🏾',
  '🏃🏿',
  '🚶',
  '🚶🏻',
  '🚶🏼',
  '🚶🏽',
  '🚶🏾',
  '🚶🏿',
  '💃',
  '💃🏻',
  '💃🏼',
  '💃🏽',
  '💃🏾',
  '💃🏿',
  '🚣',
  '🚣🏻',
  '🚣🏼',
  '🚣🏽',
  '🚣🏾',
  '🚣🏿',
  '🏊',
  '🏊🏻',
  '🏊🏼',
  '🏊🏽',
  '🏊🏾',
  '🏊🏿',
  '🏄',
  '🏄🏻',
  '🏄🏼',
  '🏄🏽',
  '🏄🏾',
  '🏄🏿',
  '🛀',
  '🛀🏻',
  '🛀🏼',
  '🛀🏽',
  '🛀🏾',
  '🛀🏿',
  '🏂',
  '🎿',
  '⛄️',
  '🚴',
  '🚴🏻',
  '🚴🏼',
  '🚴🏽',
  '🚴🏾',
  '🚴🏿',
  '🚵',
  '🚵🏻',
  '🚵🏼',
  '🚵🏽',
  '🚵🏾',
  '🚵🏿',
  '🏇',
  '🏇🏻',
  '🏇🏼',
  '🏇🏽',
  '🏇🏾',
  '🏇🏿',
  '⛺️',
  '🎣',
  '⚽️',
  '🏀',
  '🏈',
  '⚾️',
  '🎾',
  '🏉',
  '⛳️',
  '🏆',
  '🎽',
  '🏁',
  '🎹',
  '🎸',
  '🎻',
  '🎷',
  '🎺',
  '🎵',
  '🎶',
  '🎼',
  '🎧',
  '🎤',
  '🎭',
  '🎫',
  '🎩',
  '🎪',
  '🎬',
  '🎨',
  '🎯',
  '🎱',
  '🎳',
  '🎰',
  '🎲',
  '🎮',
  '🎴',
  '🃏',
  '🀄️',
  '🎠',
  '🎡',
  '🎢',
  '🚃',
  '🚞',
  '🚂',
  '🚋',
  '🚝',
  '🚄',
  '🚅',
  '🚆',
  '🚇',
  '🚈',
  '🚉',
  '🚊',
  '🚌',
  '🚍',
  '🚎',
  '🚐',
  '🚑',
  '🚒',
  '🚓',
  '🚔',
  '🚨',
  '🚕',
  '🚖',
  '🚗',
  '🚘',
  '🚙',
  '🚚',
  '🚛',
  '🚜',
  '🚲',
  '🚏',
  '⛽️',
  '🚧',
  '🚦',
  '🚥',
  '🚀',
  '🚁',
  '✈️',
  '💺',
  '⚓️',
  '🚢',
  '🚤',
  '⛵️',
  '🚡',
  '🚠',
  '🚟',
  '🛂',
  '🛃',
  '🛄',
  '🛅',
  '💴',
  '💶',
  '💷',
  '💵',
  '🗽',
  '🗿',
  '🌁',
  '🗼',
  '⛲️',
  '🏰',
  '🏯',
  '🌇',
  '🌆',
  '🌃',
  '🌉',
  '🏠',
  '🏡',
  '🏢',
  '🏬',
  '🏭',
  '🏣',
  '🏤',
  '🏥',
  '🏦',
  '🏨',
  '🏩',
  '💒',
  '⛪️',
  '🏪',
  '🏫',
  '🇦🇺',
  '🇦🇹',
  '🇧🇪',
  '🇧🇷',
  '🇨🇦',
  '🇨🇱',
  '🇨🇳',
  '🇨🇴',
  '🇩🇰',
  '🇫🇮',
  '🇫🇷',
  '🇩🇪',
  '🇭🇰',
  '🇮🇳',
  '🇮🇩',
  '🇮🇪',
  '🇮🇱',
  '🇮🇹',
  '🇯🇵',
  '🇰🇷',
  '🇲🇴',
  '🇲🇾',
  '🇲🇽',
  '🇳🇱',
  '🇳🇿',
  '🇳🇴',
  '🇵🇭',
  '🇵🇱',
  '🇵🇹',
  '🇵🇷',
  '🇷🇺',
  '🇸🇦',
  '🇸🇬',
  '🇿🇦',
  '🇪🇸',
  '🇸🇪',
  '🇨🇭',
  '🇹🇷',
  '🇬🇧',
  '🇺🇸',
  '🇦🇪',
  '🇻🇳',
  '⌚️',
  '📱',
  '📲',
  '💻',
  '⏰',
  '⏳',
  '⌛️',
  '📷',
  '📹',
  '🎥',
  '📺',
  '📻',
  '📟',
  '📞',
  '☎️',
  '📠',
  '💽',
  '💾',
  '💿',
  '📀',
  '📼',
  '🔋',
  '🔌',
  '💡',
  '🔦',
  '📡',
  '💳',
  '💸',
  '💰',
  '💎',
  '🌂',
  '👝',
  '👛',
  '👜',
  '💼',
  '🎒',
  '💄',
  '👓',
  '👒',
  '👡',
  '👠',
  '👢',
  '👞',
  '👟',
  '👙',
  '👗',
  '👘',
  '👚',
  '👕',
  '👔',
  '👖',
  '🚪',
  '🚿',
  '🛁',
  '🚽',
  '💈',
  '💉',
  '💊',
  '🔬',
  '🔭',
  '🔮',
  '🔧',
  '🔪',
  '🔩',
  '🔨',
  '💣',
  '🚬',
  '🔫',
  '🔖',
  '📰',
  '🔑',
  '✉️',
  '📩',
  '📨',
  '📧',
  '📥',
  '📤',
  '📦',
  '📯',
  '📮',
  '📪',
  '📫',
  '📬',
  '📭',
  '📄',
  '📃',
  '📑',
  '📈',
  '📉',
  '📊',
  '📅',
  '📆',
  '🔅',
  '🔆',
  '📜',
  '📋',
  '📖',
  '📓',
  '📔',
  '📒',
  '📕',
  '📗',
  '📘',
  '📙',
  '📚',
  '📇',
  '🔗',
  '📎',
  '📌',
  '✂️',
  '📐',
  '📍',
  '📏',
  '🚩',
  '📁',
  '📂',
  '✒️',
  '✏️',
  '📝',
  '🔏',
  '🔐',
  '🔒',
  '🔓',
  '📣',
  '📢',
  '🔈',
  '🔉',
  '🔊',
  '🔇',
  '💤',
  '🔔',
  '🔕',
  '💭',
  '💬',
  '🚸',
  '🔍',
  '🔎',
  '🚫',
  '⛔️',
  '📛',
  '🚷',
  '🚯',
  '🚳',
  '🚱',
  '📵',
  '🔞',
  '🉑',
  '🉐',
  '💮',
  '㊙️',
  '㊗️',
  '🈴',
  '🈵',
  '🈲',
  '🈶',
  '🈚️',
  '🈸',
  '🈺',
  '🈷',
  '🈹',
  '🈳',
  '🈂',
  '🈁',
  '🈯️',
  '💹',
  '❇️',
  '✳️',
  '❎',
  '✅',
  '✴️',
  '📳',
  '📴',
  '🆚',
  '🅰',
  '🅱',
  '🆎',
  '🆑',
  '🅾',
  '🆘',
  '🆔',
  '🅿️',
  '🚾',
  '🆒',
  '🆓',
  '🆕',
  '🆖',
  '🆗',
  '🆙',
  '🏧',
  '♈️',
  '♉️',
  '♊️',
  '♋️',
  '♌️',
  '♍️',
  '♎️',
  '♏️',
  '♐️',
  '♑️',
  '♒️',
  '♓️',
  '🚻',
  '🚹',
  '🚺',
  '🚼',
  '♿️',
  '🚰',
  '🚭',
  '🚮',
  '▶️',
  '◀️',
  '🔼',
  '🔽',
  '⏩',
  '⏪',
  '⏫',
  '⏬',
  '➡️',
  '⬅️',
  '⬆️',
  '⬇️',
  '↗️',
  '↘️',
  '↙️',
  '↖️',
  '↕️',
  '↔️',
  '🔄',
  '↪️',
  '↩️',
  '⤴️',
  '⤵️',
  '🔀',
  '🔁',
  '🔂',
  '#⃣',
  '0⃣',
  '1⃣',
  '2⃣',
  '3⃣',
  '4⃣',
  '5⃣',
  '6⃣',
  '7⃣',
  '8⃣',
  '9⃣',
  '🔟',
  '🔢',
  '🔤',
  '🔡',
  '🔠',
  'ℹ️',
  '📶',
  '🎦',
  '🔣',
  '➕',
  '➖',
  '〰',
  '➗',
  '✖️',
  '✔️',
  '🔃',
  '™',
  '©',
  '®',
  '💱',
  '💲',
  '➰',
  '➿',
  '〽️',
  '❗️',
  '❓',
  '❕',
  '❔',
  '‼️',
  '⁉️',
  '❌',
  '⭕️',
  '💯',
  '🔚',
  '🔙',
  '🔛',
  '🔝',
  '🔜',
  '🌀',
  'Ⓜ️',
  '⛎',
  '🔯',
  '🔰',
  '🔱',
  '⚠️',
  '♨️',
  '♻️',
  '💢',
  '💠',
  '♠️',
  '♣️',
  '♥️',
  '♦️',
  '☑️',
  '⚪️',
  '⚫️',
  '🔘',
  '🔴',
  '🔵',
  '🔺',
  '🔻',
  '🔸',
  '🔹',
  '🔶',
  '🔷',
  '▪️',
  '▫️',
  '⬛️',
  '⬜️',
  '◼️',
  '◻️',
  '◾️',
  '◽️',
  '🔲',
  '🔳',
  '🕐',
  '🕑',
  '🕒',
  '🕓',
  '🕔',
  '🕕',
  '🕖',
  '🕗',
  '🕘',
  '🕙',
  '🕚',
  '🕛',
  '🕜',
  '🕝',
  '🕞',
  '🕟',
  '🕠',
  '🕡',
  '🕢',
  '🕣',
  '🕤',
  '🕥',
  '🕦',
  '🕧',
];

const EmojiSideButton = props => {
  const editor = useSlate();
  const { close } = props;
  const [isModal, setIsModal] = useState(false);

  const handleOpenModal = () => {
    setIsModal(!isModal);
  };

  const handleSelect = i => {
    editor.insertText(i);
    ReactEditor.focus(editor);
    setIsModal(false);
    close();
  };

  return (
    <>
      <button
        className="md-sb-button action-btn"
        onClick={handleOpenModal}
        title={props.intl.formatMessage({
          id: 'select_emoji',
          defaultMessage: 'Select emoji',
        })}
      >
        <span style={{ fontSize: '20px' }}>😌️</span>
        <span className="action-btn__caption">
          {props.intl.formatMessage({ id: 'select_emoji', defaultMessage: 'Emoji' })}
        </span>
      </button>
      <Modal onCancel={handleOpenModal} visible={isModal} footer={null}>
        <span className="action-btn__caption">
          {props.intl.formatMessage({ id: 'select_emoji', defaultMessage: 'Select emoji' })}
        </span>
        <div className="emoji__wrapper">
          {allEmojis.map(i => (
            <div key={i} onClick={() => handleSelect(i)} className="emoji__item">
              {i}
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default injectIntl(EmojiSideButton);

EmojiSideButton.propTypes = {
  intl: PropTypes.shape().isRequired,
  close: PropTypes.func,
};

EmojiSideButton.defaultProps = {
  setEditorState: () => {},
  getEditorState: () => {},
  close: () => {},
};
