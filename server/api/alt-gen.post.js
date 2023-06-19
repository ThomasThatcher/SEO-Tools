//import { pipeline } from '@xenova/transformers';
import { HfInference } from "@huggingface/inference";

const HF_ACCESS_TOKEN = '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';
const inference = new HfInference(HF_ACCESS_TOKEN);

export default defineEventHandler(async (event) => {
    const data = await readBody(event)
    var results = await inference.imageToText({
        data: await (await fetch(data.url)).blob(), 
        //model: 'nlpconnect/vit-gpt2-image-captioning',  
        model: 'Salesforce/blip-image-captioning-base',
    }); 
    //console.log(results)
    return results
})