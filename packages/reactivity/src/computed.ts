// computed

import { isFunction } from "@vue/shared"
import { effect } from "./effect"

/* 
* 1. computed不使用不会执行里面的方法
* 2. 具有缓存机制，计算的数据没有改变，不会重新计算
* 3. 计算的数据改变时，如果computed中的数据没有使用，也不会重新计算
*/
export function computed(getterOrOptions) {
    // 1.函数 2.对象
    // 1.处理函数
    let getter //获取
    let setter //设置
    if (isFunction(getterOrOptions)) {
        // 如果传过来的是个函数，不能设置值
        getter = getterOrOptions
        setter = () => {
            console.warn('computed value must be readonly')
        }
    }else{  
        // 处理对象{get(),set{}}
        // options: {
        //     get: () => T
        //     set: (value: T) => void
        //   },
        getter = getterOrOptions.get
        setter = getterOrOptions.set
    }
    // 返回值
    return new ComputedRefImpl(getter,setter)

}

class ComputedRefImpl {
    // 定义属性
    public _dirty = true //默认获取执行，判断是否需要重新计算
    public _value //缓存值
    public effect
    constructor(public getter,public setter){
        // 收集effect 默认不执行
        console.log('getter',getter)
        this.effect=effect(getter,{
            lazy:true,
            sch:()=>{
                if(!this._dirty){
                    // 修改数据时执行
                    this._dirty=true
                }
            }
        })
    }

    // 获取值
    get value(){
        // 判断是否需要重新计算 根据标识和缓存判断
        if(this._dirty){
            // 获取用户的值
            this._value=this.effect()
            console.log('this._value',this.effect())
            this._dirty=false
        }
        return this._value
    }
    // 设置值
    // 调用一下传过来的set: (value: T) => void方法
    set value(newValue){
        this.setter(newValue)
    }
}
/** 
* Vue中的计算属性computed是具有缓存机制的，其原理是基于响应式依赖收集和缓存策略。
* 
* 1.在计算属性被访问时，Vue会先检查该计算属性是否有缓存结果，如果有，则直接返回缓存结果，
* 否则会执行计算属性的计算函数，获取计算结果并缓存起来，同时将计算结果返回给调用方。
* 
* 2.当计算属性所依赖的响应式数据发生变化时，Vue会触发effect中的sch，更改标记，重新计算该计算属性的值，并将新的值缓存起来。
* 在下一次访问该计算属性时，如果依赖的数据没有发生变化，则直接返回缓存结果。
* 
* 3.Vue是通过收集计算属性所依赖的响应式数据来实现缓存机制的。在计算属性的计算函数中，当访问到响应式数据时，
* Vue会将该计算属性和响应式数据之间建立依赖关系。当响应式数据发生变化时，Vue会通知依赖该数据的计算属性进行重新计算。
* 
* 4.通过这种方式，Vue实现了计算属性的缓存机制，可以避免不必要的计算和渲染，提高应用的性能。
*
**/