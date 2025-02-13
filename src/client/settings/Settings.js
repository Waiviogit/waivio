import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Select, Radio, Checkbox } from 'antd';
import Cookie from 'js-cookie';
import { getCurrencyForSettings, saveSettings } from '../../store/settingsStore/settingsActions';
import { getCurrentCurrencyRate } from '../../store/appStore/appActions';
import { reload } from '../../store/authStore/authActions';
import { notify } from '../app/Notification/notificationActions';
import Action from '../components/Button/Action';
import Loading from '../components/Icon/Loading';
import RawSlider from '../components/Slider/RawSlider';
import requiresLogin from '../auth/requiresLogin';
import LANGUAGES from '../../common/translations/languages';
import { getLanguageText } from '../../common/translations';
import {
  getAuthenticatedUser,
  getIsReloading,
  isGuestUser,
} from '../../store/authStore/authSelectors';
import {
  getCurrency,
  getCurrencyList,
  getExitPageSetting,
  getHideLinkedObjects,
  getHideFavoriteObjects,
  getIsSettingsLoading,
  getLocale,
  getNightmode,
  getReadLanguages,
  getRewriteLinks,
  getShowNSFWPosts,
  getUpvoteSetting,
  getVotePercent,
  getVotingPower,
  getHideRecipeObjects,
} from '../../store/settingsStore/settingsSelectors';
import { defaultCurrency } from '../websites/constants/currencyTypes';
import { getIsWaivio } from '../../store/appStore/appSelectors';

import './Settings.less';

@requiresLogin
@injectIntl
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    reloading: getIsReloading(state),
    locale: getLocale(state),
    readLanguages: getReadLanguages(state),
    votingPower: getVotingPower(state),
    votePercent: getVotePercent(state),
    showNSFWPosts: getShowNSFWPosts(state),
    hideLinkedObjects: getHideLinkedObjects(state),
    hideRecipeObjects: getHideRecipeObjects(state),
    hideFavoriteObjects: getHideFavoriteObjects(state),
    nightmode: getNightmode(state),
    currency: getCurrency(state),
    isWaivio: getIsWaivio(state),
    rewriteLinks: getRewriteLinks(state),
    loading: getIsSettingsLoading(state),
    upvoteSetting: getUpvoteSetting(state),
    exitPageSetting: getExitPageSetting(state),
    isGuest: isGuestUser(state),
    currencyList: getCurrencyList(state),
  }),
  { reload, saveSettings, notify, getCurrencyForSettings, getCurrentCurrencyRate },
)
export default class Settings extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    reloading: PropTypes.bool,
    locale: PropTypes.string,
    currency: PropTypes.string,
    readLanguages: PropTypes.arrayOf(PropTypes.string),
    votingPower: PropTypes.bool,
    votePercent: PropTypes.number,
    loading: PropTypes.bool,
    showNSFWPosts: PropTypes.bool,
    hideLinkedObjects: PropTypes.bool,
    hideFavoriteObjects: PropTypes.bool,
    hideRecipeObjects: PropTypes.bool,
    nightmode: PropTypes.bool,
    rewriteLinks: PropTypes.bool,
    reload: PropTypes.func,
    saveSettings: PropTypes.func,
    notify: PropTypes.func,
    getCurrentCurrencyRate: PropTypes.func,
    getCurrencyForSettings: PropTypes.func.isRequired,
    upvoteSetting: PropTypes.bool,
    exitPageSetting: PropTypes.bool,
    isGuest: PropTypes.bool,
    user: PropTypes.shape({ name: PropTypes.string }),
    currencyList: PropTypes.arrayOf(PropTypes.string).isRequired,
    history: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    reloading: false,
    hideLinkedObjects: false,
    hideFavoriteObjects: false,
    hideRecipeObjects: false,
    locale: 'auto',
    readLanguages: [],
    votingPower: false,
    votePercent: 10000,
    loading: false,
    showNSFWPosts: false,
    nightmode: false,
    rewriteLinks: false,
    upvoteSetting: true,
    isWaivio: true,
    exitPageSetting: true,
    currency: defaultCurrency,
    isGuest: false,
    reload: () => {},
    saveSettings: () => {},
    notify: () => {},
    user: {},
    history: {},
    resetSearchAutoCompete: () => {},
  };

  constructor(props) {
    super(props);
    this.handleUpvoteSettingChange = this.handleUpvoteSettingChange.bind(this);

    this.state = {
      locale: props.locale,
      readLanguages: props.readLanguages,
      votingPower: props.votingPower,
      votePercent: props.votePercent,
      showNSFWPosts: props.showNSFWPosts,
      hideLinkedObjects: props.hideLinkedObjects,
      hideFavoriteObjects: props.hideLinkedObjects,
      hideRecipeObjects: props.hideRecipeObjects,
      nightmode: props.nightmode,
      rewriteLinks: props.rewriteLinks,
      exitPageSetting: props.upvoteSetting,
      upvoteSetting: props.exitPageSetting,
      searchBarActive: '',
      dropdownOpen: false,
      currency: props.currency,
    };
  }

  componentWillMount() {
    this.setState({
      locale: this.props.locale,
      readLanguages: this.props.readLanguages,
      votingPower: this.props.votingPower,
      votePercent: this.props.votePercent / 100,
      showNSFWPosts: this.props.showNSFWPosts,
      hideLinkedObjects: this.props.hideLinkedObjects,
      hideFavoriteObjects: this.props.hideFavoriteObjects,
      hideRecipeObjects: this.props.hideRecipeObjects,
      nightmode: this.props.nightmode,
      rewriteLinks: this.props.rewriteLinks,
      upvoteSetting: this.props.upvoteSetting,
      exitPageSetting: this.props.exitPageSetting,
    });
  }

  componentDidMount() {
    this.props.reload();
    this.props.getCurrencyForSettings();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      this.setState({ locale: nextProps.locale });
    }

    if (nextProps.readLanguages !== this.props.readLanguages) {
      this.setState({ readLanguages: nextProps.readLanguages });
    }

    if (nextProps.votingPower !== this.props.votingPower) {
      this.setState({ votingPower: nextProps.votingPower });
    }

    if (nextProps.votePercent !== this.props.votePercent) {
      this.setState({ votePercent: nextProps.votePercent / 100 });
    }

    if (nextProps.showNSFWPosts !== this.props.showNSFWPosts) {
      this.setState({ showNSFWPosts: nextProps.showNSFWPosts });
    }

    if (nextProps.nightmode !== this.props.nightmode) {
      this.setState({ nightmode: nextProps.nightmode });
    }

    if (nextProps.rewriteLinks !== this.props.rewriteLinks) {
      this.setState({ rewriteLinks: nextProps.rewriteLinks });
    }

    if (nextProps.upvoteSetting !== this.props.upvoteSetting) {
      this.setState({ upvoteSetting: nextProps.upvoteSetting });
    }

    if (nextProps.exitPageSetting !== this.props.exitPageSetting) {
      this.setState({ exitPageSetting: nextProps.exitPageSetting });
    }
  }

  handleSave = () => {
    this.props.getCurrentCurrencyRate(this.state.currency);
    this.props
      .saveSettings({
        locale: this.state.locale,
        votingPower: this.state.votingPower,
        showNSFWPosts: this.state.showNSFWPosts,
        nightmode: this.state.nightmode,
        rewriteLinks: this.state.rewriteLinks,
        exitPageSetting: this.state.exitPageSetting,
        upvoteSetting: this.state.upvoteSetting,
        postLocales: this.state.readLanguages,
        votePercent: this.state.votePercent * 100,
        currency: this.state.currency,
        hideFavoriteObjects: this.state.hideFavoriteObjects,
        hideRecipeObjects: this.state.hideRecipeObjects,
        shop: {
          hideLinkedObjects: this.state.hideLinkedObjects,
        },
      })
      .then(() =>
        this.props.notify(
          this.props.intl.formatMessage({ id: 'saved', defaultMessage: 'Saved' }),
          'success',
        ),
      )
      .then(() => {
        if (typeof window !== 'undefined') {
          window.setTimeout(() => {
            this.props.history.push(`/@${this.props.user.name}`);
          }, 1000);
        }
      });
  };

  handleLocaleChange = locale => this.setState({ locale });
  handleReadLanguageChange = readLanguages => this.setState({ readLanguages });
  handleVotingPowerChange = event => this.setState({ votingPower: event.target.value });
  handleVotePercentChange = value => this.setState({ votePercent: value });
  handleShowNSFWPosts = event => this.setState({ showNSFWPosts: event.target.checked });
  handleHideLinkedObjects = event => this.setState({ hideLinkedObjects: event.target.checked });
  handleHideFavoriteObjects = event => this.setState({ hideFavoriteObjects: event.target.checked });
  handleHideRecipeObjects = event => this.setState({ hideRecipeObjects: event.target.checked });
  handleNightmode = event => {
    Cookie.set('nightmode', event.target.checked);
    this.setState({ nightmode: event.target.checked });
  };
  handleRewriteLinksChange = event => this.setState({ rewriteLinks: event.target.checked });
  handleExitPageSettingChange = event => this.setState({ exitPageSetting: event.target.checked });
  handleUpvoteSettingChange = event => this.setState({ upvoteSetting: event.target.checked });

  render() {
    const {
      reloading,
      locale: initialLocale,
      readLanguages,
      votingPower: initialVotingPower,
      showNSFWPosts: initialShowNSFWPosts,
      hideLinkedObjects: initialHideLinkedObjects,
      hideFavoriteObjects: initialHideFavoriteObjects,
      hideRecipeObjects: initialHideRecipeObjects,
      nightmode: initialNightmode,
      loading,
      isGuest,
    } = this.props;
    const {
      votingPower,
      locale,
      showNSFWPosts,
      hideLinkedObjects,
      hideFavoriteObjects,
      hideRecipeObjects,
      nightmode,
      upvoteSetting,
      exitPageSetting,
    } = this.state;

    const initialLanguages =
      readLanguages && readLanguages.length
        ? readLanguages
        : LANGUAGES.find(lang => lang.name === 'English').id;
    const languageOptions = [];

    if (locale === 'auto') {
      languageOptions.push(
        <Select.Option disabled key="auto" value="auto">
          <FormattedMessage id="select_language" defaultMessage="Select your language" />
        </Select.Option>,
      );
    }

    LANGUAGES.forEach(lang => {
      languageOptions.push(
        <Select.Option key={lang.id} value={lang.id}>
          {getLanguageText(lang)}
        </Select.Option>,
      );
    });

    return (
      <div className="center">
        <h1>
          <FormattedMessage id="settings" defaultMessage="Settings" />
        </h1>
        {reloading ? (
          <Loading center={false} />
        ) : (
          <div className="Settings">
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="voting_power" defaultMessage="Voting Power" />
              </h3>
              <p>
                <FormattedMessage
                  id="voting_power_info"
                  defaultMessage="You can enable Voting Power slider to specify exact percentage of your Voting Power to use for like."
                />
              </p>
              <Radio.Group
                defaultValue={initialVotingPower}
                value={votingPower}
                onChange={this.handleVotingPowerChange}
              >
                <Radio value={false}>
                  <FormattedMessage id="voting_power_off" defaultMessage="Disable slider" />
                </Radio>
                <Radio value={Boolean(true)}>
                  <FormattedMessage id="voting_power_on" defaultMessage="Enable slider" />
                </Radio>
              </Radio.Group>
            </div>
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="vote_percent" defaultMessage="Default vote percent" />
              </h3>
              <p>
                <FormattedMessage
                  id="vote_percent_info"
                  defaultMessage="You can select your default vote value. It will be used as default value in voting slider and as value used for vote when voting slider is disabled."
                />
              </p>
              <div className="Settings__section__component">
                <RawSlider
                  initialValue={this.state.votePercent}
                  onChange={this.handleVotePercentChange}
                />
              </div>
            </div>
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="language" defaultMessage="Interface language" />
              </h3>
              <p>
                <FormattedMessage
                  id="language_info"
                  defaultMessage="Select the preferred language of the website and objects"
                />
              </p>
              <Select
                defaultValue={initialLocale}
                value={locale}
                style={{ width: '100%', maxWidth: 240 }}
                onChange={this.handleLocaleChange}
              >
                {languageOptions}
              </Select>
            </div>
            <div className="Settings__section">
              <h3>
                <FormattedMessage
                  id="post_languages"
                  defaultMessage="Content language preferences"
                />
              </h3>
              <p>
                <FormattedMessage
                  id="post_languages_info"
                  defaultMessage="Content from the blockchain (posts, comments) will be filtered according to these preferences"
                />
              </p>
              <Select
                mode="multiple"
                defaultValue={initialLanguages}
                style={{ width: '100%' }}
                onChange={this.handleReadLanguageChange}
              >
                {LANGUAGES.map(lang => (
                  <Select.Option key={lang.id} value={lang.id}>
                    {getLanguageText(lang)}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="base_currency" defaultMessage="Base currency" />
              </h3>
              <Select
                defaultValue={this.props.currency}
                style={{ width: '90px' }}
                onChange={currency => this.setState(() => ({ currency }))}
              >
                {this.props.currencyList?.map(currency => (
                  <Select.Option key={currency} value={currency}>
                    {currency}
                  </Select.Option>
                ))}
              </Select>
              <p>
                <FormattedMessage
                  id="post_currency_info"
                  defaultMessage="Base currency is used for displaying rewards, vote value and post earnings."
                />
              </p>
            </div>
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="nsfw_posts" defaultMessage="NSFW Posts" />
              </h3>
              <p>
                <FormattedMessage
                  id="display_nsfw_posts_details"
                  defaultMessage="You can enable all posts tagged with NSFW to be shown as default."
                />
              </p>
              <div className="Settings__section__checkbox">
                <Checkbox
                  name="nsfw_posts"
                  defaultChecked={initialShowNSFWPosts}
                  checked={showNSFWPosts}
                  onChange={this.handleShowNSFWPosts}
                >
                  <FormattedMessage id="display_nsfw_posts" defaultMessage="Display NSFW Posts" />
                </Checkbox>
              </div>
            </div>
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="shop" defaultMessage="Shop" />
              </h3>
              <p>
                <FormattedMessage
                  id="manage_your_public_shopping"
                  defaultMessage="You can manage your public shopping list in the profile."
                />
              </p>
              <div className="Settings__section__checkbox">
                <Checkbox
                  name="hideLinkedObjects"
                  defaultChecked={initialHideLinkedObjects}
                  checked={hideLinkedObjects}
                  onChange={this.handleHideLinkedObjects}
                >
                  <FormattedMessage
                    id="not_show_objects_linked"
                    defaultMessage="Do not show objects linked in posts"
                  />
                </Checkbox>
              </div>
            </div>{' '}
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="recipe" defaultMessage="Recipe" />
              </h3>
              <p>
                <FormattedMessage
                  id="manage_your_public_recipe"
                  defaultMessage="You can manage your public recipe list in the profile."
                />
              </p>
              <div className="Settings__section__checkbox">
                <Checkbox
                  name="hideLinkedObjects"
                  defaultChecked={initialHideRecipeObjects}
                  checked={hideRecipeObjects}
                  onChange={this.handleHideRecipeObjects}
                >
                  <FormattedMessage
                    id="not_show_objects_linked"
                    defaultMessage="Do not show objects linked in posts"
                  />
                </Checkbox>
              </div>
            </div>{' '}
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="favorites" defaultMessage="Favorites" />
              </h3>
              <p>
                <FormattedMessage
                  id="manage_your_public_shopping_favorites"
                  defaultMessage="You can manage your public favorites list in the profile."
                />
              </p>
              <div className="Settings__section__checkbox">
                <Checkbox
                  name="hideLinkedObjects"
                  defaultChecked={initialHideFavoriteObjects}
                  checked={hideFavoriteObjects}
                  onChange={this.handleHideFavoriteObjects}
                >
                  <FormattedMessage
                    id="not_show_objects_linked"
                    defaultMessage="Do not show objects linked in posts"
                  />
                </Checkbox>
              </div>
            </div>
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="nightmode" defaultMessage="Nightmode" />
              </h3>
              <p>
                <FormattedMessage
                  id="nightmode_details"
                  defaultMessage="You can enable this option for a more eye-friendly experience at night."
                />
              </p>
              <div className="Settings__section__checkbox">
                <Checkbox
                  name="nightmode"
                  defaultChecked={initialNightmode}
                  checked={nightmode}
                  onChange={this.handleNightmode}
                >
                  <FormattedMessage id="use_nightmode" defaultMessage="Use Nightmode" />
                </Checkbox>
              </div>
            </div>
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="upvote_setting" defaultMessage="Like my posts" />
              </h3>
              <p>
                <FormattedMessage
                  id="upvote_setting_details"
                  defaultMessage="Enable this option to automatically like your own posts."
                />
              </p>
              <div className="Settings__section__checkbox">
                <Checkbox
                  name="upvote_setting"
                  checked={!isGuest ? upvoteSetting : false}
                  onChange={this.handleUpvoteSettingChange}
                  disabled={isGuest}
                >
                  <FormattedMessage id="upvote_setting" defaultMessage="Like my posts" />
                </Checkbox>
              </div>
            </div>
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="enable_exit_page" defaultMessage="Enable exit page" />
              </h3>
              <p>
                <FormattedMessage
                  id="enable_exit_page_details"
                  defaultMessage="Enable this option to use the exit page when clicking on an external link."
                />
              </p>
              <div className="Settings__section__checkbox">
                <Checkbox
                  name="exit_page_setting"
                  checked={exitPageSetting}
                  onChange={this.handleExitPageSettingChange}
                >
                  <FormattedMessage id="enable_exit_page" defaultMessage="Enable exit page" />
                </Checkbox>
              </div>
            </div>
            <Action primary big loading={loading} onClick={this.handleSave}>
              <FormattedMessage id="save" defaultMessage="Save" />
            </Action>
          </div>
        )}
      </div>
    );
  }
}
