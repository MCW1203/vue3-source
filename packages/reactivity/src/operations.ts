// 操作符
export const enum TrackOpTypes {
    GET,
    HAS,
    ITERATE
}
// 触发类型
export const enum TriggerOpTypes {
    ADD,
    SET,
    DELETE,
    CLEAR
}
// 依赖收集
export interface Dep {
    // 依赖的effect
    readonly id: number;
    // 收集依赖
    track(): void;

    // 派发更新
    trigger(): void;
}
