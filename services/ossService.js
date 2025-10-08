let { client } = require("../db/oss");
const stream = require("stream");
const fs = require("fs");
const config = require("config");
const ossConfig = config.get("oss");
let path = require("path");
const { IncomingForm } = require("formidable");

module.exports = {
  /**
   * 读取请求中的文件
   * @param {*} req 请求对象
   * @returns {Object} { fields, files, tempFilePath } fields(文件字段)，files(文件)，tempFilePath(本地存储路径)
   */
  readAndSaveFile:async (req) => {
    return new Promise((resolve, reject) => {
      const form = new IncomingForm({
        uploadDir: path.resolve(__dirname, "../temp/images"), // 定义文件的临时存储位置
        maxFileSize: 30  * 1024 * 1024, // 大小限制为30M 
      });
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.log('文件上传出错:',err);
          let error = {
            msg: `文件上传出错，请联系管理员，错误代码：${err.code}`,
            status: 500,
          };
          switch (err.code) {
            case 1009:
              error.msg = `文件过大，请压缩后上传（30MB以下）`;
              error.status = "500";
              break;
          }
          return reject(error);
        }
        const tempFilePath = files.file[0].filepath;
        resolve({ fields, files, tempFilePath });
      });
    });
  },
  /**
   * 删除本地文件
   * @param {String} filePath  文件位置
   */
  deleteLocalFile: (filePath) => {
    fs.unlinkSync(filePath); // 删除临时文件
  },
  /**
   * 上传文本内容到OSS指定路径，可用于覆盖原文件内容
   * @param {String} path 上传文件的oss目录位置
   * @param {String} content 文本内容
   * @returns 若果上传成功则返回状态，否则返回-1
   */
  uploadOrUpdateFile: async (path, content) => {
    try {
      const pass = new stream.PassThrough(); // 创建passThrough流
      pass.end(content); // 写入流
      let result = await client.putStream(ossConfig.baseDir + path, pass);
      return result.res.status;
    } catch (e) {
      console.log(e);
      throw new Error(`${e.message}`);
    }
  },

  /**
   * OSS删除文件
   * @param {String} path oss中的文件路径
   * @param {Boolean} prefixOrNot 是否添加ossConfig.baseDir前缀
   * @returns 若果删除成功则返回状态，否则返回-1
   */
  deleteFile: async (path, prefixOrNot = true) => {
    try {
      let result = await client.delete(
        (prefixOrNot ? ossConfig.baseDir : "") + path
      );
      return result.res.status;
    } catch (e) {
      console.log(e);
      throw new Error(`${e.message}`);
    }
  },

  /**
   * 获取oss指定路径下的文件列表
   * @param {String} path oss路径 注：不以 / 开头和结尾
   * @param {String} delimiter 默认null。若为'/'分割文件和文件夹，同时只展示当前目录下的内容，目录文件夹中的文件不会获取
   * @returns 若果获取成功则返回文件列表，否则返回-1
   */
  getFileInPath: async (path, delimiter = null) => {
    try {
      let result = await client.list({
        "max-keys": 500,
        prefix: ossConfig.baseDir.replace(/\//g, "") + path,
        delimiter: delimiter, // 是否分割文件夹和文件，只展示当前目录下的文件和文件夹
      });
      if (Array.isArray(result.prefixes)) {
        result.objects.push(...result.prefixes);
      }
      return result.objects;
    } catch (e) {
      console.log(e);
      throw new Error(`${e.message}`);
    }
  },

  /**
   * 获取oss指定路径下的文件内容
   * @param {String} path oss中的路径(包含文件名及后缀)
   * @returns 若成功返回文本，否则返回-1
   */
  getFileContent: async (path) => {
    try {
      const fileStreamPromise = await client.getStream(
        ossConfig.baseDir + path
      ); // 流获取文本
      // 拼接流文本
      let content = "";
      for await (const chunk of fileStreamPromise.stream) {
        content += chunk;
      }
      return content;
    } catch (e) {
      console.log(e);
      throw new Error(`${e.message}`);
    }
  },

  /**
   * 流式上传文件
   * @param {String} path oss中的路径(包含文件名及后缀)
   * @param {String} file 文件所在位置
   * @returns 若成功返回200状态，否则返回-1
   */
  uploadFileStream: async (path, filePath) => {
    let stream = fs.createReadStream(filePath);
    try {
      const result = await client.put(ossConfig.baseDir + path, stream);
      // const result = await client.multipartUpload(ossConfig.baseDir + path,filePath,{
      //   progress: (percentage) => {
      //     console.log(`上传进度 ${(percentage * 100).toFixed(2)}%`);
      //   }
      // })
      result.code = 200; // 设置成功状态码
      result.msg = "上传图片成功✅"; // 设置成功消息
      return result;
    } catch (e) {
      console.log("流式上传文件出错:", e);
      throw new Error(`${e.message}`);
    }
  },
};
