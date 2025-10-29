require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse form submissions

app.post('/send-booking', async (req, res) => {
  const { service, date, time, name, phone, email } = req.body;

  if (!service || !date || !time || !name || !phone) {
    return res.status(400).json({ ok: false, message: 'Campos obrigatórios faltando' });
  }

  try {
    // transporter via variáveis de ambiente
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true se porta 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"Site - Agendamento" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.TARGET_EMAIL,
      subject: `Novo agendamento: ${service} - ${date} ${time}`,
      text: `Novo agendamento:\n\nServiço: ${service}\nData: ${date}\nHora: ${time}\nNome: ${name}\nTelefone: ${phone}\nE-mail: ${email || '---'}`,
      html: `<p><strong>Serviço:</strong> ${service}</p>
             <p><strong>Data:</strong> ${date}</p>
             <p><strong>Hora:</strong> ${time}</p>
             <p><strong>Nome:</strong> ${name}</p>
             <p><strong>Telefone:</strong> ${phone}</p>
             <p><strong>E-mail:</strong> ${email || '---'}</p>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ ok: true, message: 'Email enviado' });
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    res.status(500).json({ ok: false, message: 'Erro ao enviar email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
