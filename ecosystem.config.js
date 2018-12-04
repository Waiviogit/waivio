module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */

  apps: [
    {
      name: 'waivio',
      script: 'build/server.js',
      instances: 4,
      exec_mode: 'cluster',
      max_memory_restart: '600M',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '8081',
      },
    },
  ],

  deploy: {
    production: {
      user: 'admin',
      host: '35.157.207.192',
      ref: 'origin/master',
      repo: 'git@github.com:Waiviogit/waivio.git',
      path: '/home/admin/waivio',
      'post-deploy': 'npm run build && pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
};
