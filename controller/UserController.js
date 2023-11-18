const bcrypt = require('bcrypt'); 
const User = require('../model/User'); 
const Token = require('../model/Token'); 

async function register(req, res) {
    try {
        const data = req.body; 
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS)); 
        data["password"] = await bcrypt.hash(data["password"], salt); 
        const result = await User.create(data); 
        res.status(201).send(result); 
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
}

async function login(req, res) {
    try {
        const data = req.body 
        const user = await User.getByUsername(data.username); 
        const authenticated = await bcrypt.compare(data.password, user["password"]); 
        if (!authenticated) {
            throw new Error("Incorrect credentials")
        } else {
            const token = await Token.create(user["id"])
            res.status(200).json({authenticated: true, token: token.token})
        }
    } catch (error) {
            res.status(403).json({error: error.message})
    }
}

module.exports = {register, login}