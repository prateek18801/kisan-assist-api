const Raq = require('../models/raq');
const Produce = require('../models/produce');

const { extractProduceName, createProducePrompt, resolveQuery } = require('../utils/openai');

exports.getAnswer = async (req, res, next) => {
    let query = req.query.q;

    if (!query) {
        return res.status(400).json({
            ok: false,
            message: 'Empty input received'
        });
    }
    try {
        // extract the produce name from the incoming query
        const produce = await extractProduceName(query);

        // find the prompt for the produce in db
        let saved = await Produce.findOne({ produce_name: produce });

        // if prompt does not exist create a prompt
        if (!saved) {
            saved = await createProducePrompt(produce);
        }

        // generate response from prompt and query
        const response = await resolveQuery(saved, query);

        res.status(200).json({
            ok: true,
            message: response
        });

        await new Raq({ question: query, answer: response }).save();

    } catch (err) {
        next(err);
    }
}

exports.getRaq = async (req, res, next) => {
    try {
        const questions = await Raq.find({}).sort({ createdAt: -1 }).limit(10);

        return res.status(200).json({
            ok: true,
            questions
        });
    } catch (err) {
        next(err);
    }
}


exports.registerProduce = async (req, res, next) => {
    const { produce_name, description } = req.body;
    try {
        const saved = await new Produce({
            produce_name: produce_name.toLowerCase(),
            description: description.replaceAll(/ Q\. /g, '\nQ. ').replaceAll(/ A\. /g, '\nA. ')
        }).save();

        return res.status(201).json({
            ok: true,
            message: 'created',
            data: saved
        });
    } catch (err) {
        next(err);
    }
}

