import _ from 'lodash';

export function getBrokersFormatter(brokers) {
  let options = [];
  _.forEach(brokers, broker => {
    options.push({
      broker_options: {
        broker_name: broker.broker_name,
        email: broker.email,
      },
      value: `${broker.broker_name} ${broker.email}`,
      label: `${broker.broker_name} ${broker.email}`,
    });
  });
  return options;
}

export function getBrokerFormatter(broker) {
  let options = [];
  options.push({
    broker_options: {
      broker_name: broker.broker_name,
      email: broker.email,
    },
    value: `${broker.broker_name} ${broker.email}`,
    label: `${broker.broker_name} ${broker.email}`,
  });
  return options;
}
