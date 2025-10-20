const AuthService = require("../services/authService");

/**
 * Class to encapsulate the logic for the auth routes
 */
class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    const { username, password } = req.body;

    try {
      const result = await this.authService.login(username, password);

      if (result.success) {
        return res.status(200).json({ token: result.token });
      } else {
        return res.status(400).json({ message: result.message });
      }
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async register(req, res) {
    const user = req.body;

    try {
      // Tìm user đã tồn tại
      const existingUser = await this.authService.findUserByUsername(user.username);

      if (existingUser) {
        // Trả response trực tiếp thay vì throw
        console.log("Username already taken");
        return res.status(400).json({ message: "Username already taken" });
      }

      // Tạo user mới
      const result = await this.authService.register(user);
      return res.status(200).json(result);
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getProfile(req, res) {
    const userId = req.user.id;

    try {
      const user = await this.authService.getUserById(userId);
      return res.status(200).json(user);
    } catch (err) {
      console.error("Get profile error:", err);
      return res.status(400).json({ message: err.message });
    }
  }
}

module.exports = AuthController;
