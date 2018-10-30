import React from 'react';
import { people } from '../helpers/constants';
import WaivioObject from './WaivioObject';
import SteemAPI from '../steemAPI';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';

const displayLimit = 20;

export const mockObjects = [
  {
    id: 300,
    reputation: '996819810443205',
    name: 'zcash',
    json_metadata:
      '{"wobjData": {"name": "Z-cash", "about":"The Future of Z-cash", "location":"https://discord.gg/XkkhCc4", "avatar": "https://www.investarena.com/static/images/logoQuotes/Zcash.png", "website":"https://z.cash/"}}',
  },
];

class ObjectContent extends React.Component {
  state = {
    wobjs: mockObjects,
  };

  handleLoadMore = () => {
    const { wobjs } = this.state;
    const moreWobjStartIndex = wobjs.length;
    const moreWobj = people.slice(moreWobjStartIndex, moreWobjStartIndex + displayLimit);
    SteemAPI.sendAsync('get_accounts', [moreWobj]).then(moreWobjResponse =>
      this.setState({
        wobjs: wobjs.concat(moreWobjResponse),
      }),
    );
  };

  render() {
    const { wobjs } = this.state;
    const hasMore = wobjs.length !== people.length;
    return (
      <div>
        <ReduxInfiniteScroll hasMore={hasMore} loadMore={this.handleLoadMore}>
          {wobjs.map(wobj => <WaivioObject wobj={wobj} key={wobj.id} />)}
        </ReduxInfiniteScroll>
      </div>
    );
  }
}

export default ObjectContent;
