const appsList = require('steemscript/apps.json');

const waivioApplist = {
  waivio: {
    name: 'Waivio',
    homepage: 'https://waivio.com',
    url_scheme: 'https://waivio.com/{category}/@{username}/{permlink}',
  },
  investarena: {
    name: 'InvestArena',
    homepage: 'https://investarena.com',
    url_scheme: 'https://investarena.com/{category}/@{username}/{permlink}',
  },
};
const apps = {};

Object.keys(appsList).forEach(key => {
  apps[key] = appsList[key].name;
});

Object.keys(waivioApplist).forEach(key => {
  apps[key] = waivioApplist[key].name;
});

export default apps;
