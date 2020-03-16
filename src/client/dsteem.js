import * as dsteem from 'dsteem';
import * as steem from 'steem';

export const dSteem = new dsteem.Client('https://api.steemit.com');

export const calcReputation = rep => steem.formatter.reputation(rep);
