import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Select, Radio, Checkbox } from 'antd';
import {
  getIsReloading,
  getLocale,
  getReadLanguages,
  getVotingPower,
  getIsSettingsLoading,
  getVotePercent,
  getShowNSFWPosts,
  getNightmode,
  getRewriteLinks,
  getUpvoteSetting,
  getExitPageSetting,
} from '../reducers';
import { saveSettings } from './settingsActions';
import { reload } from '../auth/authActions';
import { notify } from '../app/Notification/notificationActions';
import Action from '../components/Button/Action';
import Loading from '../components/Icon/Loading';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RawSlider from '../components/Slider/RawSlider';
import requiresLogin from '../auth/requiresLogin';
import LANGUAGES from '../translations/languages';
import { getLanguageText } from '../translations';
import './Settings.less';
import packageJson from '../../../package.json';
import TopNavigation from '../components/Navigation/TopNavigation';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';

@requiresLogin
@injectIntl
@connect(
  state => ({
    reloading: getIsReloading(state),
    locale: getLocale(state),
    readLanguages: getReadLanguages(state),
    votingPower: getVotingPower(state),
    votePercent: getVotePercent(state),
    showNSFWPosts: getShowNSFWPosts(state),
    nightmode: getNightmode(state),
    rewriteLinks: getRewriteLinks(state),
    loading: getIsSettingsLoading(state),
    upvoteSetting: getUpvoteSetting(state),
    exitPageSetting: getExitPageSetting(state),
  }),
  { reload, saveSettings, notify },
)
export default class Settings extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    reloading: PropTypes.bool,
    locale: PropTypes.string,
    readLanguages: PropTypes.arrayOf(PropTypes.string),
    votingPower: PropTypes.bool,
    votePercent: PropTypes.number,
    loading: PropTypes.bool,
    showNSFWPosts: PropTypes.bool,
    nightmode: PropTypes.bool,
    rewriteLinks: PropTypes.bool,
    reload: PropTypes.func,
    saveSettings: PropTypes.func,
    notify: PropTypes.func,
    upvoteSetting: PropTypes.bool,
    exitPageSetting: PropTypes.bool,
    userName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    reloading: false,
    locale: 'auto',
    readLanguages: [],
    votingPower: false,
    votePercent: 10000,
    loading: false,
    showNSFWPosts: false,
    nightmode: false,
    rewriteLinks: false,
    upvoteSetting: true,
    exitPageSetting: true,
    reload: () => {},
    saveSettings: () => {},
    notify: () => {},
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
      nightmode: props.nightmode,
      rewriteLinks: props.rewriteLinks,
      exitPageSetting: props.upvoteSetting,
      upvoteSetting: props.exitPageSetting,
    };
  }

  componentWillMount() {
    this.setState({
      locale: this.props.locale,
      readLanguages: this.props.readLanguages,
      votingPower: this.props.votingPower,
      votePercent: this.props.votePercent / 100,
      showNSFWPosts: this.props.showNSFWPosts,
      nightmode: this.props.nightmode,
      rewriteLinks: this.props.rewriteLinks,
      upvoteSetting: this.props.upvoteSetting,
      exitPageSetting: this.props.exitPageSetting,
    });
  }

  componentDidMount() {
    this.props.reload();
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
      })
      .then(() =>
        this.props.notify(
          this.props.intl.formatMessage({ id: 'saved', defaultMessage: 'Saved' }),
          'success',
        ),
      );
  };

  handleLocaleChange = locale => this.setState({ locale });
  handleReadLanguageChange = readLanguages => this.setState({ readLanguages });
  handleVotingPowerChange = event => this.setState({ votingPower: event.target.value });
  handleVotePercentChange = value => this.setState({ votePercent: value });
  handleShowNSFWPosts = event => this.setState({ showNSFWPosts: event.target.checked });
  handleNightmode = event => this.setState({ nightmode: event.target.checked });
  handleRewriteLinksChange = event => this.setState({ rewriteLinks: event.target.checked });
  handleExitPageSettingChange = event => this.setState({ exitPageSetting: event.target.checked });
  handleUpvoteSettingChange = event => this.setState({ upvoteSetting: event.target.checked });

  render() {
    const {
      intl,
      reloading,
      locale: initialLocale,
      readLanguages,
      votingPower: initialVotingPower,
      showNSFWPosts: initialShowNSFWPosts,
      nightmode: initialNightmode,
      loading,
      userName,
    } = this.props;
    const {
      votingPower,
      locale,
      showNSFWPosts,
      nightmode,
      rewriteLinks,
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
      <React.Fragment>
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'settings', defaultMessage: 'Settings' })} - Waivio
          </title>
        </Helmet>
        <div className="settings-layout container">
          <TopNavigation authenticated userName={userName} />
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">
            <MobileNavigation />
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
                    <FormattedMessage id="language" defaultMessage="Language" />
                  </h3>
                  <p>
                    <FormattedMessage
                      id="language_info"
                      defaultMessage="What language do you want to use on Waivio?"
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
                    <FormattedMessage id="post_languages" defaultMessage="Posts languages" />
                  </h3>
                  <p>
                    <FormattedMessage
                      id="post_languages_info"
                      defaultMessage="In which languages do you want to read posts?"
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
                      <FormattedMessage
                        id="display_nsfw_posts"
                        defaultMessage="Display NSFW Posts"
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
                    <FormattedMessage id="rewrite_links" defaultMessage="Rewrite links" />
                  </h3>
                  <p>
                    <FormattedMessage
                      id="rewrite_links_details"
                      defaultMessage="You can enable this option to replace Steemit.com links with Waivio links."
                    />
                  </p>
                  <div className="Settings__section__checkbox">
                    <Checkbox
                      name="rewrite_links"
                      checked={rewriteLinks}
                      onChange={this.handleRewriteLinksChange}
                    >
                      <FormattedMessage id="rewrite_links" defaultMessage="Rewrite links" />
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
                      checked={upvoteSetting}
                      onChange={this.handleUpvoteSettingChange}
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
                <div className="Settings__version">
                  <p>
                    <FormattedMessage
                      id="version"
                      defaultMessage="Version: {version}"
                      values={{ version: packageJson.version }}
                    />
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
