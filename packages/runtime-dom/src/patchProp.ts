// 操作属性
/* 
* 策略模式
*
*/
import {patchClass} from './modules/class'
import {patchStyle} from './modules/style'
import {patchAttr} from './modules/attr'
import {patchEvent} from './modules/event'

// nextValue最新的值
export function patchProp(el,key,prevValue,nextValue){
    switch(key){
        case 'class':
            patchClass(el,nextValue)
            break
        case 'style':
            patchStyle(el,prevValue,nextValue)
            break
        default:
            if(/^on[^a-z]/.test(key)){
                // 事件
                patchEvent(el,key,nextValue)
            }else{
                // 自定义属性
                patchAttr(el,key,nextValue)
            }
            break
    }
}