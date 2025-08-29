const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/database");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Usuário e senha são obrigatórios" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO admin_users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Usuário já existe" });
    }
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM admin_users WHERE username = ?",
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }
    const user = rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ message: "Login realizado com sucesso", token });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({ message: "Erro ao realizar login" });
  }
});

module.exports = router;
