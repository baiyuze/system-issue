'use strict';

const Controller = require('egg').Controller;
const awaitWriteStream = require('await-stream-ready').write;
const fs = require('fs');
const path = require('path');
const formidable = require("formidable");
const sendToWormhole = require('stream-wormhole');

class FileUpload extends Controller {
  constructor(ctx) {
    super(ctx);
  }
  
  //文件上传处理
  async fileUpload(req) {
    const form = new formidable.IncomingForm();
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        resolve({ fields, files })
      })
    });
  }

  //接收到文件上传请求
  async unpack(req, getPath) {
    const fileObj = await this.fileUpload(req);
    let name = fileObj.files.file.name;
    let file = fileObj.files.file;

    let fileName = name.split('_')[0];
    let version = name.split('_')[1].split('.gz')[0];
    let systemPath = path.join(__dirname, `../../system/${fileName}`);
    let versionPath = path.join(__dirname, `../../system/${fileName}/${version}`);

    //创建文件夹
    if(fs.existsSync(versionPath)) {
      return {
        code: 500,
        data: null,
        message: '当前版本已存在，请直接发布'
      }
    } else {
      try {
        fs.mkdirSync(versionPath);
      } catch (error) {
  
        fs.mkdirSync(systemPath);
        fs.mkdirSync(versionPath);
      }
    }
    //生成文件
    const stream = fs.createReadStream(file.path);
    const writeStream = fs.createWriteStream(path.join(versionPath, `${fileName}.gz`));
    try {
      //异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream));
      return {
        code: 500,
        data: null,
        message: '上传成功'
      }
    } catch (err) {
      return {
        code: 500,
        data: null,
        message: err
      };
    }

  }

  //开始解压文件
  async startFileUnpack() {

  }

}

module.exports = FileUpload;

