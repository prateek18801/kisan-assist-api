const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const Produce = require('../models/produce');

exports.extractProduceName = async (query) => {
    const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new OpenAIApi(config);

    try {

        let content = fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'extract_produce_name_prompt.txt')).toString();
        content += `\nQ. ${query}\nA.`;

        const completion = await openai.createCompletion({
            model: 'text-davinci-002',
            prompt: content
        });

        return completion.data.choices[0].text.trim();

    } catch (err) {
        if (err.response) {
            console.log(err.response.status);
            console.log(err.response.data);
        } else {
            console.log(err.message);
        }
    }

}

exports.createProducePrompt = async (produce) => {
    const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new OpenAIApi(config);

    try {
        const wheat = await Produce.findOne({ produce_name: 'wheat' });
        const content = `1. ${wheat.produce_name.toUpperCase()}\n${wheat.description}\n\n2. ${produce.toUpperCase()}\n`;

        const completion = await openai.createCompletion({
            model: 'text-davinci-002',
            max_tokens: 300,
            temperature: 0.7,
            prompt: content
        });

        const saved = await new Produce({ 
            produce_name: produce.toLowerCase(), 
            description: completion.data.choices[0].text 
        }).save();

        return saved;

    } catch (err) {
        if (err.response) {
            console.log(err.response.status);
            console.log(err.response.data);
        } else {
            console.log(err.message);
        }
    }
}