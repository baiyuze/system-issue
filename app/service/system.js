'use strict';

const Controller = require('egg').Controller;
const awaitWriteStream = require('await-stream-ready').write;
const fs = require('fs');
const path = require('path');
const formidable = require("formidable");
const { spawn } = require('child_process');
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
      await this.startFileUnpack(`${fileName}.gz`, versionPath, version, name);
      await this.startIssue(versionPath);
      return {
        code: 500,
        data: null,
        message: '部署成功'
      }
    } catch (err) {
      return {
        code: 500,
        data: null,
        message: err
      };
    }

  }

  
  /** 开始解压文件
   * @param { fileName, versionPath, version, systemName}
   * @return null;
   * 
  */
  async startFileUnpack(fileName, versionPath, version, systemName) {
    return new Promise((resolve, reject) => {
      let unPack = spawn('tar', ['-x','-v', '-f',fileName],{ cwd: versionPath });
      let pid = unPack.pid;
  
      unPack.stdout.on('data', (data) => {
        console.log(`${data}`);
      });
      
      unPack.stderr.on('data', (data) => {
        console.log(`${data}`);
      });
      
      unPack.on('close', (code) => {
        let arr = fs.readFileSync(path.join(__dirname, '../pid/list.json'),{
          encoding: 'UTF8'
        });
        arr = arr ? JSON.parse(arr) : [];
        arr.push({
          version: version,
          name: systemName,
          pid: pid
        });
        
        fs.writeFileSync(path.join(__dirname, '../pid/list.json'), JSON.stringify(arr));
        resolve();
      });
    })

  }

  //开始部署应用
  startIssue(versionPath) {
    return new Promise((resolve, reject) => {
      let unPack = spawn('npm', ['start'],{ cwd: versionPath });
      let pid = unPack.pid;
  
      unPack.stdout.on('data', (data) => {
        console.log(`${data}`);
      });
      
      unPack.stderr.on('data', (data) => {
        console.log(`${data}`);
      });
      unPack.on('close', (code) => {
        console.log('当前版本已部署');
        resolve();
      })
    });
  }

  

}

module.exports = FileUpload;

