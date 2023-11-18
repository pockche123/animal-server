const db = require('../database/connect'); 

class User {
    
    constructor({ id, username, password, is_admin }) {
        this.id = id; 
        this.username = username; 
        this.password = password; 
        this.is_admin = is_admin; 
    }

    static getAll() {
        return new Promise(async (resolve, reject) => {
            try {
                const usersData = await db.query("SELECT * FROM users");
                const users = usersData.rows.map(cat => new User(user));
                resolve(users)
            } catch (error) {
                reject('error retrieving users')
            }
        })
    }
    static async findById(id) {
        const response = await db.query("SELECT  * FROM users Where id = $1", [id])
        if (!response.rows.length) {
            throw new Error("Unable to locate user")
        }
        return new User(response.rows[0])
    }

    static async getByUsername(username) {
        const response = await db.query("SELECT * FROM users Where username = $1", [username])
        if (!response.rows.length) { 
        throw new Error("Unable to locate user")
        }
        return new User(response.rows[0])
    }

    static async create({ username, password, isAdmin }) {
        let response = await db.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id;", [username, password]); 
        const newId = response.rows[0].id; 
        const newUser = await User.findById(newId); 
        return newUser; 
    }


}

module.exports = User