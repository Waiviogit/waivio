module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'busy',
      script: 'build/server.js',
      env: {
        NODE_ENV: 'staging',
      },
      instances: 4,
      exec_mode: 'cluster',
      max_memory_restart: '1G',
    },
  ],
};
