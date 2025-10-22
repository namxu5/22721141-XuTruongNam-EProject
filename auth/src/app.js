const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const authMiddleware = require("./middlewares/authMiddleware");
const AuthController = require("./controllers/authController");

class App {
  constructor() {
    this.app = express();
    this.authController = new AuthController(); // ✅ THÊM DÒNG NÀY
    this.connectDB();
    this.setMiddlewares();
    this.setRoutes();
  }

  async connectDB() {
    try {
      await mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB connected");
    } catch (err) {
      console.error("❌ MongoDB connection error:", err.message);
      process.exit(1);
    }
  }

  async disconnectDB() {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }

  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  setRoutes() {
    this.app.post("/login", (req, res) => this.authController.login(req, res));
    this.app.post("/register", (req, res) =>
      this.authController.register(req, res)
    );
    this.app.get("/dashboard", authMiddleware, (req, res) =>
      res.json({ message: "Welcome to dashboard" })
    );
  }

  start() {
    const port = process.env.PORT || 3000; // ✅ Lấy port từ .env
    this.server = this.app.listen(port, () =>
      console.log(`🚀 Server started on port ${port}`)
    );
  }

  async stop() {
    await this.disconnectDB();
    this.server.close(() => console.log("🛑 Server stopped"));
  }
}

module.exports = App;
