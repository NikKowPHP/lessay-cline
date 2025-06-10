# API SPECIFICATION TEMPLATE
<!-- Document Version: 1.0 -->
<!-- Last Updated: DATE -->

## 1. Overview
### 1.1 Purpose
<!-- Describe the API's purpose and scope -->

### 1.2 Base URL
`https://api.example.com/v1`

## 2. Authentication
### 2.1 Authentication Method
<!-- Describe auth mechanism (e.g., JWT, OAuth) -->

### 2.2 Headers
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

## 3. Error Handling
### 3.1 HTTP Status Codes
| Code | Meaning |
|------|---------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |

### 3.2 Error Response Format
```json
{
  "error": {
    "code": "ERR_CODE",
    "message": "Description"
  }
}
```

## 4. Endpoints
### 4.1 Resource Endpoint
#### GET /resource/{id}
##### Parameters
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | string | Yes | Resource identifier |

##### Response
```json
{
  "id": "string",
  "name": "string"
}
```

### 4.2 Collection Endpoint
#### POST /resources
##### Request Body
```json
{
  "name": "string"
}
```

##### Response
```json
{
  "id": "string",
  "createdAt": "ISO8601"
}