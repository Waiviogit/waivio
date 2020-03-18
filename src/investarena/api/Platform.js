import Base from './Base';

export default class Platform extends Base {
  getCryptoCurrenciesDescription() {
    return this.apiClient
      .get(`https://static.xcritical.com/data/cryptocurrenciesDescriptionsEn.json`)
      .then(res => res.data);
  }
}
