import { haseChange } from "@vue/shared"
import { Track, trigger } from "./effect"
import {TrackOpTypes,TriggerOpTypes} from './operations'


export function ref(target){
    return createRef(target)
}

export function shallowRef(target){
    return createRef(target,true)
}

// 创建类
class RefImpl{
    // 属性
    public __v_isRef=true
    public _value
    constructor(public rawValue,public shallow){
        this._value=rawValue //用户传过来的值 旧值
    }

    // 类的属性访问器
    get value(){
        // 收集依赖
        Track(this,TrackOpTypes.GET,'value')
        return this._value
    }
    // 修改值
    set value(newValue){
        // 判断新值和旧值是否相等
        if(haseChange(newValue,this._value)){
            this._value=newValue
            this.rawValue=newValue
            trigger(this,TriggerOpTypes.SET,'value',newValue)
        }
         
    }

}


function createRef(rawValue,shallow=false){
    return new RefImpl(rawValue,shallow)
}

export function toRef(target,key){
    return new ObjectRefImpl(target,key)
}

class ObjectRefImpl{

    public __v_isRef=true
    constructor(public target,public key){

    }

    // 类的属性访问器
    get value(){
        // 收集依赖
        Track(this.target,TrackOpTypes.GET,this.key)
        return this.target[this.key]
    }
    // 修改值
    set value(newValue){
        this.target[this.key]=newValue
        // 判断新值和旧值是否相等
        // if(haseChange(newValue,this.target[this.key])){
        //     this.target[this.key]=newValue
        //     trigger(this.target,TriggerOpTypes.SET,this.key,newValue)
        // }
         
    }

}