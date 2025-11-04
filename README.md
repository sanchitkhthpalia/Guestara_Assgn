# Guestara Menu Backend

Node.js + Express + MongoDB backend for a hierarchical menu management system: Category → Subcategory → Item.

## Features

- CRUD for Category, Subcategory, Item
- Items may belong to a Category directly or to a Subcategory under a Category
- Item search by name (case-insensitive, partial match)
- Mongoose models with validation and sensible defaults
- Subcategory inherits tax flags from its Category if not provided
- Item inherits tax flags from its Subcategory (if provided) else Category
- Item `totalAmount` auto-computed as `baseAmount - discount` (never negative)
- Modular structure (models, controllers, routes)
- Centralized error handling
- Ready to run with npm install + npm start

## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- Morgan, body-parser, CORS, dotenv

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB running locally (or Atlas connection string)

### Installation

```bash
npm install
```

### Run

```bash
# copy env
cp .env.example .env
# or create .env manually

npm start
# Server: http://localhost:4000
# Health: http://localhost:4000/health
```

### Environment

Create a `.env` file in the project root:

```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/guestara
```

---

## Project Structure

```
guestara-backend/
├── models/
│   ├── Category.js
│   ├── Subcategory.js
│   └── Item.js
├── routes/
│   ├── category.js
│   ├── subcategory.js
│   └── item.js
├── controllers/
│   ├── categoryController.js
│   ├── subcategoryController.js
│   └── itemController.js
├── server.js
├── .env.example
├── package.json
└── README.md
```

---

## API Summary

Base URL: `http://localhost:4000`

### Category

- POST `/api/categories` → Create category
- GET `/api/categories` → Get all categories
- GET `/api/categories/:id` → Get category by ID
- GET `/api/categories/name/:name` → Get category by name
- PUT `/api/categories/:id` → Edit category

### Subcategory

- POST `/api/subcategories` → Create subcategory under category
- GET `/api/subcategories` → Get all subcategories
- GET `/api/subcategories/category/:categoryId` → Get subcategories under a category
- GET `/api/subcategories/name/:name` → Get subcategory by name
- GET `/api/subcategories/:id` → Get subcategory by ID
- PUT `/api/subcategories/:id` → Edit subcategory

### Item

- POST `/api/items` → Create item under subcategory or category
- GET `/api/items` → Get all items
- GET `/api/items/category/:categoryId` → Get items under category
- GET `/api/items/subcategory/:subcategoryId` → Get items under subcategory
- GET `/api/items/:id` → Get item by ID
- GET `/api/items/name/:name` → Get item by exact name
- GET `/api/items/search/:name` → Search items by name
- PUT `/api/items/:id` → Edit item

---

## Request/Response Examples (Postman-ready)

### Create Category

POST `/api/categories`
```json
{
  "name": "Beverages",
  "image": "https://example.com/bev.png",
  "description": "Drinks and more",
  "taxApplicable": true,
  "tax": 5,
  "taxType": "percent"
}
```

### Create Subcategory

POST `/api/subcategories`
```json
{
  "categoryId": "<CATEGORY_ID>",
  "name": "Hot",
  "image": "",
  "description": "Hot drinks"
}
```

### Create Item (under Category directly)

POST `/api/items`
```json
{
  "categoryId": "<CATEGORY_ID>",
  "name": "Mineral Water",
  "baseAmount": 20,
  "discount": 2
}
```

### Create Item (under Subcategory)

POST `/api/items`
```json
{
  "categoryId": "<CATEGORY_ID>",
  "subcategoryId": "<SUBCATEGORY_ID>",
  "name": "Espresso",
  "baseAmount": 100,
  "discount": 10
}
```

### Search Items by Name

GET `/api/items/search/esp`

### Update Item

PUT `/api/items/:id`
```json
{
  "discount": 15
}
```

---

## Validation & Behaviors

- Subcategory inherits `taxApplicable` and `tax` from its Category if not provided.
- Item inherits tax fields from Subcategory (if provided) else Category.
- Item `totalAmount` auto-computed on create and update as `max(0, baseAmount - discount)`.
- Unique constraints:
  - Category name is unique
  - Subcategory name is unique within a Category

---

## Why MongoDB?

- Flexible schema fits evolving menu/item attributes.
- Document model maps naturally to categories/subcategories/items.
- Strong ecosystem (Mongoose) for validation and relations.

## What I Learned (3)

- Designing inheritance of fields across related documents using pre-validate hooks.
- Building clean Express modules with controllers and centralized error handling.
- Balancing unique constraints with flexible querying (regex search, compound indexes).

## Most Difficult Part

- Ensuring correct defaulting logic for tax fields across Category → Subcategory → Item while keeping updates idempotent and validations intact.

## With More Time

- Add pagination, sorting, and filtering to list endpoints.
- Add request validation with a schema validator (e.g., Zod/Joi).
- Introduce soft deletes and audit logs.
- Add OpenAPI/Swagger docs and Postman collection.

---

## License

MIT
