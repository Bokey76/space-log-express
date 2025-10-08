module.exports = {
  apps : [{
    script: './bin/www',
    watch: true,
    ignore_watch: ["node_modules", "logs","temp"],
    error_file: "./logs/error.log", // 报错日志的输出文件夹
    out_file: "./logs/out.log", // 日志的输出文件夹
    log_date_format: "YYYY-MM-DD HH:mm:ss", // 日志的时间格式
    env: {
      NODE_ENV: 'dev',
      name: 'spaceP_dev',
      NODE_APP_INSTANCE: 'dev'
    },
    env_beta: {
      NODE_ENV: 'beta',
      name: 'spaceP_beta',
      NODE_APP_INSTANCE: 'beta'
    },
    env_pro: {
      NODE_ENV: 'pro',
      name: 'spaceP_pro',
      NODE_APP_INSTANCE: 'pro'
    },
  }]
};
