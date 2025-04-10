const express = require('express');

const jwt = require('jsonwebtoken');

const http = require('http');

const WebSocket = require('ws');

const app = express();


const SECRET_KEY = 'my_secret_key';

const users = [

    { id: 1, username: 'user1', password: 'password1', role: 'user' },

    { id: 2, username: 'admin', password: 'adminpass', role: 'admin' }

];


// Função para gerar token JWT

function generateToken(user) {

    return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

}


// Middleware para autenticação do WebSocket

function authenticateWebSocket(token, cb) {

    if (!token) return cb('Token não fornecido');

    jwt.verify(token, SECRET_KEY, (err, user) => {

        if (err) return cb('Token inválido');

        cb(null, user);

    });

}


// Rota de login

app.post('/login', (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);


    if (user) {

        const token = generateToken(user);

        res.json({ token });

    } else {

        res.sendStatus(401);

    }

});


const server = http.createServer(app);

const wss = new WebSocket.Server({ server });


// Manipulando a conexão WebSocket

wss.on('connection', (ws, req) => {

    const token = req.url.split('?token=')[1];


    authenticateWebSocket(token, (err, user) => {

        if (err) {

            ws.close();

            return;

        }


        ws.on('message', (message) => {

            if (user.role === 'admin') {

                console.log('Admin enviou uma mensagem:', message);

            } else {

                console.log('Usuário enviou uma mensagem:', message);

            }

        });


        ws.send(`Bem-vindo, ${user.role}!`);

    });

});


server.listen(3000, () => {

    console.log('Servidor rodando na porta 3000');

});