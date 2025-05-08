# Shopping Cart API - MongoDB Database Structure

## Database Overview

The Shopping Cart API uses MongoDB as its database. The data is organized into three main collections:

1. **users**: Stores user information and references to their favorites, cart items, and reviews
2. **products**: Stores product information and references to their reviews
3. **reviews**: Stores review information with references to the user and product

## Entity Relationship Diagram

To view a visual representation of the database schema, open:
- `/src/main/resources/static/db_diagram.html` in your browser

## Collections Structure

### Users Collection
```javascript
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "favorites": [
    DBRef("products", ObjectId("...")),
    DBRef("products", ObjectId("..."))
  ],
  "cart": [
    DBRef("products", ObjectId("...")),
    DBRef("products", ObjectId("..."))
  ],
  "reviews": [
    DBRef("reviews", ObjectId("...")),
    DBRef("reviews", ObjectId("..."))
  ]
}
```

### Products Collection
```javascript
{
  "_id": ObjectId("..."),
  "name": "Product Name",
  "description": "Product description...",
  "price": 99.99,
  "imageUrl": "https://example.com/image.jpg",
  "category": "Electronics",
  "reviews": [
    DBRef("reviews", ObjectId("...")),
    DBRef("reviews", ObjectId("..."))
  ]
}
```

### Reviews Collection
```javascript
{
  "_id": ObjectId("..."),
  "user": DBRef("users", ObjectId("...")),
  "product": DBRef("products", ObjectId("...")),
  "rating": 5,
  "comment": "Great product!"
}
```

## Relationships

1. **User-Product (Favorites)**: Many-to-many relationship
   - A user can have many favorite products
   - A product can be favorited by many users

2. **User-Product (Cart)**: Many-to-many relationship
   - A user can have many products in their cart
   - A product can be in many users' carts

3. **User-Review**: One-to-many relationship
   - A user can write many reviews
   - Each review is written by one user

4. **Product-Review**: One-to-many relationship
   - A product can have many reviews
   - Each review is for one product

## MongoDB References

This application uses MongoDB's DBRef to create relationships between documents. DBRef provides a way to reference a document in another collection.

```javascript
{
  "$ref": "collection_name",
  "$id": ObjectId("referenced_document_id")
}
```

For more information about DBRef, see the [MongoDB documentation](https://www.mongodb.com/docs/manual/reference/database-references/).
