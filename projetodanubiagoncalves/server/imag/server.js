// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor do Studio Danúbia está rodando!');
});

// Rota para receber o formulário
app.post('/enviar', async (req, res) => {
  const { nome, email, telefone, mensagem } = req.body;

  // Configuração do Gmail via senha de app
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // seu email
      pass: process.env.EMAIL_PASS  // senha de app
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Novo agendamento de ${nome}`,
    text: `
      Nome: ${nome}
      E-mail: ${email}
      Telefone: ${telefone}
      Mensagem: ${mensagem}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ success: false, message: 'Erro ao enviar o e-mail.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
