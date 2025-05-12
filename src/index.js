const express = require('express');
const categoriaRoutes = require('./routes/Categoria');
const localizacaoRoutes = require('./routes/localizacao');
const imovelRoutes = require('./routes/imovel');
const app = express();

app.use(express.json());  // Middleware para tratar JSON


app.use('/', categoriaRoutes);
app.use('/', localizacaoRoutes);
app.use('/', imovelRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
