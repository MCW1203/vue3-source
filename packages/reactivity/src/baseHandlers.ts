import { reactive, readonly } from './reactive'
import { isObject,extend } from '@vue/shared'
import { TrackOpTypes } from './operations'
import { Track } from './effect'

// 两个参数  1：是否只读  :2：是否浅层
function createGetter(isReadonly = false, shallow = false) {
    // target:目标对象  key:属性名  receiver:代理对象
    return function get(target, key, receiver) {
        // 1.获取值
        const res = Reflect.get(target, key, receiver) //相当于 target[key]
        // 如果是只读的，就不需要收集依赖
        if(!isReadonly){
            // 收集依赖
            //收集effect
            Track(target,TrackOpTypes.GET,key)
        } 
        if(shallow){
            return res
        }
        // 如果是对象，就递归代理  懒代理
        if(isObject(res)){
            return isReadonly?readonly(res):reactive(res)
        }
        // 3.返回值
        return res
    }
}

// 是不是深层的
function createSetter(shallow = false) {
    // target:目标对象  key:属性名  value:属性值  receiver:代理对象
    return function set(target, key, value, receiver) {
        // 1.获取值
        const res = Reflect.set(target, key, value, receiver) //相当于 target[key]
        // 2.派发更新
        return res
    }
}
// 获取
const get = /*#__PURE__*/ createGetter()
const shallowGet = /*#__PURE__*/ createGetter(false, true)
const readonlyGet = /*#__PURE__*/ createGetter(true)
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true)

const set = /*#__PURE__*/ createSetter()
const shallowSet = /*#__PURE__*/ createSetter(true)

export const reactiveHandler = {
    get,
    set
}

export const shallowReactiveHandler = {
    get: shallowGet,
    set:shallowSet
    
}
// 合并
let readonlyObj={
    set:(target,key,value)=>{
        console.log('set on key is failed')
    }
}
export const readonlyHandler = extend({
    get: readonlyGet,
},readonlyObj)

export const shallowReadonlyHandler = extend({
    get: shallowReadonlyGet,
},readonlyObj)