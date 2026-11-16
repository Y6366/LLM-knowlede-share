![[Pasted image 20261116220355.png]]

评估层级high level划分：
- **Coding Capability（代码处理能力）**：模型能够解决什么类型的开发问题。
- **Agentic Capability（自主任务执行能力）**：模型能否自主规划、调用工具并完成任务。
- **Artifact Processing Capability（工程文件处理能力）**：模型能否正确理解、生成和修改不同类型的工程文件。

## **Agentic Capability 主流评测数据集**

| 数据集                | 核心评测能力           | 企业 Coding 适配度 | 公开榜单                                                                            |
| ------------------ | ---------------- | ------------- | ------------------------------------------------------------------------------- |
| BFCL V4            | 工具调用、多轮交互、记忆     | 很高            | [官方榜单](https://gorilla.cs.berkeley.edu/leaderboard.html?utm_source=chatgpt.com) |
| Terminal-Bench     | 终端操作、多步骤自主任务执行   | 很高            | [官方榜单](https://www.tbench.ai/?utm_source=chatgpt.com)                           |
| SWE-bench Verified | 真实软件工程问题处理       | 很高            | [官方榜单](https://www.swebench.com/?utm_source=chatgpt.com)                        |
| SWE-bench Pro      | 复杂软件工程任务处理       | 很高            | 公开                                                                              |
| τ-bench            | 多轮交互、工具调用、业务规则遵循 | 较高            | 公开                                                                              |
| AgentBench         | 综合 Agent 环境交互能力  | 较高            | 公开                                                                              |
## **Artifact Processing 主流评测数据集**

这个方向最值得关注的是 **StructEval 和 JSONSchemaBench**。

|数据集|核心评测内容|支持格式|公开榜单|
|---|---|---|---|
|StructEval|结构化内容生成、格式转换|JSON、Markdown、YAML 等18种|[官方榜单](https://structeval.github.io/?utm_source=chatgpt.com)|
|JSONSchemaBench|复杂 JSON 结构生成|JSON|有|
|FoFo|复杂格式指令遵循|多种行业输出格式|论文评测结果|
|IFEval|指令遵循、输出约束|通用文本格式|有第三方榜单|
### **StructEval（综合评测首选）**

这是目前与 Artifact Processing 能力评测目标相当契合的公开数据集。

测试样本：2035
文件格式：18
任务类型：44
![[Pasted image 20261116221742.png]]

它主要评测两种任务：

- **Generation**：根据自然语言需求生成指定结构的内容。
- **Conversion**：将一种结构化内容转换为另一种格式。

其官网提供模型综合得分榜单和评测结果下载入口，2026 年 10 月 12 日的榜单快照包含33个模型。对于企业模型初步选型，具有较好的参考价值。

[官方榜单及数据下载](https://structeval.github.io/?utm_source=chatgpt.com)：https://structeval.github.io/?utm_source=chatgpt.com


**Terminal-Bench：面向 Agentic 能力的评测基准**

## **Terminal-Bench 评测哪些能力？**

|能力维度|评测内容|
|---|---|
|Task Planning|自主拆解复杂任务|
|Tool Calling|调用终端及相关工具|
|Environment Understanding|理解文件系统、依赖及运行环境|
|Multi-step Execution|连续执行多步骤任务|
|Code Generation|编写代码及自动化脚本|
|Error Recovery|分析执行错误并自主修正|
|Artifact Processing|读取、生成和修改工程文件|
|Task Completion|完成端到端任务交付|
## **数据集规模与版本**

Terminal-Bench 采用持续迭代的方式更新测试任务。以具有代表性的 2.x 版本为例：

Terminal-Bench 2.0

# **89 道**

高复杂度真实任务

Terminal-Bench 2.1

# **28 道**

在 2.0 基础上修正的任务数量

Terminal-Bench 2.1 于 2026 年 5 月 6 日发布，对原有任务的验收逻辑等问题进行了修正。项目仍在持续迭代，上述规模仅对应 2.x 版本。

## **测试题目是什么样的？**

以下是按照 Terminal-Bench 任务设计思路构造的示例，并非数据集原题。

|任务类型|题目示例|
|---|---|
|软件开发|实现支持指定协议的服务端程序|
|软件调试|定位并修复无法启动的应用程序|
|系统运维|修复 Linux 服务及环境配置|
|数据处理|清洗多个数据文件并生成统计结果|
|文件处理|读取 JSON、CSV 并转换为指定结构|
|软件构建|解决第三方依赖及编译失败问题|
|性能优化|优化程序，使运行时间达到指定阈值|
|机器学习|完成数据预处理、训练及结果验证|

每道题都具有独立的运行环境和验收机制，不仅仅是一段 Prompt。

![[Pasted image 20261116225823.png]]

## **Terminal-Bench 如何评分？**

Terminal-Bench 的核心评分原则是 **Outcome-based Evaluation（基于最终结果的评测）**。

它并不严格要求 Agent 按照预先设定的操作步骤完成任务，而是验证最终交付结果是否符合要求。

GitHub

例如，要求 Agent 修复一个服务启动失败的问题，不管它使用 Python、Shell 还是其他工具，只要最终通过验收，即可判定任务成功。

核心指标为：

\[ Task\ Success\ Rate=\frac{Successful\ Trials}{Total\ Trials} \]
![[Pasted image 20261116225849.png]]

[官方 Leaderboard](https://www.tbench.ai/?utm_source=chatgpt.com)： https://www.tbench.ai/?utm_source=chatgpt.com