const Produce = require('../models/produce');

const { extractProduceName, createProducePrompt } = require('../utils/openai');

exports.getAnswer = async (req, res, next) => {
    const query = req.query.q;

}


exports.registerProduce = async (req, res, next) => {
    const { produce_name, description } = req.body;
    console.log(req.body);
    try {
        const saved = await new Produce({
            produce_name: produce_name.toLowerCase(),
            description
        }).save();

        return res.status(201).json({
            ok: true,
            message: 'created'
        });
    } catch (err) {
        next(err);
    }
}