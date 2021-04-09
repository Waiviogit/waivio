import {
  getExitPageSetting,
  getIsSettingsLoading,
  getLocale,
  getNightmode,
  getReadLanguages,
  getRewardSetting,
  getRewriteLinks,
  getShowNSFWPosts,
  getUpvoteSetting,
  getVotePercent,
  getVotingPower,
} from '../../store/settingsStore/settingsSelectors';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromSettings', () => {
  const state = {
    settings: {
      loading: 'loading',
      locale: 'locale',
      postLocales: 'postLocales',
      votingPower: 'votingPower',
      votePercent: 'votePercent',
      showNSFWPosts: 'showNSFWPosts',
      nightmode: 'nightmode',
      rewriteLinks: 'rewriteLinks',
      upvoteSetting: 'upvoteSetting',
      exitPageSetting: 'exitPageSetting',
      rewardSetting: 'rewardSetting',
    },
  };

  it('Should return loading', () => {
    expect(getIsSettingsLoading(state)).toEqual('loading');
  });

  it('Should return locale', () => {
    expect(getLocale(state)).toEqual('locale');
  });

  it('Should return postLocales', () => {
    expect(getReadLanguages(state)).toEqual('postLocales');
  });

  it('Should return votingPower', () => {
    expect(getVotingPower(state)).toEqual('votingPower');
  });

  it('Should return votePercent', () => {
    expect(getVotePercent(state)).toEqual('votePercent');
  });

  it('Should return showNSFWPosts', () => {
    expect(getShowNSFWPosts(state)).toEqual('showNSFWPosts');
  });

  it('Should return nightmode', () => {
    expect(getNightmode(state)).toEqual('nightmode');
  });

  it('Should return true from rewriteLinks', () => {
    expect(getRewriteLinks(state)).toEqual(true);
  });

  it('Should return false from rewriteLinks', () => {
    state.settings.rewriteLinks = '';
    expect(getRewriteLinks(state)).toEqual(false);
  });

  it('Should return upvoteSetting', () => {
    expect(getUpvoteSetting(state)).toEqual('upvoteSetting');
  });

  it('Should return exitPageSetting', () => {
    expect(getExitPageSetting(state)).toEqual('exitPageSetting');
  });

  it('Should return rewardSetting', () => {
    expect(getRewardSetting(state)).toEqual('rewardSetting');
  });
});
