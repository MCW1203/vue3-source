
/* 
*渲染器
*
*
*
*/
import { ShapeFlags } from '@vue/shared'
import { apiCreateApp } from './apiCreateApp'
import { createComponentInstance, setupComponent } from './component'
import { effect } from '@vue/reactivity'
import { CVnode, TEXT } from './vnode'

// rendererOptions 操作节点和属性的方法
export function createRenderer(rendererOptions) {
    // 获取全部dom操作方法
    const {
        insert: hostInsert,// 插入节点
        remove: hostRemove,// 删除节点
        patchProp: hostPatchProp,// 属性操作
        createElement: hostCreateElement, // 创建元素
        createText: hostCreateText,// 创建文本
        createComment: hostCreateComment,// 创建注释
        setText: hostSetText,// 设置文本
        setElementText: hostSetElementText,// 设置元素文本
    } = rendererOptions
    // 创建一个effect方法 让render方法执行
    function setupRenderEffect(instance, container) {
        // 创建一个effect 在effect中调用render方法 ，这样render中获取数据会收集effect
        // 当属性发生变化时，会重新执行effect方法，重新执行render方法
        effect(function componentEffect() {
            // 判断是否是第一次记载组件
            if (!instance.isMounted) {
                // 获取到render返回值
                // 组件实例 被代理过的
                let proxy = instance.proxy
                //执行render  组件中创建渲染的节点 h函数有多种写法
                /**
                *  h('div',{},'hello')  
                *  h('div','hello')  
                *  h('div',{}) or h('div',{},['list']) 
                *  h('div',{},[h('div',{},'list')]) 
                * */
                //  1.h函数是创建一个虚拟dom 组件渲染的节点
                let subTree = instance.subTree = instance.render.call(proxy, proxy)
                //  2.渲染到页面中
                // console.log('subTree',subTree)
                // 渲染子树 递归 创建元素
                patch(null, subTree, container)
                // 首次加载完成后，更改状态
                instance.isMounted = true
            } else {
                // 组件更新
                // console.log('组件更新')
                // 比对，将旧的和新的进行比对
                // 获取实例
                let proxy = instance.proxy
                // 1.获取到旧的虚拟dom
                const prevTree = instance.subTree
                // 2.获取到新的虚拟dom
                const nextTree = instance.render.call(proxy, proxy)
                // 3.比对
                instance.subTree = nextTree //替换
                patch(prevTree, nextTree, container)
            }
        })
    }
    // 处理组件
    //*******************   处理组件   ******************************* */
    const mountComponent = (InitialVnode, container) => {
        // 组件的渲染流程 核心 
        // 1.创建组件实例对象 render(proxy)
        const instance = InitialVnode.component = createComponentInstance(InitialVnode)
        // 2.解析数据到实例上
        setupComponent(instance)
        // 3.创建一个effect方法 让render方法执行
        setupRenderEffect(instance, container)
    }
    // 组建的创建
    const processComponent = (oldVnode, newVnode, container) => {
        // 判断是否是第一次创建
        if (oldVnode == null) {
            //组件的初始化
            mountComponent(newVnode, container)
        } else {
            // 组件更新
        }
    }
    // 处理文本
    //**************************    处理文本   ************************ */
    const processText = (oldVnode, newVnode, container) => {
        if (oldVnode == null) {  //第一次创建
            // 创建文本元素并插入到对应位置
            hostInsert((newVnode.el = hostCreateText(newVnode.children)), container)
        } else {
            // 文本更新
        }
    }
    // 处理元素
    //**************************    处理元素   ************************ */
    // 处理子元素children
    const mountChildren = (children, el) => {
        console.log(103, children, el)
        // 递归渲染
        for (let i = 0; i < children?.length; i++) {
            let child = CVnode(children[i])
            // 创建文本 元素   
            patch(null, child, el)
        }
    }
    // 加载元素
    const mountElement = (vnode, container, ancher = null) => {
        // 创建真实dom h('div',{},[h('div',{},'list')]) ==>dom操作===》放到页面
        // 递归渲染
        // 获取元素的属性
        const { props, shapeFlag, type, children } = vnode
        console.log(117, children)
        // 获取真实的元素 dom节点
        // 创建元素
        let el = vnode.el = hostCreateElement(type)
        // 添加属性
        for (let key in props) {
            hostPatchProp(el, key, null, props[key])
        }
        //创建元素-添加属性===> h('div',{style:{color:'red'}},'hello')==><div style='color:red'></div>
        // 处理子元素 children
        if (children) {
            if (shapeFlag & ShapeFlags.TEXT_CHILDREN) { //文本
                // 创建文本元素
                console.log(130)
                hostSetElementText(el, children)
            } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {  //children是数组
                // 递归  数组   h('div',{style:{color:'red'}},['hello',222])
                console.log(134, children, el)
                mountChildren(children, el)
            }
        }
        //创建元素-添加属性-处理子元素===> h('div',{style:{color:'red'}},'hello')==><div style='color:red'>hello</div>
        // console.log('mountElement', el)

        // 放到对应的位置
        hostInsert(el, container)
    }
    // 处理属性 属性（props）比对
    const patchProps = (oldProps, newProps, el) => {
        //  旧：<div class style 属性></div>  新：<div class style></div>
        // 循环遍历
        if (oldProps !== newProps) {
            for (let key in newProps) {
                if (oldProps[key] !== newProps[key]) {
                    // 旧属性与新属性不相同 替换属性
                    hostPatchProp(el, key, oldProps[key], newProps[key])
                }
            }
            for (let key in oldProps) {
                if (!newProps[key]) {
                    // 旧的属性，新的没有，则删除属性
                    hostPatchProp(el, key, null, newProps[key])
                }
            }
        }
        //  旧：<div class style></div>       新：<div class style 属性></div>


    }
    // 比对children
    const patchChildren = (oldProps, newProps, el) => {
        console.log(166, oldProps, newProps, el)
        // 获取到两个元素的children的值
        let c1 = oldProps.children
        let c2 = newProps.children
        // 儿子 4种情况
        /**
        * 1.children都是文本
        * 2.新的有children，旧的没有
        * 3.旧的有children 新的没有
        * 4.都有children，但是children都是数组  
        * */
        // 
        const oldShapeFlage = oldProps.shapeFlag  //旧的标识
        const newShapeFlage = newProps.shapeFlag  //新的标识
        if (newShapeFlage & ShapeFlags.TEXT_CHILDREN) {  //1.children都是文本 旧：<div class style>张三</div>  新：<div class style>李四</div>
            hostSetElementText(el, c2) //替换文本节点
            console.log(179)
        } else {//不是文本 数组
            console.log(181, c2)
            if (oldShapeFlage & ShapeFlags.ARRAY_CHILDREN) { //旧的是数组
                //都有children，而且children是数组
                patchKeyedChildren(c1, c2, el)
            } else { //旧的是文本
                // 将旧的文本删除
                hostSetElementText(el, '')
                // 添加新的children（数组）
                console.log(191, c2)
                mountChildren(c2, el)
            }
        }

    }
    /************************************************************************************************ 
                                        diff算法核心
    *************************************************************************************************/
    //都有children，而且children是数组
    const patchKeyedChildren = (oldChildren, newChildren, el) => {
        console.log(954321)
        //vue2:双指针  vue3:先从头部比对，找出不同的跳出循环，再从尾部比对
        let i = 0
        let e1 = oldChildren.length
        let e2 = newChildren.length
        // sync from start :头部比对      
        // 1.同一位置比对（两个元素不同 停止） 2.哪个数组没有 停止
        // 旧的：<div><p></p></div>  新的：<div><p></p></div>
        while (i <= el && i <= e2) {
            const n1 = oldChildren[i]  //拿到节点中的数组 就是上面的<div></div>中的<p></p>
            const n2 = newChildren[i]
            if (isSomeVnode(n1, n2)) { //如果节点相同，递归
                patch(n1, n2, el)
            } else {  //如果节点不相同 停止while
                break
            }
            i++ //比对的位置
        }
        // sync from end :尾部比对 
        while (i <= el && i <= e2) {
            const n1 = oldChildren[e1]  //拿到节点中的数组 从尾部比对 就是上面的<div></div>中的<p></p>
            const n2 = newChildren[e2]
            if (isSomeVnode(n1, n2)) { //如果节点相同，递归
                patch(n1, n2, el)
            } else {  //如果节点不相同 停止while
                break
            }
            e1--
            e2--
        }
        console.log(232, i, e1, e2)
        // 更新数据 根据i e1 e2 
        //1.旧的数据少，新的数据多 2.旧的数据多，新的数据多
        if (i > e1) {   //旧的数据少，新的数据多
            // 添加数据 ：头部添加或者尾部添加
            const nextProps = e2 + 1  //插入的位置
            // 如果是前追加 nextProps < e2
            // 要追加元素的标记点
            const ancher = nextProps < newChildren.length ? newChildren[nextProps].el : null
            while (i < e2) {
                patch(null, newChildren[i++], el, ancher)
            }

        } else if (i < e1) {  //旧的数据多，新的数据少
            // 删除多余的数据
            unmont(oldChildren[i++])
        } else {
            // 乱序的情况
            /* 解决思路
              1.以新的乱序的个数创建一个映射表
              2.再用旧的乱序的数据去新的表中找，如果有就复用，没有就删除
            */
            let s1 = i
            let s2 = i
            // 解决乱序比对的问题  1.新添加的数据在旧的中没有的，没有创建出来 2.位置不对
            const toBePatched = e2 - s2 + 1  //乱序的个数
            // 创建数组
            const newIndexToPatchMap = new Array(toBePatched).fill(0)
            // 创建表
            let keyIndexMap = new Map()
            // 用新的乱序的数据创建表
            for (let i = s2; i < e2; i++) {
                const childVnode = newChildren[i] //新的乱序的虚拟dom
                keyIndexMap.set(childVnode.key, i)
            }
            // 用老的乱序的数据创建表
            for (let i = s1; i < e1; i++) {
                const oldChildVnode = oldChildren[i] //旧的乱序的虚拟dom
                let newIndex = keyIndexMap.get(oldChildVnode.key)
                if (newIndex == undefined) { //旧的数据在新的表中没有 删除
                    unmont(oldChildVnode)
                } else {  //旧的数据在新的表中有
                    // 问题 1.新添加的数据在旧的中没有的，没有创建出来 2.位置不对
                    // 旧的和新的关系 索引的关系
                    newIndexToPatchMap[newIndex - s2] = i + 1  //新的数据在老的数据中索引的位置
                    // 比对
                    patch(oldChildVnode, newChildren[newIndex], el)
                }
            }
            // 移动节点 添加新增的元素   方法：倒叙循环
            for (let i = toBePatched - 1; i >= 0; i--) {
                let currentIndex = i + s2  //新增h元素的索引
                let child=newChildren[currentIndex]
                // 添加位置
                let ancher = currentIndex + 1 < newChildren.length ? newChildren[currentIndex+1].el : null
                if(newIndexToPatchMap[i]===0){  // 第一次插入h()后
                    patch(null,child,el,ancher)
                }else{
                    // 这个操作将需要的全部插入进去
                    hostInsert(child.el,el,ancher)
                }
            }
        }

    }
    // 同一个元素比对
    const patchElement = (oldVnode, newVnode, container, ancher = null) => {
        // <div class style 属性></div>  <div class style></div>
        const el = (newVnode.el = oldVnode.el)
        const oldProps = oldVnode.props || {}
        const newProps = newVnode.props || {}
        // 比对属性
        console.log(77777)
        patchProps(oldProps, newProps, el)
        // 比对children
        patchChildren(oldProps, newProps, el)
    }
    // 加载组件
    const processElement = (oldVnode, newVnode, container, ancher = null) => {
        if (oldVnode == null) {  //第一次创建
            console.log('重新加载')
            mountElement(newVnode, container, ancher)
        } else {
            // 同一个元素
            console.log('同一个元素')
            patchElement(oldVnode, newVnode, container, ancher)
        }
    }
    // 判断是不是同一个元素 1.标签名 2.key
    const isSomeVnode = (oldVnode, newVnode) => {
        return oldVnode.type === newVnode.type && oldVnode.key === newVnode.key
    }
    // 卸载旧的节点
    const unmont = (oldVnode) => {
        hostRemove(oldVnode.el)
    }
    // oldVnode:旧节点  newVnode:新节点  container:容器
    const patch = (oldVnode, newVnode, container, ancher = null) => {
        // 针对不同的类型进行渲染
        // 比对 1：判断是不是同一个元素
        if (oldVnode && !isSomeVnode(oldVnode, newVnode)) {
            unmont(oldVnode)  //删除元素
            oldVnode = null   //重新加载
        }
        let { shapeFlag, type } = newVnode
        switch (type) {
            case TEXT:
                // 处理文本
                processText(oldVnode, newVnode, container)
                break
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) { //元素
                    console.log('元素', oldVnode, newVnode, container)
                    // 加载组件
                    processElement(oldVnode, newVnode, container, ancher)
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) { //组件
                    processComponent(oldVnode, newVnode, container)
                }
        }

    }
    // 渲染器
    let render = (vnode, container) => {
        // 组件初始化
        console.log('vnode', vnode)
        // 调用render方法,将vnode转换成真实dom
        // 第一次渲染时  null:原来的dom  vnode:新的dom  container:容器
        patch(null, vnode, container)

    }
    return {
        createApp: apiCreateApp(render) //vnode 在框架中 组件操作==》vnode==>render()
    }
}

/**
* setup 返回值处理
* 1.返回函数setup{return ()=>{}}，将函数放到render上，执行render方法
* 2.返回对象setup{return {}}，将函数放到render上
*
*
**/

/** 
* Vue3中的虚拟DOM算法是通过Diff算法实现的。Vue3中的Diff算法流程大致如下：
* 
* 一.将模板编译成渲染函数，并将渲染函数的返回值作为旧的虚拟DOM树，保存在组件实例中。
* 
* 二.当组件状态发生改变时，调用渲染函数生成新的虚拟DOM树。
* 
* 三.将新旧虚拟DOM树进行比较，找出差异。
* 
* 四.根据差异类型执行相应的DOM操作。
* 
* 具体来说，Vue3的Diff算法主要包括以下步骤：
* 
* 1.标记每个节点的唯一标识符，以便快速找到需要更新的节点。
* 
* 2.从旧的虚拟DOM树的根节点开始遍历，依次比较每个节点和其对应的新虚拟DOM树节点。
* 
* 3.如果节点类型不同，直接替换节点。
* 
* 4.如果节点类型相同，比较节点属性，如果有差异，更新节点属性。
* 
* 5.对比子节点列表，移除旧节点多余的子节点，插入新节点缺少的子节点，更新相同位置的子节点。
* 
* 6.在比较过程中，使用“双端队列”算法进行优化，可以减少比较次数，提高性能。
* 
* 7.最后，执行副作用函数，更新DOM。
* 
* 总之，Vue3的Diff算法主要是将旧的虚拟DOM树和新的虚拟DOM树进行比较，找出差异，并执行相应的DOM操作。
  同时，Vue3还针对Diff算法进行了一些优化，使其更加高效和可靠。
**/