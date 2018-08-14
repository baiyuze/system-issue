const Controller = require("egg").Controller;

class System extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * @api {/system/api/issue/file}
   * @param {file}
   * @method {post}
   * 
   */
  async file() {
    const path = await getPath(this);

    this.ctx.body = await this.service.system.unpack(
      this.ctx.req,
      path
    );
  }

/**
 * @api {/system/api/issue/start}
 * @param {}
 * @method {post}
 * 
 */
 async startIssue() {
  const path = await getPath(this);

  this.ctx.body = await this.service.system.startIssue(
    this.ctx.req,
    path
  );
 }
}

const getPath = async that => {
  return that.ctx.url
    .split("/")
    .slice(2)
    .join("/");
};

module.exports = System;