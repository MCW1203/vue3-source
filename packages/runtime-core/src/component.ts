import { ShapeFlags } from "@vue/shared"
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
        data:{} //组件的数据,兼容vue2
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
        // 无状态的组件没有setup方法
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
    // setup()
    // 处理参数
    let setupContext = createContext(instance)
    setup(instance.props, setupContext)
    // 处理render方法
    Component.render(instance.proxy)

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
    },
    render(proxy){
        console.log(666,proxy.name)
    }
}
createApp(app,{name:'555'}).mount('#app') */