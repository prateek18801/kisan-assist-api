const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const Produce = require('../models/produce');

exports.extractProduceName = async (query) => {
    const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new OpenAIApi(config);

    try {
        
        // read query_produce_name.txt file
        let content = fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'query_produce_name.txt')).toString();
        // append new query to file content
        content += `\nQ. ${query}\nA.`;
        

        const completion = await openai.createCompletion({
            model: 'text-davinci-002',
            prompt: content
        });
        
        return completion.data.choices[0].text;

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
    // fetch prompt for banana
    // generate similar prompt for produce(openai)
    // save new prompt on database
    // return the generated prompt
}