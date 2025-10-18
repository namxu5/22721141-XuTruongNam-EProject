const express = require("express");
const mongoose = require("mongoose");
const Order = require("./models/order");
const amqp = require("amqplib");
const config = require("./config");

class App {
  constructor() {
    this.app = express();
    this.connectDB();
    this.setupOrderConsumer();
  }

  async connectDB() {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  }

  async disconnectDB() {
    await mongoose.disconnect();
    console.log("🛑 MongoDB disconnected");
  }

  // 🧩 Hàm kết nối RabbitMQ có retry
  async connectToRabbitMQ(retries = 10, delay = 5000) {
    const amqpServer = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

    for (let i = 0; i < retries; i++) {
      try {
        const connection = await amqp.connect(amqpServer);
        console.log("✅ Connected to RabbitMQ");
        return connection;
      } catch (err) {
        console.warn(`⏳ RabbitMQ not ready (retry ${i + 1}/${retries})`);
        await new Promise(res => setTimeout(res, delay));
      }
    }

    throw new Error("❌ Failed to connect to RabbitMQ after multiple retries");
  }

  async setupOrderConsumer() {
    console.log("Connecting to RabbitMQ...");

    // Thêm delay nhỏ để chắc chắn RabbitMQ container đã start
    setTimeout(async () => {
      try {
        const connection = await this.connectToRabbitMQ();
        const channel = await connection.createChannel();
        await channel.assertQueue("orders");
        console.log("📥 Listening for messages on 'orders' queue...");

        channel.consume("orders", async (data) => {
          console.log("📦 Consuming ORDER message...");
          const { products, username, orderId } = JSON.parse(data.content);

          // Tạo order mới
          const newOrder = new Order({
            products,
            user: username,
            totalPrice: products.reduce((acc, product) => acc + product.price, 0),
          });

          // Lưu vào MongoDB
          await newOrder.save();

          // Gửi ACK để RabbitMQ biết message này xử lý xong
          channel.ack(data);
          console.log("✅ Order saved & ACK sent");

          // Gửi thông điệp sang hàng đợi 'products'
          const { user, products: savedProducts, totalPrice } = newOrder.toJSON();
          channel.sendToQueue(
            "products",
            Buffer.from(JSON.stringify({ orderId, user, products: savedProducts, totalPrice }))
          );

          console.log("➡️ Sent order data to 'products' queue");
        });

      } catch (err) {
        console.error("❌ Failed to setup RabbitMQ consumer:", err.message);
      }
    }, 5000); // giảm delay xuống 5s (có retry nên không cần 15–19s nữa)
  }

  start() {
    this.server = this.app.listen(config.port, () =>
      console.log(`🚀 Server started on port ${config.port}`)
    );
  }

  async stop() {
    await mongoose.disconnect();
    this.server.close();
    console.log("🛑 Server stopped");
  }
}

module.exports = App;
