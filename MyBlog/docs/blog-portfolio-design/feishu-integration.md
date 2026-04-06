# 飞书集成设计

## 环境变量
后端：
- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `FEISHU_DOCUMENT_ID`
- `FEISHU_ENABLED=true|false`

## 调用流程
1. 用 `app_id + app_secret` 获取 `tenant_access_token`
2. 调用 `GET /open-apis/docx/v1/documents/{document_id}/raw`
3. 将文档结构解析为统一模型：`[{time, activity, duration}]`
4. 失败降级：读取本地 mock 数据

## 后端伪代码
```java
if (!feishuEnabled) return mockData();
String token = feishuAuthClient.getTenantAccessToken();
RawDoc rawDoc = feishuDocClient.getRawDocument(token, documentId);
return dayTimelineParser.toDayItems(rawDoc);
```

## Mock 方案
- 放置文件：`backend/src/main/resources/mock/feishu-day.json`
- 切换规则：
  - 未配置飞书凭证 -> mock
  - 飞书请求超时/限流 -> mock + 打日志

## 风险与对策
- token 过期：缓存 token 并记录过期时间提前刷新
- API 限流：接口层加短缓存和失败重试（指数退避）
- 文档格式变化：解析器隔离，保证容错
