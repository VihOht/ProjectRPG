# RPG Project Backend API
**Version:** 1.0.0

## OpenAPI-Style Documentation

### Base URL

```http
/api
```

### Authentication

Protected endpoints require:

```http
Authorization: Bearer <jwt_token>
```

---

# Security

| Role | Permissions |
|--------|------------|
| PLAYER | Own characters |
| ADMIN | Full access |

---

# Authentication

## POST /auth/register

### Request

```json
{
  "username": "player1",
  "email": "player@mail.com",
  "password": "123456",
  "role": "PLAYER"
}
```

### Responses

#### 201

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "player1",
    "email": "player@mail.com",
    "role": "PLAYER"
  }
}
```

#### 400

```json
{
  "message": "Username already exists"
}
```

---

## POST /auth/login

### Request

```json
{
  "username": "player1",
  "password": "123456"
}
```

### 200

```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "player1",
    "email": "player@mail.com",
    "role": "PLAYER"
  }
}
```

### 401

```json
{
  "message": "Invalid username or password"
}
```

---

# Characters

## Character Schema

```json
{
  "id": 1,
  "own": 1,
  "name": "Aragorn",
  "charClass": 1,
  "subclass": 1,
  "second_class": null,
  "race": 1,
  "gender": "Male",
  "age": 35,
  "level": 5,
  "experience": 1000,
  "att_life": 10,
  "att_defense": 5,
  "att_sanity": 0,
  "att_ocultism": 0,
  "att_mana": 0,
  "offset_life": 0,
  "offset_defense": 0,
  "offset_sanity": 0,
  "offset_ocultism": 0,
  "offset_mana": 0,
  "life": 100,
  "defense": 20,
  "sanity": 80,
  "ocultism": 0,
  "mana": 0,
  "attributes": [],
  "abilities": [],
  "active": true,
  "is_player": true,
  "descricao_fisica": "",
  "descricao_psicologica": "",
  "historia": ""
}
```

## POST /api/characters

Create Character

### Request

```json
{
  "name": "Aragorn",
  "charClass": 1,
  "subclass": 1,
  "race": 1,
  "gender": "Male",
  "age": 35
}
```

### 201

```json
{
  "message": "Character created successfully",
  "character": {}
}
```

---

## GET /api/characters

### 200

```json
{
  "characters": []
}
```

---

## GET /api/characters/{id}

### 200

```json
{
  "character": {},
  "stat_limits": {
    "life": {
      "base_max": 100,
      "bonus_max": 20,
      "total_max": 120
    }
  }
}
```

### 403

```json
{
  "message": "Unauthorized"
}
```

### 404

```json
{
  "message": "Character not found"
}
```

---

## PUT /api/characters/{id}/general

Update General Information

## PUT /api/characters/{id}/stats

Update Character Stats

## PUT /api/characters/{id}/stats-offset

ADMIN ONLY

## DELETE /api/characters/{id}

PLAYER → deactivate

ADMIN → permanent delete

---

# Attributes

## Schema

```json
{
  "id": 1,
  "name": "Strength",
  "description": "Physical power"
}
```

## Routes

| Method | Route | Access |
|----------|---------|---------|
| GET | /api/attributes | Authenticated |
| POST | /api/attributes | ADMIN |
| GET | /api/attributes/{id} | Authenticated |
| PUT | /api/attributes/{id} | ADMIN |
| DELETE | /api/attributes/{id} | ADMIN |

---

# Pericias

## Schema

```json
{
  "id": 1,
  "name": "Swordsmanship",
  "description": "Use of swords",
  "attribute_id": 1
}
```

## Routes

| Method | Route | Access |
|----------|---------|---------|
| GET | /api/pericias | Authenticated |
| POST | /api/pericias | ADMIN |
| GET | /api/pericias/{id} | Authenticated |
| PUT | /api/pericias/{id} | ADMIN |
| DELETE | /api/pericias/{id} | ADMIN |

---

# Races

## Schema

```json
{
  "id": 1,
  "name": "Human",
  "description": "Default race",
  "hidden": false
}
```

## Routes

| Method | Route | Access |
|----------|---------|---------|
| GET | /api/races | Authenticated |
| POST | /api/races | ADMIN |
| GET | /api/races/{id} | Authenticated |
| PUT | /api/races/{id} | ADMIN |
| DELETE | /api/races/{id} | ADMIN |
| POST | /api/races/{id}/visibility | ADMIN |

---

# Classes

## Class Schema

```json
{
  "id": 1,
  "name": "Warrior",
  "description": "Frontline fighter",
  "base_life": 100,
  "base_defense": 20,
  "base_sanity": 50,
  "base_mana": 0,
  "base_ocultism": 0,
  "has_mana": false,
  "has_ocultism": false,
  "abilities": [],
  "classPowers": [],
  "subclasses": []
}
```

## Routes

| Method | Route |
|----------|---------|
| GET | /api/classes |
| POST | /api/classes |
| GET | /api/classes/{id} |
| PUT | /api/classes/{id} |
| DELETE | /api/classes/{id} |

---

# Abilities

## Schema

```json
{
  "id": 1,
  "name": "Shield Bash",
  "description": "Attack with shield",
  "class_id": 1,
  "subclass_id": null,
  "hidden": false
}
```

## Routes

| Method | Route |
|----------|---------|
| GET | /api/abilities |
| POST | /api/abilities |
| GET | /api/abilities/{id} |
| PUT | /api/abilities/{id} |
| DELETE | /api/abilities/{id} |
| POST | /api/abilities/{id}/toggle |

---

# Class Powers

| Method | Route |
|----------|---------|
| GET | /api/class-powers |

---

# Conversion Rules

## Schema

```json
{
  "id": 1,
  "attribute_id": 1,
  "stat": "life",
  "rate": 2
}
```

Routes:

- GET /api/conversion-rules
- GET /api/conversion-rules/{id}
- POST /api/conversion-rules
- PUT /api/conversion-rules/{id}

---

# Level Up Rules

## Schema

```json
{
  "id": 1,
  "level": 5,
  "experience_required": 1500
}
```

Routes:

- GET /api/level-up-rules
- GET /api/level-up-rules/{id}
- POST /api/level-up-rules
- PUT /api/level-up-rules/{id}

---

# Lore

## Session Schema

```json
{
  "id": 1,
  "name": "Session 01",
  "description": "Introduction",
  "documents": [],
  "images": []
}
```

## Routes

| Method | Route | Access |
|----------|---------|---------|
| GET | /api/lore/sessions | Authenticated |
| GET | /api/lore/sessions/{id} | Authenticated |
| POST | /api/lore/sessions | ADMIN |
| DELETE | /api/lore/sessions/{id} | ADMIN |
| POST | /api/lore/sessions/{id}/documents | ADMIN |
| DELETE | /api/lore/documents/{id} | ADMIN |
| POST | /api/lore/sessions/{id}/images | ADMIN |
| DELETE | /api/lore/images/{id} | ADMIN |
| POST | /api/lore/documents/{id}/subdocuments | ADMIN |
| DELETE | /api/lore/subdocuments/{id} | ADMIN |

---

# Common Error Responses

## 400

```json
{
  "message": "Missing required fields"
}
```

## 401

```json
{
  "message": "Token is missing"
}
```

## 403

```json
{
  "message": "Unauthorized"
}
```

## 404

```json
{
  "message": "Resource not found"
}
```
