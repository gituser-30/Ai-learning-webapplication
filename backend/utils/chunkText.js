function splitText(text, chunkSize = 500, overlap = 100){
    const chunks =[];
    let start =0;

    while(start< text.length){
        chunks.push(text.slice(start,start+chunkSize));
        start += chunkSize-overlap
    }

    return chunks;
}

module.exports = splitText;