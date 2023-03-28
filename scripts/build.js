// 打包 monerepo
// 1.获取打包目录
const fs = require("fs");
// 子进程执行命令
const execa = require('execa');//5.1.1版本
// 只打包目录
const dirs = fs
  .readdirSync("packages")
  .filter((p) => fs.statSync(`packages/${p}`).isDirectory());
// 2.打包 并行打包
async function build(target) {
  console.log(target, 3333);
  // execa
  // -c 执行rollup配置，环境变量 -environment   {stdio:'inherit'}  打印日志
  await execa("rollup", ["-c", "--environment", `TARGET:${target}`], {
    stdio: "inherit",
  });
}
async function runParaller(dirs, itemfn) {
  let result = [];
  for (let item of dirs) {
    result.push(itemfn(item));
  }
  // 存放打包的promise,等待这里打包执行完毕调用成功
  return Promise.all(result);
}
runParaller(dirs, build).then(() => {
  console.log("打包完成");
});

console.log(dirs);
