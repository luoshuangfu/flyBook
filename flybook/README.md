# Flybook

一个用于展示飞书云文档内容的网站项目仓库。当前仓库内已经包含一套 `Spring Boot + React + Vite` 的全栈应用基础，可作为后续接入飞书开放平台、读取飞书云文档/多维表格并进行可视化展示的开发基础。

## 项目目标

本项目的目标是：

- 读取固定的飞书云文档内容
- 将云文档中的数据以网页形式展示出来
- 提供更适合浏览的大屏/仪表盘式界面
- 后端负责对接飞书开放平台接口
- 前端负责将文档内容整理为卡片、图表、表格、时间线等视图

当前指定的飞书文档链接为：

- 飞书开放平台文档：`https://open.feishu.cn/document/introduction`
- 目标云文档链接：`https://pcnuh3xna4el.feishu.cn/base/N8Jbb75ztaUKeQsaYPrcKNvLnJe?table=tblqtpPJewNBuI04&view=vewLdLkJ90`

说明：
- 上述值来自你提供的飞书 Base 链接
- 后续代码中可以将这些值写入后端配置文件或常量中，作为固定数据源
- 如果需要访问飞书开放接口，还需要补充 `appId` 与 `appSecret`

## 当前仓库结构

```text
flybook/
├─ src/main/java/                 # Spring Boot 后端
├─ src/main/resources/            # 后端配置与 SQL
├─ frontend/                      # React + Vite 前端
├─ pom.xml                        # Maven 配置
└─ package-lock.json / 其他前端配置
```

## 当前技术栈

### 后端

- Java 17
- Spring Boot 3.2.4
- Spring Web
- Spring Data JPA
- MySQL
- Maven

### 前端

- React 18
- Vite 5
- HeroUI
- Recharts
- Axios
- Tailwind CSS
- Framer Motion

## 当前运行端口

### 后端

后端默认端口：`8080`

配置文件位置：`src/main/resources/application.properties`

当前数据库配置：

- 数据库：
- 地址：`localhost:3306`
- 用户名：`root`
- 密码：

### 前端

前端开发端口：`5173`

并已通过 Vite 代理将 `/api` 请求转发到：

- `http://localhost:8080`

## 本地启动方式

### 1. 启动后端

在项目根目录运行：

```bash
mvn spring-boot:run
```

或者先打包再运行：

```bash
mvn clean package
java -jar target/*.jar
```

### 2. 启动前端

进入前端目录：

```bash
cd frontend
npm install
npm run dev
```

浏览器访问：

```text
http://localhost:5173
```

## 飞书接入改造建议

为了把当前项目改造成“飞书云文档展示网站”，建议按下面方式调整：

### 后端职责

新增飞书接口适配层，例如：

- 申请 tenant_access_token
- 调用飞书多维表格记录查询接口
- 将飞书返回数据转换为前端需要的结构
- 暴露统一接口给前端，例如：
  - `GET /api/feishu/records`
  - `GET /api/feishu/summary`
  - `GET /api/feishu/dashboard`

建议新增配置项：

```properties
feishu.app-id=你的AppId
feishu.app-secret=你的AppSecret
feishu.base.app-token=
feishu.base.table-id=
feishu.base.view-id=
```

### 前端职责

前端可以围绕飞书文档内容构建以下页面：

- 总览页：统计卡片
- 分类占比页：饼图 / 柱状图
- 明细列表页：表格展示
- 时间分布页：趋势图 / 时间线
- 异常提示页：空数据或缺失字段提醒

结合你提供的截图，界面风格可以参考：

- 深色仪表盘布局
- 左侧导航
- 中间主数据区
- 右侧趋势或明细模块
- 顶部日期筛选 / 同步状态 / 数据来源说明

## 推荐的飞书开放平台阅读重点

建议优先阅读飞书开放平台中与以下内容相关的文档：

1. 应用创建与凭证获取
2. 自建应用权限配置
3. `tenant_access_token` 获取方式
4. 多维表格 Base API
5. 记录列表读取接口
6. 表格/视图/字段结构说明

## 当前仓库现状说明

目前仓库中的现有功能更偏向“本地时间记录系统”，包含：

- 分类管理
- 记录增删改查
- 日/周统计
- 时间线展示
- CSV 导出

这意味着：

- 前端展示层已有较好的基础
- 后端 API 结构也可复用
- 后续主要工作是把“本地数据库数据源”替换或补充为“飞书 Base 数据源”

## 后续开发建议

推荐按以下顺序推进：

1. 接入飞书开放平台认证
2. 在后端完成固定 Base / Table / View 的读取
3. 定义统一的数据返回 DTO
4. 前端接入新接口并展示真实飞书数据
5. 根据截图优化页面结构与可视化组件
6. 增加错误提示、加载状态、手动刷新与缓存策略

## 可能需要的环境变量

如果后续不希望把飞书凭证直接写死到配置文件，建议改为环境变量：

```bash
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
FEISHU_BASE_APP_TOKEN=
FEISHU_TABLE_ID=
FEISHU_VIEW_ID=
```

## 备注

- 当前 README 先基于现有仓库结构和你的目标需求整理
- 飞书接口代码尚未在当前仓库中正式接入
- 如果你下一步需要，我可以继续直接帮你把这个项目改造成“飞书云文档展示网站”，包括：
  - 后端接入飞书 API
  - 前端改造成仪表盘风格
  - 固定云文档 ID 配置
  - 完整联调与页面展示
