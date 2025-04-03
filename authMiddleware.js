const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Obtém o token do header Authorization
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({message: 'Acesso negado','error':'Token não fornecdo' });
        }
        
        // Verifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Acesso negado','error':'Token inválido' });
    }
};