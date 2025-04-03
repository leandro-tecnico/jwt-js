require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('./authMiddleware');

const app = express();
app.use(bodyParser.json());

// Banco de dados simulado (em produção, use um banco de dados real)
const users = [{"username":"Leandro", "password":'123'}];

// Rota de registro
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Verifica se o usuário já existe
        if (users.find(user => user.username === username)) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        // Criptografa a senha
        //const hashedPassword = await bcrypt.hash(password, 10);
        
        // Salva o usuário no "banco de dados"
       // const user = { username, password: hashedPassword };
        const user = { username, password };
        users.push(user);
        
        res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
});

// Rota de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
        
    // Encontra o usuário
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
    }
    
    // Verifica a senha
    //const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = password==user.password ? true : false;
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Senha inválida' });
    }
    
    // Cria o token JWT
    const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    
    res.json({ token });
});

// Rota protegida (requer autenticação)
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ 
        message: 'Esta é uma rota protegida',
        user: req.user 
    });
});
app.get('/sistema', authMiddleware, (req, res) => {
    res.json({ 
        message: 'usuário logado'
    });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});