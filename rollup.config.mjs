import { createRequire } from "node:module";
import ts from "rollup-plugin-typescript2" //解析ts
import json from "@rollup/plugin-json" //解析json
import resolvePlugin from "@rollup/plugin-node-resolve" //解析第三方插件
import path from "path"; //解析路径
import { fileURLToPath } from "node:url";
if (!process.env.TARGET) {
  throw new Error("TARGET package must be specified via --environment flag.");
}
const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
// 2.获取文件路径
const packagesDir = path.resolve(__dirname, "packages");
// 2.1.获取打包目录
const packageDir = path.resolve(packagesDir, process.env.TARGET);
// 2.2.获取打包目录下的package.json
const resolve = (p) => path.resolve(packageDir, p);
// 获取json文件
const pkg = require(resolve(`package.json`));
const packageOptions = pkg.buildOptions || {};
const name = packageOptions.filename || path.basename(packageDir);
// 3.创建一个映射表
const outputConfigs = {
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: "iife",
  },
  "cjs": {
    file: resolve(`dist/${name}.cjs.js`),
    format: "cjs",
  },
  "esm-bundler": {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: "es",
  },
  
};
// 4.获取打包的格式
const options=pkg.buildOptions
function createConfig(format,output){
  // 进行打包
  output.name=packageOptions.name
  // 调试代码
  output.sourcemap=true
  // 生成rollup配置
  const config={
    input:resolve(`src/index.ts`),
    output,
    plugins:[
      ts({
        tsconfig:path.resolve(__dirname,"tsconfig.json")
      }),
      json(),
      resolvePlugin()
    ]
  }
  return config

}
console.log(pkg, 2222222222222222222222);
// rullup需要导出一个配置
export default options.formats.map(format=>createConfig(format,outputConfigs[format]))



