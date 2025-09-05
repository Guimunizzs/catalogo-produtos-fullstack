const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../config/database");
const verifyToken = require("../middlewares/authMiddlewares").verifyToken;

const router = express.Router();

const uploadsDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage: storage });

// Rotas

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produto" });
  }
});

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  const { name, description, price } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await pool.query(
      "INSERT INTO products (name, descripition, price, image_path) VALUES (?, ?, ?, ?)",
      [name, description, price, imagePath]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar produto" });
  }
});

router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, descripition, price } = req.body;
  let imagePath = req.body.existing_image_path || null;

  try {
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      const [oldProduct] = await pool.query(
        "SELECT image_path FROM products WHERE id = ?",
        [id]
      );
      if (oldProduct.length > 0 && oldProduct[0].image_path) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "..",
          oldProduct[0].image_path
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    await pool.query(
      "UPDATE products SET name = ?, descripition = ?, price = ?, image_path = ? WHERE id = ?",
      [name, descripition, price, imagePath, id]
    );

    res.status(200).json({ message: `Produto ${id} atualizado com sucesso` });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ message: "Erro ao atualizar produto" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT image_path FROM products WHERE id = ?",
      [id]
    );
    if (rows.length > 0 && rows[0].image_path) {
      const imagePath = path.join(__dirname, "..", "..", rows[0].image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    res.status(200).json({ message: `Produto ${id} deletado com sucesso` });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar produto" });
  }
});

module.exports = router;
