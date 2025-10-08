const transporter = require("../db/mail");
const redisService = require("../services/redisService");
const utils = require("../utils/index");

module.exports = {
  // 发送验证码邮件
  sendCodeMail: async (mail) => {
    const code = utils.getRandomChar(); // 获取验证码
    await redisService.set(mail, code); // 存入redis，默认10天过期
    const mailContent = `
        <!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="description" content="xxxx" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div style="background-color: #ececec; padding: 35px">
      <table
        cellpadding="0"
        align="center"
        style="
          width: 800px;
          margin: 0px auto;
          text-align: left;
          position: relative;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          border-bottom-left-radius: 5px;
          font-size: 14px;
          font-family: 微软雅黑, 黑体;
          line-height: 1.5;
          box-shadow: rgb(153, 153, 153) 0px 0px 5px;
          border-collapse: collapse;
          background-position: initial initial;
          background-repeat: initial initial;
          background: #fff;
        "
      >
        <tbody>
          <tr>
            <th
              valign="middle"
              style="
                height: 25px;
                line-height: 25px;
                padding: 15px 35px;
                border-bottom-width: 1px;
                border-bottom-style: solid;
                border-bottom-color: #42a3d3;
                background-color: #49bcff;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 0px;
                border-bottom-left-radius: 0px;
              "
            >
              <font face="微软雅黑" size="5" style="color: rgb(255, 255, 255)"
                >登录认证🔑Login</font
              >
            </th>
          </tr>
          <tr>
            <td style="word-break: break-all">
              <div style="padding: 25px 35px 40px; background-color: #fff">
                <h2 style="margin: 5px 0px">
                  <font color="#333333" style="line-height: 20px">
                    <font style="line-height: 22px" size="4">
                      Hi👋🏼~欢迎来到我的空间，在这留下属于你的痕迹吧✏️</font
                    >
                  </font>
                </h2>
                <p style="margin-bottom: 0">您的邮箱验证码为：</p>
                <br />
                <h1
                  style="
                    text-align: center;
                    margin-top: 5px;
                    background-color: #ececec;
                    padding: 10px;
                  "
                >
                  ${code}
                </h1>
                <div style="width: 700px; margin: 0 auto">
                  <div
                    style="
                      padding: 10px 10px 0;
                      border-top: 1px solid #ccc;
                      color: #747474;
                      margin-bottom: 20px;
                      line-height: 1.3em;
                      font-size: 12px;
                    "
                  >
                    <p>bokey-space</p>
                    <p>电子邮箱：1930235364@qq.com</p>
                    <p>
                      此为系统邮件，请勿回复<br />
                      Please do not reply to this system email
                    </p>
                    <!--<p>©***</p>-->
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>

        `; // 邮箱模板信息
    const options = {
      from: "bokey-space登录<1930235364@qq.com>", // 发送方
      to: mail, //接收者邮箱，多个邮箱用逗号间隔
      subject: `欢迎登录,你的验证码${code}`, // 标题
      html: mailContent,
    };
    // 发送邮箱
    await transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log("@邮箱发送出现错误@", err);
        return -1;
      }
      console.log("mail sent:", info.response);
      return 200;
    });
  },
};
