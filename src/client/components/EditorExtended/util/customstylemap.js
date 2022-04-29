import { Inline } from './constants';

/*
Custom style map for custom entities like Hihglight.
*/
const customStyleMap = {
  [Inline.HIGHLIGHT]: {
    backgroundColor: 'yellow',
  },
  [Inline.CODE]: {
    padding: '2px 4px',
    backgroundColor: '#f2f2f2',
    color: '#303030',
  },
};

export default customStyleMap;
