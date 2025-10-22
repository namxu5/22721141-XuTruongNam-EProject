const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const authMiddleware = require("./middlewares/authMiddleware");
const AuthController = require("./controllers/authController");

class App {
  constructor() {
    this.app = express();
    this.authController = new AuthController();
    this.setMiddlewares();
    this.setRoutes();
    this.server = null; // để stop() hoạt động an toàn
  }

  async connectDB() {
    try {
      const mongoURI = config.mongoURI || "mongodb://127.0.0.1:27017/auth_db";
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB connected");
    } catch (err) {
      console.error("❌ MongoDB connection failed:", err.message);
      process.exit(1);
    }
  }

  async disconnectDB() {
    await mongoose.disconnect();
    console.log("🛑 MongoDB disconnected");
  }

  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  setRoutes() {
    this.app.post("/login", (req, res) => this.authController.login(req, res));
    this.app.post("/register", (req, res) => this.authController.register(req, res));
    this.app.get("/dashboard", authMiddleware, (req, res) => res.json({ message: "Welcome to dashboard" }));
  }

  async start() {
    await this.connectDB(); // 👈 đảm bảo kết nối MongoDB xong rồi mới start server
    const port = process.env.PORT || 3000;
    this.server = this.app.listen(port, () => console.log(`🚀 Server started on port ${port}`));
  }

  async stop() {
    await mongoose.disconnect();
    if (this.server) this.server.close();
    console.log("🛑 Server stopped");
  }
}

module.exports = App;
