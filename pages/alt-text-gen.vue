<template class="max-w-screen-xl">

    <div class="flex flex-row">
        <div class="basis-1/2">
            <form class="max-w-3xl p-10">
                <label for="message" class="align-middle block mb-2 text-sm font-medium">Image URLs</label>
                <textarea v-model="urls" id="message" rows="25" class="block p-2.5 w-full text-sm rounded-lg border border-gray-100 focus:ring-blue-300 focus:border-blue-500 dark:border-gray-200 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Provide a list of image URLs on each line..."></textarea>
                <button @click.prevent="image_to_text()" class="float-right m-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
        </div>
        <div class="basis-1/2 overflow-scroll h-screen mt-10">
            <section v-for="url of data" class="bg-white dark:bg-gray-200 m-5 rounded-lg">
                <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-4 lg:grid-cols-12">
                    <div class="hidden lg:mt-0 lg:col-span-3 lg:flex">
                        <img class="max-w-full rounded-lg" :src="url.u" alt="mockup">
                    </div>
                    <div class="w-5/6 m-4 mr-auto place-self-center lg:col-span-7">
                        <label class="font-semibold max-w-2xl mb-6 md:text-sm lg:text-sm">Image URL</label>
                        <p class="w-5/6 mb-6 font-light lg:mb-8 md:text-sm lg:text-sm">{{ url.u }}</p>
                        <label class="font-semibold max-w-2xl mb-6 md:text-sm lg:text-sm">Generated ALT Text</label>
                        <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-sm lg:text-sm">{{ url.response.generated_text }}</p>
                    </div>                
                </div>
            </section>
        </div>
    </div>
    <!--<form class="max-w-3xl">
        <label for="message" class="align-middle block mb-2 text-sm font-medium dark:text-white">Your message</label>
        <textarea id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
        <button type="submit" class="m-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
    </form>-->
</template>

<script lang="ts">
//import { pipeline } from '@xenova/transformers';
import { HfInference } from "@huggingface/inference";

const HF_ACCESS_TOKEN = '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';
const inference = new HfInference(HF_ACCESS_TOKEN);

export default {
    data: () => ({
        urls: null,
        data: [],
    }),
    methods: {
        get_urls(){
            return this.urls.split('\n')
        },
        async image_to_text(){
            var urls = this.urls.split('\n')
            var r = []
            for(const url of urls){
                var results = await inference.imageToText({
                    data: await (await fetch(url)).blob(), 
                    model: 'nlpconnect/vit-gpt2-image-captioning',  
                });
                r.push({u: url, response: results})
            }
            this.set_new_data(r)
        },
        set_new_data(d){
            this.data = d
        },
    }
}
</script>
