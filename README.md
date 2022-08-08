# EasyWork 后端

## 运行说明

运行前需先安装 `docker` 及 `docker-compose`

1. 执行 `git clone https://github.com/wo-amlangwang/EasyWorkFE.git && cd EasyWorkFE && npm install && npm run build`
2. 移动其在 `dist` 目录下生成的静态资源文件到 `templates` 目录下
3. 修改 `Nginx配置文件 `conf/nginx/easywork.conf.demo` 并重命名文件为 `easywork.conf.demo`
4. 修改后端配置文件 `api_server/config.js.demo` 并重命名文件为 `api_server/config.js`
3. 执行 `sudo docker-compose up -d` 启动后端项目

## 文件说明

* `database.sql`: 数据库脚本文件, 用于建表, 第一次运行时请手动导入
