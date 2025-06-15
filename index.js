
const express = require('express');
const cors = require('cors');
const categoriaRoutes = require('./src/routes/Categoria');
const localizacaoRoutes = require('./src/routes/localizacao');
const imovelRoutes = require('./src/routes/imovel');
const imoveisRoutes = require('./src/routes/imovel');
const terrenoROutes = require('./src/routes/terreno');
const authRoutes = require('./src/routes/auth');


const app = express();

app.use(express.json());
app.use(cors()); 
require('dotenv').config(); // Middleware para tratar JSON

app.use('/', categoriaRoutes);
app.use('/', localizacaoRoutes);
app.use('/', imovelRoutes);
app.use('/', imoveisRoutes);
app.use('/', terrenoROutes);
app.use('/', authRoutes);
console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME); 


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
