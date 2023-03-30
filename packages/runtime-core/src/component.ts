import { ShapeFlags, isFunction, isObject } from "@vue/shared"
import { componentPublicInstance } from "./componentPublicInstance"

/**
* 创建组件实例对象
**/
export const createComponentInstance = (vnode) => {
    // 就是一个对象
    const instance = {
        vnode,
        type: vnode.type, //组件的类型
        props: {},  //组建的属性
        attrs: {},  //组件所有的属性
        setupState: {}, //组件的状态  setup返回的结果
        ctx: {}, //组件的上下文，处理代理
        proxy: {}, //代理
        isMounted: false, //是否挂载
        data: {}, //组件的数据,兼容vue2
        render: '', //组件的render方法
    }
    instance.ctx = { _: instance }
    return instance
}

/**
* 解析数据到组件实例
**/
export const setupComponent = (instance) => {
    // 设置值
    const { props, children } = instance.vnode
    // 根据props解析到组件实例上
    instance.props = props
    instance.children = children //slots 插槽
    // 看一下组件有没有setup方法
    let isStateFul = instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
    if (isStateFul) { //有状态的组件有setup方法
        setupStatefulComponent(instance)
    } else {
        // 无状态的组件 没有setup方法
    }

}
// 处理有状态的组件setup()
function setupStatefulComponent(instance) {
    // 代理
    instance.proxy = new Proxy(instance.ctx, componentPublicInstance as any)
    // setup返回值 是render函数的参数
    // 获取组件的类型拿到setup方法 参数(props,context)  返回值：对象，函数
    let Component = instance.vnode.type
    let { setup } = Component
    // 看setup和render是否存在
    if (setup) {
        // setup()
        // 处理参数
        let setupContext = createContext(instance)
        let setupResult = setup(instance.props, setupContext)
        // setup返回值是对象{}或者函数（h()）
        // 分别处理 如果是对象就是值，将对象的属性全部放到setupState上，如果是函数就将函数放到render上
        hanslerSetupResult(instance, setupResult)
    } else {
        // 没有setup方法，执行render方法
        finishComponentSetup(instance)
    }
    // 处理render方法
    Component.render(instance.proxy)

}
// 处理setup返回值
function hanslerSetupResult(instance, setupResult) {
    if (isFunction(setupResult)) {
        instance.render = setupResult  //setup返回值是函数setup{return ()=>{}},保存到render上
    } else if (isObject(setupResult)) {
        instance.setupState = setupResult //setup返回值是对象setup{return{}},保存到setupState上
    }
    // 走render方法
    finishComponentSetup(instance)
}
// 处理render方法
function finishComponentSetup(instance) {
    // 拿到render方法，先判断组件中有没有render()方法
    let Component = instance.vnode.type
    if (!instance.render) {
        if (Component.render) {
            instance.render = Component.render
        } else if (Component.template) {
            // 没有render但是有templete 进行模板编译
        }
    }
    console.log(999999,instance.render)
    // 处理effect
    setupRenderEffect(instance, instance.vnode.el)
}
// 处理content
function createContext(instance) {
    return {
        sttrs: instance.attrs,
        slots: instance.slots,
        emit: () => { },
        expose: () => { }
    }
}

/** 
* 创建一个effect方法 让render方法执行
**/
export const setupRenderEffect = (instance, container) => {

}




/* let app={
    data(){
        return{
            a:1
        }
    },
    setup(props,context) {
        console.log('setup',props,context)
        return{
            b:2
        }
        // return ()=>{}
    },
    render(proxy){
        console.log(666,proxy.name)
    }
}
createApp(app,{name:'555'}).mount('#app') */