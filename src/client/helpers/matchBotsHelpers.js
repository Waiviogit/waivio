export const MATCH_BOTS_TYPES = {
  AUTHORS: 'waivioauthors',
  CURATORS: 'waiviocurators',
  SPONSORS: 'waiviocampaigns',
};

export const MATCH_BOTS_NAMES = {
  AUTHORS: 'author',
  CURATORS: 'curator',
};

export const redirectAuthHiveSigner = (isAuthority, botType) => {
  const path = window.location.href;

  !isAuthority
    ? (window.location = `https://hivesigner.com/authorize/${botType}?redirect_uri=${path}&callback`)
    : (window.location = `https://hivesigner.com/revoke/${botType}?redirect_uri=${path}&callback`);
};
