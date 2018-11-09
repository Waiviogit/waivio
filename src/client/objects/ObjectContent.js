import React from 'react';
import _ from 'lodash';
import { people } from '../helpers/constants';
import WaivioObject from './WaivioObject';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import * as ApiClient from '../../waivioApi/ApiClient';
import Loading from '../components/Icon/Loading';

// const displayLimit = 20;

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
    wobjs: [],
  };

  componentDidMount() {
    ApiClient.getObjects().then(wobjs => {
      this.setState({ wobjs });
    });
  }

  handleLoadMore = () => {
    // const { wobjs } = this.state;
    // const moreWobjStartIndex = wobjs.length;
    // const moreWobj = people.slice(moreWobjStartIndex, moreWobjStartIndex + displayLimit);
    // SteemAPI.sendAsync('get_accounts', [moreWobj]).then(moreWobjResponse =>
    //   this.setState({
    //     wobjs: wobjs.concat(moreWobjResponse),
    //   }),
    // );
  };

  render() {
    const { wobjs } = this.state;
    const ordered = _.orderBy(wobjs, ['weight'], ['desc']);
    const hasMore = wobjs.length !== people.length;

    if (!wobjs) {
      return <Loading />;
    }

    return (
      <div>
        <ReduxInfiniteScroll hasMore={hasMore} loadMore={this.handleLoadMore}>
          {_.map(ordered, wobj => <WaivioObject wobj={wobj} key={wobj.tag} />)}
        </ReduxInfiniteScroll>
      </div>
    );
  }
}

export default ObjectContent;
