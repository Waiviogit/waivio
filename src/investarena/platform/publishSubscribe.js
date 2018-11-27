export function publishSubscribe(target) {
  let topics = {};
  target.publish = (topic, args) => {
    if (topics[topic]) {
      let thisTopic = topics[topic];
      let thisArgs = args || [];
      thisTopic.forEach(listener => listener(thisArgs));
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
      let thisTopic = topics[topic];
      for (let i = 0, j = thisTopic.length; i < j; i++) {
        if (thisTopic[i] === callback) {
          thisTopic.splice(i, 1);
        }
      }
    }
  };
}
export function destroyPublishSubscribe(target) {
  delete target['publish'];
  delete target['subscribe'];
  delete target['unsubscribe'];
}
