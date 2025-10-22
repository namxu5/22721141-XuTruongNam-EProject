require("dotenv").config({ path: "../.env" }); // đọc biến từ file .env ở thư mục gốc

// Xác định có đang chạy trong môi trường CI/CD hay không
const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

module.exports = {
  port: process.env.PORT || 3001,

  // ✅ MongoDB
  mongoURI: isCI
    ? "mongodb://127.0.0.1:27017/product_db" // dùng localhost trong GitHub Actions
    : process.env.MONGODB_PRODUCT_URI || "mongodb://mongodb:27017/product_db", // dùng container 'mongodb' trong Docker

  // ✅ RabbitMQ
  rabbitMQURI: isCI
    ? "amqp://guest:guest@localhost:5672" // GitHub Actions: không có container rabbitmq → dùng localhost
    : process.env.RABBITMQ_URI || "amqp://guest:guest@rabbitmq:5672", // Docker Compose: có container rabbitmq

  queueName: "products_queue",
};
