// 打包 monerepo
// 子进程执行命令
const execa = require('execa');//5.1.1版本
// 2.打包 并行打包
async function build(target) {
  console.log(target, 3333);
  // execa
  // -c 执行rollup配置， -cw 自动检测更改进行打包      环境变量 -environment   {stdio:'inherit'}  打印日志
  await execa("rollup", ["-cw", "--environment", `TARGET:${target}`], {
    stdio: "inherit",
  });
}

// build('reactivity')
build('runtime-dom')
// build('runtime-core')
