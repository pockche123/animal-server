
const db = require('../database/connect')

class Cat {


    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.type = data.type
        this.description = data.description
        this.habitat = data.habitat
    }

    static getAll() {
        return new Promise(async (resolve, reject) => {
            try {
                const catsData = await db.query("SELECT * FROM cats");
                const cats = catsData.rows.map(cat => new Cat(cat));
                resolve(cats)
            } catch (error) {
                reject('error retrieving cats')
            }
        })
    }

    static async findById(catId) {
        const catData = await db.query("SELECT * FROM cats WHERE id = $1", [catId]);
        if (!catData.rows.length) {
            throw new Error("Unable to locate cat")
        }
        return new Cat(catData.rows[0]);
    }

    static async create(data) {
        const { name, type, description, habitat } = data;
        const catData = await db.query("INSERT INTO cats (name, type, description, habitat) VALUES ($1, $2, $3, $4) RETURNING *;", [name, type, description, habitat]);
        const newCat = new Cat(catData.rows[0])
        return newCat
    }

    async update(data) {
        try {
            const { id, name, type, description, habitat } = data;

            const existingCat = await Cat.findById(id);

            if (!existingCat) {
                throw new Error('Cat not found');
            }

            const updatedCatData = await db.query(
                'UPDATE cats SET name = $2, type = $3, description = $4, habitat = $5 WHERE id = $1 RETURNING *;',
                [id, name || existingCat.name, type || existingCat.type, description || existingCat.description, habitat || existingCat.habitat]
            );

            const updatedCat = new Cat(updatedCatData.rows[0]);
            return updatedCat;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async delete() {
        const catData = await db.query("SELECT * FROM cats WHERE id = $1", [this.id]);


        if (catData) {
         await db.query("DELETE FROM cats WHERE id = $1 RETURNING *;", [this.id]);
        return 'Cat was deleted'  
        } else {
            throw new Error('Cat not found')
        }
    }
}

module.exports = Cat