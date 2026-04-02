---
title: 'QVeris REST API 文档'
description: 'QVeris REST API 文档'
pubDate: 'Jul 15 2026'
heroImage: '../../../assets/blog-placeholder-about.jpg'
---

版本：0.1.9

QVeris 通过 REST API 提供三个核心操作：

| 协议操作 | API 端点 | 说明 |
|---------|---------|------|
| **发现（Discover）** | `POST /search` | 使用自然语言搜索能力（免费） |
| **检查（Inspect）** | `POST /tools/by-ids` | 通过 ID 获取能力详情 |
| **调用（Call）** | `POST /tools/execute` | 执行一个能力（1–100 积分） |

## 身份认证

所有 API 请求须在 Authorization 请求头中以 Bearer 方式进行认证：

```
Authorization: Bearer YOUR_API_KEY
```

API 密钥请从 https://qveris.ai 获取。

## Base URL

```
https://qveris.ai/api/v1
```

本文档中所有端点均相对于此 Base URL。

## API 端点

### 1. 发现 — 搜索工具

基于自然语言查询搜索能力。这是**发现（Discover）**操作，**免费**使用。

#### 端点

```
POST /search
```

#### 请求头

| 请求头 | 必填 | 说明 |
| --- | --- | --- |
| Authorization | 是 | 用于认证的 Bearer Token |
| Content-Type | 是 | 必须为 application/json |

#### 请求体

```json
{
  "query": "string",
  "limit": 10,
  "session_id": "string"
}
```

#### 参数

| 字段 | 类型 | 必填 | 说明 | 默认值 | 范围 |
| --- | --- | --- | --- | --- | --- |
| query | string | 是 | 自然语言搜索查询 | - | - |
| session_id | string | 否 | 相同 ID 对应同一用户会话 | - | - |
| limit | integer | 否 | 最大返回结果数 | 20 | 1-100 |

#### 响应

状态码：200 OK

```json
{
  "search_id": "string",
  "total": 3,
  "results": [
    {
      "tool_id": "openweathermap.weather.execute.v1",
      "name": "Current Weather",
      "description": "Get current weather data for any location",
      "provider_name": "OpenWeatherMap",
      "provider_description": "Global weather data provider",
      "region": "global",
      "params": [
        {
          "name": "city",
          "type": "string",
          "required": true,
          "description": "City name"
        },
        {
          "name": "units",
          "type": "string",
          "required": false,
          "description": "Temperature units (metric/imperial)",
          "enum": ["metric", "imperial", "standard"]
        }
      ],
      "examples": {
        "sample_parameters": {
          "city": "London",
          "units": "metric"
        }
      },
      "stats": {
          "avg_execution_time_ms": 21.74,
          "success_rate": 0.909
      }
    }
  ],
  "elapsed_time_ms": 245.6
}
```

#### 响应字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| query | string | 否 | 原始搜索查询 |
| search_id | string | 是 | 本次搜索的 ID，用于后续工具调用 |
| user_id | string | 否 | 原始搜索用户 ID |
| total | integer | 是 | 结果总数 |

#### 工具信息字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| tool_id | string | 是 | 工具的唯一标识符 |
| name | string | 是 | 工具显示名称 |
| description | string | 是 | 工具功能的详细描述 |
| provider_name | string | 否 | 工具提供商名称 |
| provider_description | string | 否 | 提供商描述 |
| region | string | 否 | 工具适用地域。"global" 表示全球，"\\|" 分隔的白名单（如 "US\\|CA"）或黑名单（如 "-CN\\|RU"）表示指定国家/地区代码 |
| params | array | 否 | 参数定义数组 |
| examples | object | 否 | 使用示例 |
| stats | object | 否 | 历史执行性能统计数据 |

---

### 2. 检查 — 通过 ID 获取工具

根据 tool_id 获取能力的详细描述。这是**检查（Inspect）**操作。

#### 端点

```
POST /tools/by-ids
```

#### 请求头

| 请求头 | 必填 | 说明 |
| --- | --- | --- |
| Authorization | 是 | 用于认证的 Bearer Token |
| Content-Type | 是 | 必须为 application/json |

#### 请求体

```json
{
  "tool_ids": ["string1", "string2", "..."],
  "search_id": "string",
  "session_id": "string"
}
```

#### 参数

| 字段 | 类型 | 必填 | 说明 | 默认值 | 范围 |
| --- | --- | --- | --- | --- | --- |
| tool_ids | list of strings | 是 | 要查询的工具 ID 列表 | - | - |
| session_id | string | 否 | 相同 ID 对应同一用户会话 | - | - |
| search_id | string | 否 | 返回该工具的搜索 ID | - | - |

#### 响应

状态码：200 OK

响应 schema 与 `/search` 相同。

---

### 3. 调用 — 执行工具

使用指定参数调用一个能力。这是**调用（Call）**操作，每次调用消耗 **1–100 积分**，按数据和任务价值计费。

#### 端点

```
POST /tools/execute?tool_id={tool_id}
```

#### 请求头

| 请求头 | 必填 | 说明 |
| --- | --- | --- |
| Authorization | 是 | 用于认证的 Bearer Token |
| Content-Type | 是 | 必须为 application/json |

#### URL 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| tool_id | string | 是 | 要执行的工具的唯一标识符 |

#### 请求体

```json
{
  "search_id": "string",
  "session_id": "string",
  "parameters": {
    "city": "London",
    "units": "metric"
  },
  "max_response_size": 20480
}
```

#### 参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| search_id | string | 是 | 返回该工具的搜索 ID |
| session_id | string | 否 | 相同 ID 对应同一用户会话 |
| parameters | object | 是 | 工具参数的键值对，值可以为对象 |
| max_response_size | integer | 否 | 若工具生成数据超过此字节数则截断，避免大量 LLM token 消耗。-1 表示无限制，默认 20480（20K）。详见下方说明 |

#### 响应

状态码：200 OK

```json
{
  "execution_id": "string",
  "result": {
    "data": {
      "temperature": 15.5,
      "humidity": 72,
      "description": "partly cloudy",
      "wind_speed": 12.5
    }
  },
  "success": true,
  "error_message": null,
  "elapsed_time_ms": 210.72,
  "cost": 5.0
}
```

#### 响应字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| execution_id | string | 是 | 本次执行的唯一标识符 |
| result | object | 是 | 工具执行结果 |
| success | boolean | 是 | 执行是否成功 |
| error_message | string | 否 | 执行失败时的错误信息 |
| elapsed_time_ms | number | 否 | 执行耗时（毫秒） |
| cost | number | 否 | 从账户扣除的积分数 |

若因第三方服务余额不足、配额超限或其他原因导致调用失败，`success` 将为 false，`error_message` 将包含详细的失败信息。

