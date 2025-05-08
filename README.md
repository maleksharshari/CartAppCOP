🛒 Shopping Cart Project
This repository contains two microservices:

1️⃣ ShoppingCartApi (backend)
2️⃣ ShoppingCart02 (frontend app)

📦 1️⃣ ShoppingCartApi
A Spring Boot backend API that:

Connects to MongoDB.

Exposes REST endpoints to serve data for the shopping cart app.

✅ Features:
CRUD operations for cart items.

Product catalog API.

Secure and modular design.

🖥️ 2️⃣ ShoppingCart02
A frontend app that consumes the API.

⚠️ Important:
When setting up ShoppingCart02, you must update the API endpoint URLs in the frontend code to match your machine's IP address (where ShoppingCartApi is running).

For example:

java
Copy
Edit
String API_URL = "http://<YOUR_LOCAL_IP>:8080/api/...";
🔧 Where to change:

Look inside ShoppingCart02/src/api/ (or wherever the API service classes are located) and update the base URL.
