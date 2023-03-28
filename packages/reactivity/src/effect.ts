// 1.在视图中获取数据 触发 get 收集 effect  
// 2.在视图中修改数据 触发 set 派发更新，执行effect

// 1.定义effect
export function effect(fn,options:any={}){
    // 1.创建effect
    const effect = createReactiveEffect(fn,options)
    // 2.判断是否立即执行
    if(!options.lazy){
        effect()
    }
    // 3.返回effect
    return effect
}
let uid=0
// 保存当前的effect
let activeEffect:any
// 定义一个栈结构，保存effect
const effectStacks=[]
// 2.响应式的effect
function createReactiveEffect(fn,options){
    const effect = function reactiveEffect(){
        // 1.判断是否需要执行
        // if(!effect.active){
        //     return options.scheduler?undefined:fn()
        // }
        // 2.执行effect
        if(!effectStacks.includes(effect)){
            try{
                // 入栈
                effectStacks.push(effect)
                activeEffect=effect
                fn()
            }finally{//上面代码执行完毕，执行下面的
                // 出栈
                effectStacks.pop()
                activeEffect=effectStacks[effectStacks.length-1]
            }
        }
    }
    // 区分effect
    effect.id=uid++
    // 区分effect是不是响应式的
    effect._isEffect=true
    // 保存用户的方法
    effect.raw=fn
    // 保存用户的属性
    effect.options=options

    return effect
}


// 3.收集依赖effect
// 在视图中获取数据 触发 get 收集 effect
// 创建表
let targetMap = new WeakMap()
export function Track(target,type,key){
    console.log('activeEffect',target,type,key,activeEffect)
    //  key和effect一一对应    map=>key=target=>属性=>[effect]
    // 判断是否有effect或数据是否被使用
    if(activeEffect===undefined){
        return
    }
    let depsMap = targetMap.get(target)
    // 获取effect
    if(!depsMap){
        // 没有的话添加值
        targetMap.set(target,depsMap=new Map())
    }
    // 有值
    let dep = depsMap.get(key)
    if(!dep){
        // 没有的话添加值
        depsMap.set(key,dep=new Set())
    }
    // 有没有收集effect
    if(!dep.has(activeEffect)){
        dep.add(activeEffect)
    }
    console.log('targetMap',targetMap)
}