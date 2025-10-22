require("dotenv").config({ path: "../.env" }); // nếu .env nằm trong thư mục gốc (ngang hàng với thư mục auth)

module.exports = {
  port: process.env.PORT || 3002,
  
  // 👉 Ưu tiên localhost khi CI/CD (vì GitHub Actions không có container "mongodb")
  mongoURI: process.env.MONGODB_AUTH_URI || "mongodb://127.0.0.1:27017/auth_db",
  
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
  rabbitMQURI: process.env.RABBITMQ_URI || "amqp://guest:guest@localhost:5672",
  
  queueName: "products_queue",
};
