# API Routes

Base URL: `/api`

## Common rules
- Every route outside `/auth` requires `Authorization: Bearer <token>`.
- Admin-only routes return `403` with `{"message": "Admin only"}` when the user is not an admin.
- Missing resources return `404` with a `message` field.
- Validation errors return `400` with a `message` field.

## Auth

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | `{"message", "user"}` |
| POST | `/auth/login` | No | `{"message", "token", "user"}` |
| GET | `/auth/verify` | Yes | `{"message", "user"}` |
| GET | `/auth/me` | Yes | `{"user"}` |
| GET | `/auth/users` | Yes, admin | `{"users": [...]}` |

## Abilities

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| GET | `/api/abilities` | Yes | `{"abilities": [{id, name, description, class_id, subclass_id}]}` |
| POST | `/api/abilities` | Yes, admin | `{"message", "ability"}` |
| GET | `/api/abilities/:ability_id` | Yes | `{"ability": {id, name, description, class_id, subclass_id, hidden}}` |
| PUT | `/api/abilities/:ability_id` | Yes, admin | `{"message", "ability"}` |
| DELETE | `/api/abilities/:ability_id` | Yes, admin | `{"message"}` |
| POST | `/api/abilities/:ability_id/toggle` | Yes, admin | `{"message", "ability"}` |

## Races

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| GET | `/api/races` | Yes | `{"races": [{id, name, description, hidden}]}` |
| POST | `/api/races` | Yes, admin | `{"message", "race"}` |
| GET | `/api/races/:race_id` | No | `{"race": {id, name, description, hidden}}` |
| PUT | `/api/races/:race_id` | Yes, admin | `{"message", "race"}` |
| DELETE | `/api/races/:race_id` | Yes, admin | `{"message"}` |
| POST | `/api/races/:race_id/visibility` | Yes, admin | `{"message", "race"}` |

## Attributes

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| GET | `/api/attributes` | No | `{"attributes": [{id, name, description}]}` |
| POST | `/api/attributes` | Yes, admin | `{"message", "attribute"}` |
| GET | `/api/attributes/:attribute_id` | No | `{"attribute": {id, name, description}}` |
| PUT | `/api/attributes/:attribute_id` | Yes, admin | `{"message", "attribute"}` |
| DELETE | `/api/attributes/:attribute_id` | Yes, admin | `{"message"}` |

## Pericias

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| GET | `/api/pericias` | No | `{"pericias": [{id, name, description, attribute_id}]}` |
| POST | `/api/pericias` | Yes, admin | `{"message", "pericia"}` |
| GET | `/api/pericias/:pericia_id` | No | `{"pericia": {id, name, description, attribute_id}}` |
| PUT | `/api/pericias/:pericia_id` | Yes, admin | `{"message", "pericia"}` |
| DELETE | `/api/pericias/:pericia_id` | Yes, admin | `{"message"}` |

## Classes

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| GET | `/api/classes` | No | `{"classes": [{id, name, description, abilities, subclasses}]}` |
| POST | `/api/classes` | Yes, admin | `{"message", "class"}` |
| GET | `/api/classes/:class_id` | No | `{"class": {id, name, description, abilities, subclasses}}` |
| PUT | `/api/classes/:class_id` | Yes, admin | `{"message", "class"}` |
| DELETE | `/api/classes/:class_id` | Yes, admin | `{"message"}` |

## Subclasses

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| GET | `/api/subclasses` | No | `{"subclasses": [{id, name, description, class_id, abilities}]}` |
| POST | `/api/subclasses` | Yes, admin | `{"message", "subclass"}` |
| GET | `/api/subclasses/:subclass_id` | No | `{"subclass": {id, name, description, class_id}}` |
| PUT | `/api/subclasses/:subclass_id` | Yes, admin | `{"message", "subclass"}` |
| DELETE | `/api/subclasses/:subclass_id` | Yes, admin | `{"message"}` |

## Character attributes

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| GET | `/api/characters/:character_id/attributes` | Yes | `{"character_id", "attributes", "pericias"}` |
| PUT | `/api/characters/:character_id/attributes` | Yes | `{"message", "character_id"}` |
| PUT | `/api/characters/:character_id/pericias` | Yes | `{"message", "character_id"}` |

`GET /api/characters/:character_id/attributes` returns:
- `attributes`: `[{ attribute_id, name, description, base, bonus, total }]`
- `pericias`: `[{ pericia_id, attribute_id, name, description, base, bonus, total }]`

## Conversion rules

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| GET | `/api/conversion-rules` | Yes | `{"conversion_rules": [{id, attribute_id, stat, rate}]}` |
| GET | `/api/conversion-rules/:rule_id` | Yes | `{"conversion_rule": {id, attribute_id, stat, rate}}` |
| POST | `/api/conversion-rules` | Yes, admin | `{"message", "conversion_rule"}` |
| PUT | `/api/conversion-rules/:rule_id` | Yes, admin | `{"message", "conversion_rule"}` |

## Level up rules

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| GET | `/api/level-up-rules` | Yes, | `{"level_up_rules": [{id, level, experience_required}]}` |
| GET | `/api/level-up-rules/:rule_id` | Yes | `{"level_up_rule": {id, level, experience_required}}` |
| POST | `/api/level-up-rules` | Yes, admin | `{"message", "level_up_rule"}` |
| PUT | `/api/level-up-rules/:rule_id` | Yes, admin | `{"message", "level_up_rule"}` |

## Characters

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| POST | `/api/characters` | Yes | `{"message", "character"}` |
| GET | `/api/characters` | Yes | `{"characters": [...]}` |
| GET | `/api/characters/:character_id` | Yes | `{"character": { ... , stat_limits, base_life, base_defense, base_sanity, base_ocultism, base_mana }}` |
| PUT | `/api/characters/:character_id` | Yes | `{"message", "character"}` |
| POST | `/api/characters/:character_id/activate` | Yes, admin | `{"message"}` |
| POST | `/api/characters/:character_id/deactivate` | Yes, admin | `{"message"}` |
| POST | `/api/characters/:character_id/transfer-ownership/:new_user_id` | Yes, admin | `{"message"}` |
| POST | `/api/characters/:character_id/return-to-admin` | Yes, admin | `{"message"}` |
| DELETE | `/api/characters/:character_id` | Yes | `{"message"}` |

### Character payload notes
- `character` responses include the fields used by the sheet: `id`, `own`, `name`, `charClass`, `subclass`, `second_class`, `race`, `gender`, `age`, `level`, `life`, `defense`, `sanity`, `ocultism`, `mana`, `active`, `is_player`, and `stat_limits` when available.
- `stat_limits` uses the shape `{ life, defense, sanity, ocultism, mana }`, each with `{ base_max, bonus_max, total_max }`.

## Useful request bodies

### Create or update character
```json
{
  "name": "Astra",
  "charClass": 1,
  "subclass": 2,
  "second_class": 3,
  "race": 4,
  "gender": "F",
  "age": 19,
  "level": 1,
  "life": 10,
  "defense": 10,
  "sanity": 10,
  "ocultism": 10,
  "mana": 10,
  "backstory": "...",
  "physical_description": "...",
  "Psycological_description": "..."
}
```

### Update character attributes
```json
{
  "attributes": [
    { "attribute_id": 1, "base": 10, "bonus": 2 }
  ]
}
```

### Update character pericias
```json
{
  "pericias": [
    { "pericia_id": 1, "base": 5, "bonus": 1 }
  ]
}
```
