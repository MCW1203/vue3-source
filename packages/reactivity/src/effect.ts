// 1.在视图中获取数据 触发 get 收集 effect  
// 2.在视图中修改数据 触发 set 派发更新，执行effect

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
function createReactiveEffect(fn,options){
    // 1.创建effect
    const effect = function reactiveEffect(){
        fn()
        // 1.判断是否需要执行
        // if(!effect.active){
        //     return options.scheduler?undefined:fn()
        // }
        // 2.执行effect
        // try{
        //     // 1.清空上一次的依赖
        //     effectStacks.length=0
        //     // 2.执行effect
        //     return fn()
        // }finally{
        //     // 3.清空effect
        //     effectStacks.length=0
        // }
    }

    return effect
}