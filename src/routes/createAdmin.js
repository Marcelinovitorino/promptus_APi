// scripts/criarAdmin.js
const bcrypt = require('bcrypt');
const { sql } = require('../config/db');

class AdminCreator {
  static async criarAdminManual() {
    const nome = 'Admin';
    const email = 'admin@gmail.com';
    const senhaPura = 'admin';
    const role = 'admin';

    try {
      // Verifica se já existe esse admin
      const [usuarioExistente] = await sql`SELECT * FROM usuarios WHERE email = ${email}`;
      if (usuarioExistente) {
        console.log('❌ Já existe um usuário com esse email.');
        return;
      }

      // Criptografa a senha
      const senhaHash = await bcrypt.hash(senhaPura, 10);

      // Insere o admin
      await sql`
        INSERT INTO usuarios (nome, email, senha, role)
        VALUES (${nome}, ${email}, ${senhaHash}, ${role})
      `;

      console.log('✅ Administrador criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar administrador:', error);
    }
  }
}

AdminCreator.criarAdminManual();
