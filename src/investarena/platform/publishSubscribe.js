/* eslint-disable no-param-reassign */
export function publishSubscribe(target) {
  const topics = {};
  target.publish = (topic, wsMsg) => {
    if (topics[topic]) {
      const thisTopic = topics[topic];
      thisTopic.forEach(listener => listener(wsMsg));
    }
  };
  target.subscribe = (topic, callback) => {
    if (!topics[topic]) {
      topics[topic] = [];
    }
    topics[topic].push(callback);
  };
  target.unsubscribe = (topic, callback) => {
    if (topics[topic]) {
      const thisTopic = topics[topic];
      for (let i = 0, j = thisTopic.length; i < j; i++) {
        if (thisTopic[i] === callback) {
          thisTopic.splice(i, 1);
        }
      }
    }
  };
}
export function destroyPublishSubscribe(target) {
  delete target.publish;
  delete target.subscribe;
  delete target.unsubscribe;
}
