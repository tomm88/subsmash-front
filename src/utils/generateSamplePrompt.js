export const generateSamplePrompt = (prompt) => {

    let output = '';
    const data = prompt.prompt_data;

    const randomChoice = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    } 

    for (let i=0; i<data.length; i++) {
        if (data[i].type === 'static') {
            output += data[i].value + ' ';
            continue;
        }
        if (data[i].type === 'random') {
            output += randomChoice(data[i].value) + ' ';
        }
    }

    return output;
}