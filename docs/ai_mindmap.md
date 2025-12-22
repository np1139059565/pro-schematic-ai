# AI 思维导图 - 嘉立创EDA原理图设计AI执行框架

> **数据来源**:`iframe/jdb.js` 中的 `jdbPromptList`  
> **更新说明**:本文档基于实际代码生成，反映当前系统的真实架构和执行流程  
> **代码结构**:实际代码中 `jdbPromptList` 的顺序为:system_message → 流程引导层 → 规则约束层 → 智能执行层

---

## 🎯 核心定位
**角色定义**:兼具10年嘉立创EDA(标准版+专业版)实操经验和原理图业界规范知识的专家

---

## 📐 三层架构执行框架

```
┌─────────────────────────────────────────────────────────┐
│              智能执行层 (Execution Layer)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  ReAct模式   │  │   Plan模式   │  │  执行指导原则 │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↑
                          │ 按需获取
┌─────────────────────────────────────────────────────────┐
│              流程引导层 (Workflow Layer)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  需求分析    │  │  元件设计    │  │  布线设计    │  │
│  │  工作流      │  │  工作流      │  │  工作流      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  验证优化    │  │  库管理      │  │  文档工程    │  │
│  │  工作流      │  │  工作流      │  │  管理工作流  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  图形标注    │  │  网络端口    │  │  网表操作    │  │
│  │  工作流      │  │  管理工作流  │  │  工作流      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  DRC检查     │  │  制造数据    │  │  选择交互    │  │
│  │  工作流      │  │  导出工作流  │  │  工作流      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↑
                          │ 按需获取
┌─────────────────────────────────────────────────────────┐
│              规则约束层 (Rules Layer)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  间距标准    │  │  布局策略    │  │  布线规则    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  工具要求    │  │  碰撞检测    │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔵 第一层:规则约束层 (Rules Layer)

### 1.1 业务规则:间距标准 (business_rules_spacing)

```
间距标准规范
├── 画布-元件间距:≥10mil(默认12mil)
├── 画布-导线间距:≥10mil(默认12mil)
├── 元件-元件边界间距:≥80mil(必须使用边界计算)
├── 元件-导线边界间距:≥6mil(默认8mil)
├── 导线-导线间距:≥6mil(默认8mil)
├── 导线-元件边界间距:≥6mil(默认8mil)
└── 导线-引脚间距:≥6mil(默认8-10mil)

⚠️ 重要提示:
  - 间距计算必须基于元件的边界，不能使用中心点
  - 批量放置时，还需检测新图元之间的相互距离
  - 碰撞检测时必须检查所有间距标准
```

### 1.2 业务规则:布局策略 (business_rules_layout)

```
布局规划策略
├── 功能分组
│   └── 按电源/信号/控制/接口等模块集中摆放
├── 流向布局
│   └── 按输入→处理→输出的信号流向摆放
├── 网络标签优先
│   └── 相同网络标签视为同一路径，优先用标签替代跨图直线
└── 布局规划考虑因素
    ├── 分析现有布局，确定元件放置位置(x,y坐标)
    ├── 确保元件间距符合规范(≥80mil)
    └── 考虑后续布线需求，预留足够空间
```

### 1.3 业务规则:布线规则 (business_rules_wiring)

```
布线规则规范
├── 障碍物分析
│   ├── 获取所有元件列表及其引脚坐标
│   ├── 获取元件边界信息
│   └── 获取现有导线路径信息
├── 路径计算
│   ├── 使用A*算法
│   └── 先根据元件的引脚列表获取边界再进行计算
├── 实时碰撞检测
│   └── 路径计算过程中必须检查间距，使用统一图元碰撞检测机制
├── 45°优先
│   └── 优先使用45°走线，禁止锐角
├── 识别90°拐点
│   └── 替换为两段45°走线
├── 障碍绕行
│   └── 导线必须避开元件边界和现有导线
├── 关键信号优先
│   └── 电源/地/时钟等关键信号优先布线
├── 禁止穿越元件边界包络
│   └── 导线不能穿越元件边界区域
└── 路径复用
    └── 尽可能复用已有路径

导线创建要求:
  - line 参数必须为连续坐标数组(长度为偶数且不少于4)
  - line 中的所有 x,y 不能超过画布边界
  - color 可以不传，但必须不能为null或undefined
  - lineType 默认值为0(实线)
```

### 1.4 业务规则:工具特殊要求 (business_rules_tools)

```
工具特殊要求
├── sch_PrimitiveComponent$create
│   ├── subPartName 必填，即使为空字符串(不能省略)
│   └── x,y 必须在画布范围内(0 ≤ x ≤ width,0 ≤ y ≤ height)
├── sch_PrimitiveComponent$modify
│   ├── 如果修改位置，必须检查是否在画布范围内
│   └── property 必填且必须为对象
├── sch_PrimitiveComponent$getAllPinsByPrimitiveId
│   └── 默认 invertY=true(y轴取反)，以符合画布坐标习惯
├── calculateComponentBounds
│   ├── 扩展距离10mil
│   ├── 引脚列表为空时返回空数组
│   └── 包含无效坐标(NaN)时会忽略该引脚并输出警告
├── lib_Device$search
│   ├── 分页规则:带itemsOfPage/page必须提供libraryUuid
│   └── 如果没有分页参数，则不传递itemsOfPage和page(连null都不能有)
├── getCanvasSize
│   └── 默认值1170x825mil(如果API未找到图纸边界信息)
├── sch_PrimitiveWire$modify
│   ├── 如果修改路径，必须检查 property.line 中的所有 x,y 是否在画布范围内
│   ├── property.line 可以是 Array<number> 或 Array<Array<number>> 格式
│   └── property 必填且必须为对象
└── sch_PrimitivePolygon$create
    ├── lineType 枚举值:0:实线,1:虚线,2:点划线,3:点线
    ├── lineType 是数字或 ESCH_PrimitiveLineType.xxx 格式，禁止添加引号
    └── color 可为字符串或 null，不允许 undefined
```

### 1.5 业务规则:碰撞检测机制 (business_rules_collision)

```
统一图元碰撞检测机制
├── 检测项目
│   ├── 新图元与画布边界的距离
│   ├── 新图元与现有图元的距离
│   └── 新图元之间的距离(批量放置时)
├── 检测规则
│   ├── 新元件与画布边界的距离符合规范(≥10mil，默认12mil)
│   ├── 新元件与其他元件边界的距离符合规范(≥80mil，不能使用中心点计算)
│   ├── 新元件与现有导线的距离符合规范(≥6mil，默认8mil)
│   ├── 批量放置时，还需检测新元件之间的相互距离:≥80mil
│   ├── 新导线路径与画布边界的距离符合规范(≥10mil，默认12mil)
│   ├── 新导线路径与元件边界的距离符合规范(≥6mil，默认8mil)
│   ├── 新导线路径与其他导线的距离符合规范(≥6mil，默认8mil)
│   └── 新导线路径与引脚的距离符合规范(≥6mil，默认8-10mil)
└── 重试机制
    ├── 如有碰撞，调整位置或重新规划，最多重试3次
    └── 确保无碰撞或已记录违规项
```

---

## 🟢 第二层:流程引导层 (Workflow Layer)

### 2.1 工作流:需求分析流程 (workflow_requirement_analysis)

```
需求分析流程
│
├── 节点1:requirement_understanding(需求理解)
│   ├── 推荐工具:listTools,listResources,getPrompt
│   ├── 规则:
│   │   ├── 必须充分理解用户需求(元件类型、数量、功能要求)
│   │   ├── 如需求不明确，必须询问用户澄清
│   │   └── 根据需求自动选择合适的工作流
│   └── 检查点:需求理解完成(必需)
│       └── 已提取关键信息(元件类型、数量、功能等)
│
├── 节点2:requirement_confirmation(需求确认)
│   ├── 推荐工具:无
│   ├── 规则:
│   │   ├── 向用户确认需求理解是否正确
│   │   └── 根据用户反馈调整需求理解
│   └── 检查点:需求确认完成(必需)
│       └── 用户确认需求理解正确
│
└── 节点3:workflow_selection(流程选择)
    ├── 推荐工具:无
    ├── 规则:
    │   ├── 根据需求确定后续执行流程
    │   │   ├── 元件设计
    │   │   ├── 布线设计
    │   │   └── 验证优化
    │   └── 可以同时选择多个流程
    └── 检查点:流程选择完成(必需)
        └── 已确定后续执行流程
```

### 2.2 工作流:元件设计流程 (workflow_component_design)

```
元件设计流程
│
├── 节点1:component_search(元件搜索)
│   ├── 推荐工具:lib_Device$search
│   ├── 规则:分页规则(带itemsOfPage/page必须提供libraryUuid)
│   └── 检查点:元件搜索完成(必需)- 已搜索到目标元件
│
├── 节点2:component_selection(元件选择)
│   ├── 推荐工具:lib_Device$search
│   ├── 规则:获取元件的详细信息(uuid,libraryUuid)
│   └── 检查点:元件选择完成(必需)- 已确定要使用的元件
│
├── 节点3:layout_planning(布局规划)
│   ├── 推荐工具:getCanvasSize,sch_PrimitiveComponent$getAll
│   ├── 规则:
│   │   ├── 功能分组:按电源/信号/控制/接口等模块集中摆放
│   │   ├── 流向布局:按输入→处理→输出的信号流向摆放
│   │   ├── 网络标签优先:相同网络标签优先用标签替代跨图直线
│   │   └── 分析现有布局，确定元件放置位置(x,y坐标)
│   └── 检查点:布局规划完成(必需)- 已确定元件放置位置
│
├── 节点4:component_placement(元件放置)
│   ├── 推荐工具:sch_PrimitiveComponent$create,getCanvasSize
│   ├── 规则:
│   │   ├── 元件放置前必须获取画布大小，确保不超出边界
│   │   ├── 元件间距必须≥80mil(使用边界计算)
│   │   ├── 批量放置时，多个元件应一起放置
│   │   ├── subPartName 必填，即使为空字符串
│   │   └── x,y 必须在画布范围内
│   └── 检查点:元件放置完成(必需)- 元件已成功放置到画布
│
├── 节点5:get_pin_coordinates(获取引脚坐标)
│   ├── 推荐工具:sch_PrimitiveComponent$getAllPinsByPrimitiveId
│   ├── 规则:
│   │   ├── 批量获取所有元件的引脚坐标信息
│   │   └── 默认 invertY=true(y轴取反)
│   └── 检查点:引脚坐标获取完成(必需)- 已获取所有元件的引脚坐标
│
├── 节点6:calculate_bounds(计算边界)
│   ├── 推荐工具:calculateComponentBounds
│   ├── 规则:
│   │   ├── 边界格式:[x1,y1,x2,y2,x3,y3,x4,y4](顺时针:左下、右下、右上、左上)
│   │   ├── 扩展距离:10mil
│   │   └── 如果引脚列表为空或包含无效坐标，会返回空数组或忽略无效引脚
│   └── 检查点:边界计算完成(必需)- 已计算元件边界
│
├── 节点7:collision_detection(碰撞检测)
│   ├── 推荐工具:sch_PrimitiveComponent$getAll,sch_PrimitiveComponent$getAllPinsByPrimitiveId,
│   │            calculateComponentBounds,sch_PrimitiveWire$getAll
│   ├── 规则:
│   │   ├── 必须使用统一图元碰撞检测机制检测所有碰撞
│   │   ├── 新元件与画布边界的距离符合规范(≥10mil，默认12mil)
│   │   ├── 新元件与其他元件边界的距离符合规范(≥80mil，不能使用中心点计算)
│   │   ├── 新元件与现有导线的距离符合规范(≥6mil，默认8mil)
│   │   ├── 批量放置时，还需检测新元件之间的相互距离:≥80mil
│   │   ├── 确保无碰撞或已记录违规项
│   │   ├── 如有碰撞，执行移动元件操作
│   │   └── 移动元件后重新执行碰撞检测，最多重试3次
│   └── 检查点:碰撞检测通过(必需)- 已使用统一图元碰撞检测机制检测所有碰撞
│
├── 节点8:move_component(移动元件，可选)
│   ├── 推荐工具:sch_PrimitiveComponent$modify,sch_PrimitivePolygon$delete,
│   │            sch_PrimitivePolygon$create
│   ├── 规则:
│   │   ├── 移动元件时需要连同边界多边形一起移动
│   │   │   └── 先删除旧边界，移动元件，再重新绘制边界
│   │   ├── 如果修改位置，必须检查是否在画布范围内
│   │   └── 仅在碰撞检测失败时执行
│   └── 检查点:移动元件完成(可选)- 如有碰撞，已调整元件位置
│
├── 节点9:draw_bounds(边界绘制)
│   ├── 推荐工具:sch_PrimitivePolygon$create
│   ├── 规则:
│   │   ├── 所有元件放置并检测通过后，统一绘制边界多边形
│   │   ├── 边界转闭合格式:[x1,y1,x2,y2,x3,y3,x4,y4,x1,y1](首尾点必须相同)
│   │   ├── 使用虚线样式(lineType: DASHED，值为1)，线宽1
│   │   ├── line数组长度必须≥8且为偶数(至少4个点)，必须闭合
│   │   └── lineType枚举值:0:实线,1:虚线,2:点划线,3:点线
│   └── 检查点:边界绘制完成(必需)- 已绘制所有元件边界多边形
│
└── 节点10:validation(验证)
    ├── 推荐工具:sch_PrimitiveComponent$getAll,calculateComponentBounds,
    │            sch_PrimitiveWire$getAll
    ├── 规则:
    │   ├── 验证所有元件放置符合规范(间距、布局、边界)
    │   └── 检查所有检查点是否通过
    └── 检查点:验证通过(必需)- 所有元件放置符合规范
```

### 2.3 工作流:布线设计流程 (workflow_wiring_design)

```
布线设计流程
│
├── 节点1:wiring_planning(布线规划)
│   ├── 推荐工具:sch_PrimitiveComponent$getAll,sch_PrimitiveWire$getAll
│   ├── 规则:
│   │   ├── 识别关键信号(电源/地/时钟)，关键信号优先布线
│   │   └── 按输入→处理→输出规划顺序
│   └── 检查点:布线规划完成(必需)- 已识别关键信号，按输入→处理→输出规划顺序
│
├── 节点2:obstacle_analysis(障碍物分析)
│   ├── 推荐工具:getCanvasSize,sch_PrimitiveComponent$getAll,
│   │            sch_PrimitiveComponent$getAllPinsByPrimitiveId,
│   │            calculateComponentBounds,sch_PrimitiveWire$getAll
│   ├── 规则:
│   │   ├── 必须获取画布大小(画布-导线间距≥10mil，默认12mil)
│   │   ├── 必须获取所有元件列表及其引脚坐标
│   │   ├── 必须获取各个元件的边界信息(通过引脚列表计算边界)
│   │   ├── 必须获取所有现有导线的路径信息
│   │   └── 构建障碍物地图:
│   │       ├── 元件边界及安全区域(禁止导线穿越)
│   │       └── 现有导线路径及安全区域(禁止导线穿越)
│   └── 检查点:障碍物分析完成(必需)- 已获取所有信息，已构建障碍物地图
│
├── 节点3:path_calculation_collision(路径计算与碰撞检测)
│   ├── 推荐工具:无(纯算法计算)
│   ├── 规则:
│   │   ├── 使用A*算法进行路径搜索，在障碍物地图上进行计算
│   │   ├── 必须先根据元件的引脚列表获取边界再进行计算
│   │   ├── 实时碰撞检测(路径计算过程中必须检查):
│   │   │   ├── 新导线路径与画布边界的距离符合规范(≥10mil，默认12mil)
│   │   │   ├── 新导线路径与元件边界的距离符合规范(≥6mil，默认8mil)
│   │   │   ├── 新导线路径与其他导线的距离符合规范(≥6mil，默认8mil)
│   │   │   └── 新导线路径与引脚的距离符合规范(≥6mil，默认8-10mil)
│   │   ├── 识别90°拐点，替换为两段45°走线
│   │   ├── 算法参数:距离权重 + 拐点罚分 + 碰撞罚分
│   │   ├── 如有碰撞，调整路径或重新规划，最多重试3次
│   │   └── 纯算法计算，不调用工具
│   └── 检查点:路径计算与碰撞检测完成(必需)- 已使用A*算法，路径计算过程中实时碰撞检测通过
│
├── 节点4:wire_creation(导线创建)
│   ├── 推荐工具:sch_PrimitiveWire$create,sch_PrimitiveWire$delete
│   ├── 规则:
│   │   ├── 如果需要与旧导线连接，则删除旧导线，然后创建新导线
│   │   ├── 标准:优先45°走线，禁止锐角
│   │   ├── line 参数必须为连续坐标数组(长度为偶数且不少于4)
│   │   ├── line 中的所有 x,y 不能超过画布边界
│   │   ├── color 可以不传，但必须不能为null或undefined
│   │   └── lineType 默认值为0(实线)
│   └── 检查点:导线创建完成(必需)- 导线已成功创建(优先45°走线，禁止锐角)
│
└── 节点5:validation(验证)
    ├── 推荐工具:sch_PrimitiveWire$getAll,sch_PrimitiveComponent$getAll,
    │            calculateComponentBounds
    ├── 规则:
    │   ├── 验证所有导线符合规范(间距、路径、角度)
    │   └── 检查所有检查点是否通过
    └── 检查点:验证通过(必需)- 所有导线符合规范(间距、路径、角度)
```

### 2.4 工作流:验证优化流程 (workflow_validation_optimization)

```
验证优化流程
│
├── 节点1:design_check(设计检查)
│   ├── 推荐工具:sch_PrimitiveComponent$getAll,sch_PrimitiveWire$getAll,getCanvasSize
│   ├── 规则:
│   │   ├── 检查所有元件和导线
│   │   └── 获取画布大小
│   └── 检查点:设计检查完成(必需)- 已检查所有元件和导线
│
├── 节点2:spec_validation(规范验证)
│   ├── 推荐工具:sch_PrimitiveComponent$getAllPinsByPrimitiveId,
│   │            calculateComponentBounds,sch_PrimitiveWire$getAll
│   ├── 规则:
│   │   ├── 验证所有间距标准(必须检查所有间距):
│   │   │   ├── 画布-元件间距≥10mil(默认12mil)
│   │   │   ├── 画布-导线间距≥10mil(默认12mil)
│   │   │   ├── 元件-元件边界间距≥80mil(不能使用中心点计算)
│   │   │   ├── 元件-导线边界间距≥6mil(默认8mil)
│   │   │   ├── 导线-导线间距≥6mil(默认8mil)
│   │   │   ├── 导线-元件边界间距≥6mil(默认8mil)
│   │   │   └── 导线-引脚间距≥6mil(默认8-10mil)
│   │   └── 验证布局规划:
│   │       ├── 功能分组(按电源/信号/控制/接口等模块集中摆放)
│   │       ├── 流向布局(按输入→处理→输出的信号流向摆放)
│   │       └── 网络标签优先(相同网络标签优先用标签替代跨图直线)
│   └── 检查点:规范验证通过(必需)- 所有间距、布局符合规范
│
├── 节点3:optimization_suggestion(优化建议，可选)
│   ├── 推荐工具:readResource,listResources
│   ├── 规则:
│   │   ├── 应基于规范源码(standardCode1/2/3)和业界最佳实践
│   │   ├── 注意:规范源码非常庞大，不应该频繁调用
│   │   └── 生成优化建议(如有)
│   └── 检查点:优化建议完成(可选)- 已生成优化建议(如有)
│
├── 节点4:optimization_execution(优化执行，可选)
│   ├── 推荐工具:sch_PrimitiveComponent$modify,sch_PrimitiveWire$modify,
│   │            sch_PrimitiveWire$delete
│   ├── 规则:
│   │   ├── 必须保持设计功能不变
│   │   ├── 优化后必须重新验证所有间距标准
│   │   └── 执行优化操作(如有)
│   └── 检查点:优化执行完成(可选)- 已执行优化操作(如有)
│
└── 节点5:final_validation(最终验证)
    ├── 推荐工具:sch_PrimitiveComponent$getAll,sch_PrimitiveWire$getAll
    ├── 规则:
    │   ├── 必须确保所有规范都符合(间距、布局、布线)
    │   └── 最终验证所有检查点
    └── 检查点:最终验证通过(必需)- 设计完全符合规范
```

### 2.5 工作流:库管理流程 (workflow_library_management)

```
库管理流程
│
├── 流程描述:管理器件库、符号库、封装库、3D模型库、复用模块库等
│
├── 节点序列:
│   1. library_selection(库选择)
│   2. library_content_search(库内容搜索)
│   3. library_content_selection(库内容选择)
│   4. library_content_creation_modification(库内容创建/修改)
│   5. library_content_validation(库内容验证)
│
├── 节点规则:
│   - library_selection:
│     * 推荐工具:lib_LibrariesList$getAllLibrariesList,lib_LibrariesList$getPersonalLibraryUuid,lib_LibrariesList$getSystemLibraryUuid
│     * 规则:根据需求选择合适的库(个人库/系统库/工程库);获取库的UUID信息
│     * 检查点:库选择完成(必需)- 已确定要使用的库(libraryUuid)
│
│   - library_content_search:
│     * 推荐工具:lib_Device$search,lib_Symbol$search,lib_Footprint$search,lib_3DModel$search,lib_Cbb$search
│     * 规则:根据库类型和搜索条件搜索库内容;支持分页搜索(带itemsOfPage/page必须提供libraryUuid)
│     * 检查点:库内容搜索完成(必需)- 已搜索到目标库内容
│
│   - library_content_selection:
│     * 推荐工具:lib_Device$get,lib_Symbol$get,lib_Footprint$get,lib_3DModel$get,lib_Cbb$get
│     * 规则:获取库内容的详细信息(uuid,libraryUuid等);确认要使用的库内容
│     * 检查点:库内容选择完成(必需)- 已确定要使用的库内容(uuid,libraryUuid)
│
│   - library_content_creation_modification:
│     * 推荐工具:lib_Device$create,lib_Device$modify,lib_Symbol$create,lib_Symbol$modify,lib_Footprint$create,lib_Footprint$modify
│     * 规则:创建新库内容或修改现有库内容;确保库内容属性完整;分类管理(lib_Classification.*)
│     * 检查点:库内容创建/修改完成(必需)- 库内容已成功创建或修改
│
│   - library_content_validation:
│     * 推荐工具:lib_Device$get,lib_Symbol$get,lib_Footprint$get
│     * 规则:验证库内容属性完整性;检查库内容是否符合规范
│     * 检查点:库内容验证通过(必需)- 库内容符合规范
```

### 2.6 工作流:文档和工程管理流程 (workflow_project_document_management)

```
文档和工程管理流程
│
├── 流程描述:管理工程、原理图、PCB、板子等文档的创建、打开、保存、导入导出
│
├── 节点序列:
│   1. project_selection_creation(工程选择/创建)
│   2. document_creation_opening(文档创建/打开)
│   3. document_operation(文档操作)
│   4. document_save(文档保存)
│
├── 节点规则:
│   - project_selection_creation:
│     * 推荐工具:dmt_Project$getAllProjectsUuid,dmt_Project$getProjectInfo,dmt_Project$createProject,dmt_Project$openProject
│     * 规则:根据需求选择现有工程或创建新工程;获取工程信息(uuid,name等)
│     * 检查点:工程选择/创建完成(必需)- 已确定要使用的工程(projectUuid)
│
│   - document_creation_opening:
│     * 推荐工具:dmt_Schematic$createSchematic,dmt_Schematic$getAllSchematicsInfo,dmt_Pcb$createPcb,dmt_Pcb$getAllPcbsInfo,dmt_EditorControl$openDocument
│     * 规则:根据需求创建新文档或打开现有文档;获取文档信息(uuid,name等)
│     * 检查点:文档创建/打开完成(必需)- 文档已成功创建或打开
│
│   - document_operation:
│     * 推荐工具:dmt_EditorControl$activateDocument,dmt_Schematic$modifySchematicName,dmt_Pcb$modifyPcbName,dmt_Board$modifyBoardName
│     * 规则:执行文档操作(激活、重命名等);管理文档结构(图页、板子等)
│     * 检查点:文档操作完成(必需)- 文档操作已成功执行
│
│   - document_save:
│     * 推荐工具:sch_Document$save,pcb_Document$save,sys_FileManager$getProjectFile
│     * 规则:保存文档修改;导出文档文件(如需要)
│     * 检查点:文档保存完成(必需)- 文档已成功保存
```

### 2.7 工作流:图形绘制和标注流程 (workflow_graphics_annotation)

```
图形绘制和标注流程
│
├── 流程描述:创建和编辑文本、矩形、圆形、圆弧、多边形等图形元素
│
├── 节点序列:
│   1. graphics_type_selection(图形类型选择)
│   2. position_planning(位置规划)
│   3. graphics_creation(图形创建)
│   4. graphics_property_setting(图形属性设置)
│   5. graphics_validation(图形验证)
│
├── 节点规则:
│   - graphics_type_selection:
│     * 推荐工具:无
│     * 规则:根据需求确定图形类型(文本/矩形/圆形/圆弧/多边形)
│     * 检查点:图形类型选择完成(必需)- 已确定图形类型
│
│   - position_planning:
│     * 推荐工具:getCanvasSize,sch_PrimitiveComponent$getAll,sch_PrimitiveWire$getAll
│     * 规则:分析现有布局，确定图形放置位置(x,y坐标);确保不遮挡重要元件和导线
│     * 检查点:位置规划完成(必需)- 已确定图形放置位置(x,y坐标)
│
│   - graphics_creation:
│     * 推荐工具:sch_PrimitiveText$create,sch_PrimitiveRectangle$create,sch_PrimitiveCircle$create,sch_PrimitiveArc$create,sch_PrimitivePolygon$create
│     * 规则:创建图形元素;确保坐标在画布范围内;设置基本属性(颜色、线宽等)
│     * 检查点:图形创建完成(必需)- 图形已成功创建
│
│   - graphics_property_setting:
│     * 推荐工具:sch_PrimitiveText$modify,sch_PrimitiveRectangle$modify,sch_PrimitiveCircle$modify,sch_PrimitiveArc$modify,sch_PrimitivePolygon$modify
│     * 规则:设置图形属性(颜色、线宽、填充、字体等);确保属性值有效
│     * 检查点:图形属性设置完成(必需)- 图形属性已成功设置
│
│   - graphics_validation:
│     * 推荐工具:sch_PrimitiveText$get,sch_PrimitiveRectangle$get,sch_PrimitiveCircle$get
│     * 规则:验证图形位置和属性是否符合要求;检查图形是否在画布范围内
│     * 检查点:图形验证通过(必需)- 图形符合规范
```

### 2.8 工作流:网络标识和端口管理流程 (workflow_net_flag_port_management)

```
网络标识和端口管理流程
│
├── 流程描述:创建和管理网络标识、网络端口、短接标识、总线等
│
├── 节点序列:
│   1. network_analysis(网络分析)
│   2. flag_type_selection(标识类型选择)
│   3. flag_creation(标识创建)
│   4. flag_validation(标识验证)
│
├── 节点规则:
│   - network_analysis:
│     * 推荐工具:sch_PrimitiveComponent$getAll,sch_PrimitiveWire$getAll,sch_Netlist$getNetlist
│     * 规则:分析现有网络连接;识别需要添加标识的网络(电源/地/输入/输出等)
│     * 检查点:网络分析完成(必需)- 已识别需要添加标识的网络
│
│   - flag_type_selection:
│     * 推荐工具:无
│     * 规则:根据网络类型选择合适的标识类型(网络标识/网络端口/短接标识/总线)
│     * 检查点:标识类型选择完成(必需)- 已确定标识类型
│
│   - flag_creation:
│     * 推荐工具:sch_PrimitiveComponent$createNetFlag,sch_PrimitiveComponent$createNetPort,sch_PrimitiveComponent$createShortCircuitFlag,sch_PrimitiveBus$create
│     * 规则:创建网络标识/端口/总线;设置网络名称;关联到相应元件(如需要)
│     * 检查点:标识创建完成(必需)- 网络标识/端口/总线已成功创建
│
│   - flag_validation:
│     * 推荐工具:sch_PrimitiveComponent$getAll,sch_PrimitiveBus$getAll,sch_Netlist$getNetlist
│     * 规则:验证网络标识是否正确关联;检查网络连接是否完整
│     * 检查点:标识验证通过(必需)- 网络标识符合规范
```

### 2.9 工作流:网表操作流程 (workflow_netlist_operation)

```
网表操作流程
│
├── 流程描述:获取、更新、对比网表文件
│
├── 节点序列:
│   1. netlist_retrieval(网表获取)
│   2. netlist_analysis(网表分析)
│   3. netlist_update_comparison(网表更新/对比)
│   4. netlist_validation(网表验证)
│
├── 节点规则:
│   - netlist_retrieval:
│     * 推荐工具:sch_Netlist$getNetlist,sch_ManufactureData$getNetlistFile
│     * 规则:获取当前设计的网表信息;获取网表文件(如需要)
│     * 检查点:网表获取完成(必需)- 已获取网表信息
│
│   - netlist_analysis:
│     * 推荐工具:无
│     * 规则:分析网表结构;识别网络连接关系;检查网表完整性
│     * 检查点:网表分析完成(必需)- 已分析网表结构
│
│   - netlist_update_comparison:
│     * 推荐工具:sch_Netlist$setNetlist,sys_Tool$netlistComparison
│     * 规则:更新网表信息(如需要);对比两个网表的差异(如需要)
│     * 检查点:网表更新/对比完成(必需)- 网表已更新或对比完成
│
│   - netlist_validation:
│     * 推荐工具:sch_Netlist$getNetlist,sch_PrimitiveComponent$getAll,sch_PrimitiveWire$getAll
│     * 规则:验证网表与设计的一致性;检查网络连接是否正确
│     * 检查点:网表验证通过(必需)- 网表符合规范
```

### 2.10 工作流:DRC检查流程 (workflow_drc_check)

```
DRC检查流程
│
├── 流程描述:执行原理图和PCB的设计规则检查
│
├── 节点序列:
│   1. drc_configuration(DRC配置)
│   2. drc_execution(DRC执行)
│   3. error_analysis(错误分析)
│   4. error_fix(错误修复)
│   5. recheck(重新检查)
│
├── 节点规则:
│   - drc_configuration:
│     * 推荐工具:pcb_Drc$getAllRuleConfigurations,pcb_Drc$getCurrentRuleConfiguration,pcb_Drc$saveRuleConfiguration
│     * 规则:配置设计规则检查项;选择或创建规则配置;设置规则参数
│     * 检查点:DRC配置完成(必需)- 已配置设计规则
│
│   - drc_execution:
│     * 推荐工具:sch_Drc$check,pcb_Drc$check
│     * 规则:执行设计规则检查;获取检查结果(错误列表)
│     * 检查点:DRC执行完成(必需)- 已获取检查结果
│
│   - error_analysis:
│     * 推荐工具:无
│     * 规则:分析DRC错误;分类错误类型(间距/连接/规则等);确定错误优先级
│     * 检查点:错误分析完成(必需)- 已分析所有错误
│
│   - error_fix:
│     * 推荐工具:sch_PrimitiveComponent$modify,sch_PrimitiveWire$modify,sch_PrimitiveWire$delete
│     * 规则:修复DRC错误;保持设计功能不变;记录修复操作
│     * 检查点:错误修复完成(必需)- 已修复所有可修复的错误
│
│   - recheck:
│     * 推荐工具:sch_Drc$check,pcb_Drc$check
│     * 规则:重新执行DRC检查;验证错误是否已修复
│     * 检查点:重新检查完成(必需)- 所有错误已修复或已记录
```

### 2.11 工作流:制造数据导出流程 (workflow_manufacture_data_export)

```
制造数据导出流程
│
├── 流程描述:导出BOM、网表、Gerber、坐标文件等制造相关数据
│
├── 节点序列:
│   1. data_requirement_analysis(数据需求分析)
│   2. data_format_selection(数据格式选择)
│   3. data_export(数据导出)
│   4. data_validation(数据验证)
│
├── 节点规则:
│   - data_requirement_analysis:
│     * 推荐工具:sch_PrimitiveComponent$getAll,pcb_PrimitiveComponent$getAll
│     * 规则:分析需要导出的数据类型(BOM/网表/Gerber/坐标等);确定导出范围
│     * 检查点:数据需求分析完成(必需)- 已确定需要导出的数据类型
│
│   - data_format_selection:
│     * 推荐工具:无
│     * 规则:根据制造需求选择数据格式;确认文件格式兼容性
│     * 检查点:数据格式选择完成(必需)- 已确定数据格式
│
│   - data_export:
│     * 推荐工具:sch_ManufactureData$getBomFile,sch_ManufactureData$getNetlistFile,pcb_ManufactureData$getGerberFile,pcb_ManufactureData$getPickAndPlaceFile
│     * 规则:导出制造数据文件;确保文件格式正确;保存文件路径
│     * 检查点:数据导出完成(必需)- 制造数据文件已成功导出
│
│   - data_validation:
│     * 推荐工具:无
│     * 规则:验证导出数据的完整性;检查文件格式是否正确;确认数据准确性
│     * 检查点:数据验证通过(必需)- 导出数据符合要求
```

### 2.12 工作流:选择和交互流程 (workflow_selection_interaction)

```
选择和交互流程
│
├── 流程描述:图元选择、事件监听、编辑器控制等交互操作
│
├── 节点序列:
│   1. selection_mode_determination(选择模式确定)
│   2. primitive_selection(图元选择)
│   3. selection_operation(选择操作)
│   4. interaction_feedback(交互反馈)
│
├── 节点规则:
│   - selection_mode_determination:
│     * 推荐工具:无
│     * 规则:根据操作需求确定选择模式(单选/多选/区域选择等)
│     * 检查点:选择模式确定完成(必需)- 已确定选择模式
│
│   - primitive_selection:
│     * 推荐工具:sch_SelectControl$doSelectPrimitives,pcb_SelectControl$doSelectPrimitives,sch_SelectControl$getAllSelectedPrimitives
│     * 规则:选择目标图元(通过primitiveId);获取选中图元信息
│     * 检查点:图元选择完成(必需)- 已成功选择目标图元
│
│   - selection_operation:
│     * 推荐工具:sch_SelectControl$getAllSelectedPrimitives,pcb_SelectControl$getAllSelectedPrimitives,sch_SelectControl$clearSelected
│     * 规则:对选中图元执行操作;管理选择状态(清除选择等)
│     * 检查点:选择操作完成(必需)- 选择操作已成功执行
│
│   - interaction_feedback:
│     * 推荐工具:sch_Event$addMouseEventListener,pcb_Event$addMouseEventListener,dmt_EditorControl$zoomToSelectedPrimitives
│     * 规则:提供交互反馈(高亮/缩放等);监听用户交互事件(如需要)
│     * 检查点:交互反馈完成(必需)- 已提供交互反馈
```

---

## 🟡 第三层:智能执行层 (Execution Layer)

### 3.1 执行模式:ReAct (execution_mode_react)

```
ReAct (Reasoning + Acting) 执行模式
│
├── 执行步骤
│   ├── 1. 思考 (Think): 分析当前任务和状态
│   ├── 2. 行动 (Act): 选择合适的工具执行操作
│   ├── 3. 观察 (Observe): 分析工具执行结果
│   ├── 4. 思考 (Think): 根据结果决定下一步
│   └── 5. 重复步骤2-4，直到任务完成
│
└── 适用场景
    ├── 需要逐步探索和试错的任务
    ├── 不确定具体执行路径的任务
    └── 需要根据中间结果调整策略的任务
```

### 3.2 执行模式:Plan (execution_mode_plan)

```
Plan (Planning + Execution) 执行模式
│
├── 执行步骤
│   ├── 1. 规划 (Plan): 制定详细的执行计划
│   │   ├── 工作流选择(根据用户需求，自主判断应该执行哪个工作流)
│   │   ├── 节点序列(按照工作流节点顺序执行)
│   │   ├── 工具调用顺序(根据当前工作流和节点选择合适的工具)
│   │   └── 检查点验证(执行完每个节点后，自行验证检查点是否通过)
│   ├── 2. 执行 (Execute): 按照计划逐步执行
│   ├── 3. 验证 (Verify): 验证每个检查点
│   ├── 4. 调整 (Adjust): 根据实际情况调整计划
│   └── 5. 重复步骤2-4，直到任务完成
│
└── 适用场景
    ├── 复杂任务需要整体规划
    ├── 需要确保所有检查点都通过的任务
    └── 需要按照标准流程执行的任务
```

### 3.3 执行指导原则 (execution_guidance)

```
执行指导原则
│
├── 重要提示
│   ├── 1. 根据用户需求，自主判断应该执行哪个工作流(禁止通过字符串匹配工作流)
│   ├── 2. 建议按照工作流节点顺序执行，每个节点都有明确的规则和推荐工具
│   ├── 3. 所有工具都可以调用，但请根据当前工作流和节点选择合适的工具
│   ├── 4. 执行完每个节点后，请自行验证检查点是否通过
│   ├── 5. 如果遇到问题，请参考工作流规则和业务规范进行调整
│   └── 6. 在规则框架内，你可以创新和优化执行方式
│
└── 规则获取策略
    ├── 使用 getPrompt 工具按需获取规则，不要一次性获取所有规则(避免token浪费)
    ├── 根据当前任务阶段，获取相关的业务规则
    │   ├── spacing(间距标准)
    │   ├── layout(布局策略)
    │   ├── wiring(布线规则)
    │   ├── tools(工具要求)
    │   └── collision(碰撞检测)
    ├── 根据当前工作流，获取对应的工作流定义
    │   ├── workflow_requirement_analysis(需求分析)
    │   ├── workflow_component_design(元件设计)
    │   ├── workflow_wiring_design(布线设计)
    │   ├── workflow_validation_optimization(验证优化)
    │   ├── workflow_library_management(库管理)
    │   ├── workflow_project_document_management(文档工程管理)
    │   ├── workflow_graphics_annotation(图形标注)
    │   ├── workflow_net_flag_port_management(网络端口管理)
    │   ├── workflow_netlist_operation(网表操作)
    │   ├── workflow_drc_check(DRC检查)
    │   ├── workflow_manufacture_data_export(制造数据导出)
    │   └── workflow_selection_interaction(选择交互)
    └── 根据执行方式，获取执行模式指导
        ├── react(ReAct模式)
        └── plan(Plan模式)

规则获取示例:
  - 开始元件设计时:getPrompt({name: 'workflow_component_design'})
  - 需要检查间距时:getPrompt({name: 'business_rules_spacing'})
  - 需要布局规划时:getPrompt({name: 'business_rules_layout'})
  - 需要布线时:getPrompt({name: 'business_rules_wiring'})
  - 需要工具调用时:getPrompt({name: 'business_rules_tools'})
  - 需要碰撞检测时:getPrompt({name: 'business_rules_collision'})
```

---

## 🔄 工作流执行流程图

```
用户需求
    ↓
┌─────────────────────┐
│  需求分析工作流       │
│  - 需求理解          │
│  - 需求确认          │
│  - 流程选择          │
└─────────────────────┘
    ↓
    ├──→ 元件设计工作流
    │   ├── 元件搜索
    │   ├── 元件选择
    │   ├── 布局规划
    │   ├── 元件放置
    │   ├── 获取引脚坐标
    │   ├── 计算边界
    │   ├── 碰撞检测
    │   ├── 移动元件(可选)
    │   ├── 边界绘制
    │   └── 验证
    │
    ├──→ 布线设计工作流
    │   ├── 布线规划
    │   ├── 障碍物分析
    │   ├── 路径计算与碰撞检测
    │   ├── 导线创建
    │   └── 验证
    │
    └──→ 验证优化工作流
        ├── 设计检查
        ├── 规范验证
        ├── 优化建议(可选)
        ├── 优化执行(可选)
        └── 最终验证

    ├──→ 库管理工作流
    │   ├── 库选择
    │   ├── 库内容搜索
    │   ├── 库内容选择
    │   ├── 库内容创建/修改
    │   └── 库内容验证
    │
    ├──→ 文档工程管理工作流
    │   ├── 工程选择/创建
    │   ├── 文档创建/打开
    │   ├── 文档操作
    │   └── 文档保存
    │
    ├──→ 图形标注工作流
    │   ├── 图形类型选择
    │   ├── 位置规划
    │   ├── 图形创建
    │   ├── 图形属性设置
    │   └── 图形验证
    │
    ├──→ 网络端口管理工作流
    │   ├── 网络分析
    │   ├── 标识类型选择
    │   ├── 标识创建
    │   └── 标识验证
    │
    ├──→ 网表操作工作流
    │   ├── 网表获取
    │   ├── 网表分析
    │   ├── 网表更新/对比
    │   └── 网表验证
    │
    ├──→ DRC检查工作流
    │   ├── DRC配置
    │   ├── DRC执行
    │   ├── 错误分析
    │   ├── 错误修复
    │   └── 重新检查
    │
    ├──→ 制造数据导出工作流
    │   ├── 数据需求分析
    │   ├── 数据格式选择
    │   ├── 数据导出
    │   └── 数据验证
    │
    └──→ 选择交互工作流
        ├── 选择模式确定
        ├── 图元选择
        ├── 选择操作
        └── 交互反馈
```

---

## 📋 重要执行原则总结

1. **自主判断工作流**:根据用户需求自主判断应该执行哪个工作流
2. **按需获取规则**:使用 getPrompt 工具按需获取规则，根据当前任务阶段获取相关的业务规则和工作流定义
3. **按节点顺序执行**:建议按照工作流节点顺序执行，每个节点都有明确的规则和推荐工具
4. **验证检查点**:执行完每个节点后，请验证检查点是否通过
5. **规则框架内创新**:在规则框架内，可以创新和优化执行方式

---

## 🛠️ 工具调用规范

### 常用工具分类

```
工具分类
├── 元件相关工具
│   ├── lib_Device$search(元件搜索)
│   ├── sch_PrimitiveComponent$create(创建元件)
│   ├── sch_PrimitiveComponent$modify(修改元件)
│   ├── sch_PrimitiveComponent$getAll(获取所有元件)
│   └── sch_PrimitiveComponent$getAllPinsByPrimitiveId(获取引脚坐标)
│
├── 导线相关工具
│   ├── sch_PrimitiveWire$create(创建导线)
│   ├── sch_PrimitiveWire$modify(修改导线)
│   ├── sch_PrimitiveWire$delete(删除导线)
│   └── sch_PrimitiveWire$getAll(获取所有导线)
│
├── 多边形相关工具
│   ├── sch_PrimitivePolygon$create(创建多边形)
│   └── sch_PrimitivePolygon$delete(删除多边形)
│
├── 画布相关工具
│   └── getCanvasSize(获取画布大小)
│
├── 计算工具
│   └── calculateComponentBounds(计算元件边界)
│
└── 系统工具
    ├── listTools(列出所有工具)
    ├── listResources(列出所有资源)
    ├── getPrompt(获取提示规则)
    └── readResource(读取资源)
```

---

## 📊 检查点验证体系

每个工作流节点都包含明确的检查点，确保执行质量:

- **必需检查点**:必须通过才能进入下一节点
- **可选检查点**:根据实际情况决定是否执行

检查点验证原则:
1. 每个节点执行完成后，立即验证对应的检查点
2. 如果检查点未通过，需要重新执行或调整
3. 所有必需检查点通过后，才能进入下一节点
4. 最终验证时，需要验证所有检查点

---

## 🎯 总结

本AI执行框架采用**三层架构**设计:

1. **规则约束层**:提供业务规则和标准规范，确保设计符合要求
2. **流程引导层**:定义工作流程和节点序列，指导执行路径
3. **智能执行层**:提供执行模式和指导原则，支持灵活执行

通过**按需获取规则**、**按节点顺序执行**、**验证检查点**等机制，确保AI助手能够在预设路径内高效运作，同时保持必要的灵活性，实现高质量的嘉立创EDA原理图设计。

