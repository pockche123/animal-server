const Cat = require('../model/Cat')

const index = async(req, res) => {
    try {
        const cats = await Cat.getAll();
        res.status(200).json(cats);
    } catch (err) {
        res.status(500).json({"error": err.message})
    }
}

const show = async(req, res) => {
    try {
        const catId = parseInt(req.params.id)
        const cat = await Cat.findById(catId)
        res.status(200).send({catData: cat})
    } catch (error) {
        res.status(404).send({error: error.message})
    }
}

const create = async(req, res) => {
    try {
        const data = req.body 
        const newCat = await Cat.create(data)
        res.status(201).send({data: newCat})
    } catch (error) {
        res.status(400).send({error: error.message})
    }
}

const update = async(req, res) => {
    try {
        const catToUpdate = await Cat.findById(parseInt(req.params.id))
            const updatedCatData = {
            id: catToUpdate.id,
            name: req.body.name || catToUpdate.name,
            type: req.body.type || catToUpdate.type,
            description: req.body.description || catToUpdate.description,
            habitat: req.body.habitat || catToUpdate.habitat,
        };

        const updatedCat = await catToUpdate.update(updatedCatData);

        // const updatedCat = await catToUpdate.update(req.body)
        res.status(200).json(updatedCat)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
}

const destroy = async(req, res) => {
    try {
        const catToDelete = await Cat.findById(parseInt(req.params.id))
        await catToDelete.delete()
        res.status(204).end()
    } catch (error) {
        res.status(404).send({error: error.message})
    }
}



module.exports = {index, show, create, update, destroy}