require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ROTAS
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/auth", authRoutes);

//INICIALIZAÇÃO
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
