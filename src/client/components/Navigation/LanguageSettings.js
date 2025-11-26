import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Icon } from 'antd';
import Cookie from 'js-cookie';
import LANGUAGES from '../../../common/translations/languages';
import { getLanguageText } from '../../../common/translations';
import { saveSettings, setLocale } from '../../../store/settingsStore/settingsActions';
import Popover from '../Popover';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import { setUsedLocale } from '../../../store/appStore/appActions';

import './LanguageSettings.less';

@connect(
  state => ({
    usedLocale: getUsedLocale(state),
  }),
  {
    saveSettings,
    setLocale,
    setUsedLocale,
  },
)
class LanguageSettings extends React.Component {
  static propTypes = {
    usedLocale: PropTypes.string,
    setLocale: PropTypes.func,
    setUsedLocale: PropTypes.func,
    triggerButtonClass: PropTypes.string,
    iconClassName: PropTypes.string,
    useGlobalIcon: PropTypes.bool,
  };

  static defaultProps = {
    usedLocale: 'en-US',
    setLocale: () => {},
    useGlobalIcon: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      languageSettingsVisible: false,
      selectedLoadingLanguage: '',
    };

    this.handleLanguageSettingsVisibleChange = this.handleLanguageSettingsVisibleChange.bind(this);
    this.handleLanguageSettingsSelect = this.handleLanguageSettingsSelect.bind(this);
  }

  handleLanguageSettingsVisibleChange(visible) {
    this.setState({ languageSettingsVisible: visible });
  }

  handleLanguageSettingsSelect(selectedLanguage) {
    Cookie.set('language', selectedLanguage);
    this.setState({
      languageSettingsVisible: false,
    });

    this.props.setLocale(selectedLanguage);
    this.props.setUsedLocale(selectedLanguage);
  }

  render() {
    const { usedLocale, triggerButtonClass, iconClassName, useGlobalIcon } = this.props;
    const { languageSettingsVisible } = this.state;

    const buttonClassName = triggerButtonClass || 'Topnav__link Topnav__link--light';

    // eslint-disable-next-line no-nested-ternary
    const iconElement = useGlobalIcon ? (
      <Icon type="global" />
    ) : iconClassName ? (
      <i className={iconClassName} />
    ) : (
      <i className="iconfont icon-language" />
    );

    return (
      <Popover
        placement="bottom"
        trigger="click"
        visible={languageSettingsVisible}
        onVisibleChange={this.handleLanguageSettingsVisibleChange}
        overlayStyle={{ position: 'fixed' }}
        overlayClassName="LanguageSettings "
        content={
          <PopoverMenu onSelect={this.handleLanguageSettingsSelect}>
            {LANGUAGES.map(lang => (
              <PopoverMenuItem key={lang.id}>
                <span
                  className={classNames('LanguageSettings__option', {
                    'LanguageSettings__option-selected': usedLocale === lang.id,
                  })}
                >
                  {getLanguageText(lang)}
                </span>
              </PopoverMenuItem>
            ))}
          </PopoverMenu>
        }
      >
        <a className={buttonClassName}>{iconElement}</a>
      </Popover>
    );
  }
}

export default LanguageSettings;
