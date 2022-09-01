export const getPropositionsKey = (proposition, index) =>
  `${proposition?.object?.author_permlink}/${proposition?.guideName}/${proposition?.activationPermlink}/${index}`;

export default null;
