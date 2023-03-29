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
        // 判断是否需要重新计算
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