require("dotenv").config({ path: "../.env" }); // điều chỉnh đường dẫn nếu cần

module.exports = {
  port: process.env.PORT || 3002,
  mongoURI: process.env.MONGODB_AUTH_URI || 'mongodb://mongodb:27017/auth_db',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  rabbitMQURI: process.env.RABBITMQ_URI || 'amqp://guest:guest@rabbitmq:5672',
  queueName: 'products_queue',
};
