# 启动

> pnpm i && pnpm dev

## 整体思路

采用简单架构，store 和 dnd 两个全局变量可优化。store 中管理实际为 timeline 的视图模型，这里做草稿概念进行管理。

- 渲染层： 采用 react-konva ，利用数据驱动，不直接操作node（可优化项）。
- 草稿层：zustand + immer 简单全局数据管理，利用 zustand 中 setState 做Action 操作（可撤销/回退），immer 中 draft 做 mutation 操作（原子粒度修改）。
- 应用层：视图和逻辑分离，纯组件 + 业务逻辑。

目前实现功能：

1. 点击/拖拽新增元素至轨道
2. 拉升/缩小元素宽度
3. 拖拽元素位置，拖拽元素至其他轨/新建轨
4. 元素位置与帧宽度对齐

## TODO

- 元素碰撞检测
- 拖拽时高亮
- 撤销/回退
- 草稿还原/保存
- more functions
