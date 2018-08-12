'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.seaPage);
  // router.post('',controller.api.startLogin);
  // router.get('',controller.api.loginOut);
  router.get(/^\/download(\/[\w-.]+)+$/,controller.api.download);
  router.get(/^\/api(\/[\w-.]+)+$/,controller.api.proxy);
  router.post(/^\/api(\/[\w-.]+)+$/,controller.api.proxy);
  // router.get(/^\/system(\/[\w-.]+)+$/,controller.system.file);
  router.post('/system/api/issue/file',controller.system.file);//
};1
