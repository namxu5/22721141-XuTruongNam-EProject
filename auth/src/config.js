require("dotenv").config({ path: "../.env" }); // Nếu .env nằm ở thư mục gốc

// Phát hiện môi trường đang chạy CI/CD
const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

module.exports = {
  port: process.env.PORT || 3002,

  // ✅ Ưu tiên MongoDB localhost khi CI/CD (GitHub Actions không có container MongoDB)
  mongoURI:
    process.env.MONGODB_AUTH_URI ||
    (isCI
      ? "mongodb://127.0.0.1:27017/auth_db"
      : "mongodb://localhost:27017/auth_db"),

  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",

  // ✅ Khi CI/CD → không có RabbitMQ container → dùng localhost
  rabbitMQURI:
    process.env.RABBITMQ_URI ||
    (isCI
      ? "amqp://guest:guest@localhost:5672"
      : "amqp://guest:guest@rabbitmq:5672"),

  queueName: "products_queue",
};
