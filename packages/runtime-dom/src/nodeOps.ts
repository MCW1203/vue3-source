// 操作节点
/* 
*  增 删 改 查
*
*/

export const nodeOps = {
    // 创建元素 传入标签名  是否是svg  是否是组件    不同的平台操作不同
    // createElement: (tag: string, isSVG?: boolean, is: string | undefined = undefined): Element => {
    //     return document.createElement(tag)
    // }
    createElement:tagName=>document.createElement(tagName),
    // 删除元素
    remove:child=>{
        const parent=child.parentNode
        // 如果存在父元素，删除子元素
        if(parent){
            parent.removeChild(child)
        }
    },
    // 插入节点
    insert:(child,parent,anchor=null)=>{
        parent.insertBefore(child,anchor)
    },
    // 选择元素 第一个
    querySelecter:selector=>document.querySelector(selector),
    // 设置元素文本
    setElementText:(el,text)=>{
        el.textContent=text
    },
    // 创建文本节点
    createText:text=>document.createTextNode(text),
    // 设置节点文本
    setTextNode:(node,text)=>{
        node.nodeValue=text
    },
    // 设置属性
    setElementProp:(el,key,value)=>{
        el[key]=value
    },
    // 删除属性
    removeElementProp:(el,key)=>{
        delete el[key]
    },
}