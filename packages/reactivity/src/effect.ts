// 1.在视图中获取数据 触发 get 收集 effect  
// 2.在视图中修改数据 触发 set 派发更新，执行effect

import { isArray, isIntegerKey } from "@vue/shared"
import { TriggerOpTypes } from "./operations"

// 1.定义effect
export function effect(fn, options: any = {}) {
    // console.log(333333333)
    // 1.创建effect
    const effect = createReactiveEffect(fn, options)
    // 2.判断是否立即执行
    if (!options.lazy) {
        effect()
    }
    // 3.返回effect
    return effect
}
let uid = 0
// 保存当前的effect
let activeEffect: any
// 定义一个栈结构，保存effect
const effectStacks = []
// 2.响应式的effect
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        // 1.判断是否需要执行
        // if(!effect.active){
        //     return options.scheduler?undefined:fn()
        // }
        // 2.执行effect
        if (!effectStacks.includes(effect)) {
            try {
                // 入栈
                effectStacks.push(effect)
                activeEffect = effect
                fn()
            } finally {//上面代码执行完毕，执行下面的
                // 出栈
                effectStacks.pop()
                activeEffect = effectStacks[effectStacks.length - 1]
            }
        }
        // console.log('执行effect')
    }
    // 区分effect
    effect.id = uid++
    // 区分effect是不是响应式的
    effect._isEffect = true
    // 保存用户的方法
    effect.raw = fn
    // 保存用户的属性
    effect.options = options

    return effect
}


// 3.收集依赖effect
// 在视图中获取数据 触发 get 收集 effect
// 创建表
let targetMap = new WeakMap()
export function Track(target, type, key) {
    // console.log('activeEffect',target,type,key,activeEffect)
    //  key和effect一一对应    map=>key=target=>属性=>[effect]
    // 判断是否有effect或数据是否被使用
    if (activeEffect === undefined) {
        return
    }
    let depsMap = targetMap.get(target)
    // 获取effect
    if (!depsMap) {
        // 没有的话添加值
        targetMap.set(target, depsMap = new Map())
    }
    // 有值
    let dep = depsMap.get(key)
    if (!dep) {
        // 没有的话添加值
        depsMap.set(key, dep = new Set())
    }
    // 有没有收集effect
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
    }
    // console.log('targetMap',targetMap)
}


// 4.触发更新
export function trigger(target, type, key?, newValue?, oldValue?) {
    // console.log(33333333,target,type,key,newValue,oldValue)
    // 触发依赖
    // console.log('targetMap-----》trigger',target, targetMap)
    // console.log(66666,key,newValue,targetMap)

    // 判断有没有目标对象
    const depsMap = targetMap.get(target)
    if (!depsMap) {
        return
    }
    // 执行effect
    // let effects = depsMap.get(key)  //set[]
    let effects = new Set()//如果有多个同时修改一个值，并且这个值是相同的，set可以去重,防止多次执行
    const add = (effectAdd) => {
        if (effectAdd) {
            effectAdd.forEach(effect => effects.add(effect))
        }
    }
    add(depsMap.get(key)) //获取当前属性的effect
    // 处理数组 就是key===length
    if (key === 'length' && isArray(target)) {
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key >= newValue) {
                add(dep)
            }
        })
    } else {
        // 可能是对象
        if (key != undefined) {
            add(depsMap.get(key))
        }
        // console.log('targetMap-----', type, key, newValue, oldValue)
        // 数组通过索引修改
        switch (type) {
            case TriggerOpTypes.ADD:
                if (isArray(target) && isIntegerKey(key)) {
                    add(depsMap.get('length'))
                }
                break
        }
    }
    // console.log('effects',effects)
    // 执行
    effects.forEach((effect: any) => {
        if(effect.options.sch){
            effect.options.sch(effect)
        }else{
            effect()
        }
    })
}