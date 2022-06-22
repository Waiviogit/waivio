export const rewardsPost = {
  parent_author: 'waivio.welcome',
  parent_permlink: 'campaigns',
};

export const createBody = campaign =>
  `${campaign.guideName} has activated rewards campaign for <a href="/object/${campaign.requiredObject}">${campaign.name}</a> with the target reward of $ ${campaign.reward} ${campaign.currency}. Campaign expiry date: ${campaign.expiryDate}.`;
