const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuração de armazenamento
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'promptus_imagens',
    format: async (req, file) => ['jpg', 'png', 'jpeg', 'webp'].find(f => file.originalname.toLowerCase().endsWith(f)) || 'jpg',
    public_id: (req, file) => {
      const nameWithoutExt = file.originalname.split('.').slice(0, -1).join('.');
      return `imagem-${Date.now()}-${nameWithoutExt}`;
    }
  }
});

// Middleware de tratamento de erros do Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' 
        ? 'O arquivo é muito grande (máximo 5MB)' 
        : 'Erro no upload do arquivo'
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Ocorreu um erro no upload'
    });
  }
  next();
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens (JPEG, PNG, WebP) são permitidas'));
    }
  }
});

module.exports = { upload, handleMulterError };