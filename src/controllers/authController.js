const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql } = require('../config/db');

const registerConsultor = async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;

    const hashedPassword = await bcrypt.hash(senha, 10);

    const result = await sql`
      INSERT INTO usuarios (nome, email, senha, role)
      VALUES (${nome}, ${email}, ${hashedPassword}, ${role || 'consultor'})
      RETURNING id, nome, email, role;
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const result = await sql`
      SELECT * FROM usuarios WHERE email = ${email};
    `;

    const user = result[0];

    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

    const senhaOk = await bcrypt.compare(senha, user.senha);

    if (!senhaOk) return res.status(401).json({ error: 'Senha inválida' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no login' });
  }
};

module.exports = {
  registerConsultor,
  login
};
