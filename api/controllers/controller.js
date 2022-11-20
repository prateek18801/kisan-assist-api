const Produce = require('../models/produce');

const { extractProduceName, createProducePrompt, resolveQuery } = require('../utils/openai');

exports.getAnswer = async (req, res, next) => {
    const query = req.query.q && req.query.q.replaceAll(/\?/g, '');
    if (!query) {
        return res.status(400).json({
            ok: false,
            message: 'Ask something first'
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

        return res.status(200).json({
            ok: true,
            message: response
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