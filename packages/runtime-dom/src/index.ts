// runtime-dom
/* 
* 操作dom  
* 1.节点 nodeOps.ts
* 2.属性 patchProp.ts
*/
import {extend} from '@vue/shared'

// 创建两个文件
import {nodeOps} from './nodeOps'
import {patchProp} from './patchProp'

// vue3 dom全部操作
const rendererOptions=extend({patchProp},nodeOps)

export {
    rendererOptions
}