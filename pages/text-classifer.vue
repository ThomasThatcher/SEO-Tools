<template class="max-w-screen-xl">
    
    <div class="flex flex-row">
        <div class="basis-1/2">
            <form class="max-w-3xl mt-6 ml-10">
                <div class="mb-6">
                    <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900">Categories</label>
                    <input v-model="categories" type="text" id="default-input" placeholder="Provide keyword categories seperated by commas..." class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                </div>

                <label for="message" class="align-middle block mb-2 text-sm font-medium">Keywords</label>
                <textarea v-model="keywords" id="message" rows="25" class="block p-2.5 w-full text-sm rounded-lg border border-gray-100 focus:ring-blue-300 focus:border-blue-500 dark:border-gray-200 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Provide a list of image URLs on each line..." required></textarea>
                <div v-if="form_error">Please ensure you fill out all the fields</div>
                <button @click.prevent="classify_text()" class="float-right m-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
        </div>
        <div class="basis-1/2 overflow-scroll h-screen mt-10">
            <p v-if="complete"></p>
            <div v-for="keywords, category in output">
                <div class="relative overflow-x-auto">
                    <table class="w-10/12 text-sm text-left text-gray-500 dark:text-gray-400 mt-6">
                        <thead class="text-gray-200 bg-gray-50 dark:bg-gray-300 dark:text-gray-900">
                            <tr><th scope="col" class="px-6 py-3">Category: {{ category }}</th></tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white dark:bg-gray-200 dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    <p v-for="k in keywords">{{ k }}</p>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { pipeline } from '@xenova/transformers';
import { HfInference } from "@huggingface/inference";

const HF_ACCESS_TOKEN = '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';
const inference = new HfInference(HF_ACCESS_TOKEN);

export default {
    data(){
        return {
            keywords: null,
            categories: null,
            output: {},
            data: [],
            form_error: false,
            complete: false,
        }
    },
    methods: {
        async classify_text(){
            this.complete = false
            var forms_not_filled_out = (this.categories == null || this.categories == false) || (this.keywords == null || this.keywords == false)
            if(forms_not_filled_out) {
                this.form_error = true; 
                return;
            }else{
                var categories = this.get_categories()
                var keywords = this.get_keywords()
                var keyword_chunks = this.create_keyword_chunks(keywords, 25)
                for(const category of categories) this.output[category] = []

                for(const c of keyword_chunks){
                    var args = { model: 'facebook/bart-large-mnli', inputs: c, parameters: { candidate_labels: categories } }
                    for(const result of await inference.zeroShotClassification(args)){
                        var keyword = result.sequence
                        var labels = result.labels
                        var scores = result.scores
                        var category_index = this.largest_number_index(scores)
                        var category = labels[category_index]
                        this.output[category].push(keyword) // Add keyword to appropriate category
                    }
                }

                this.complete = true
            }
        },
        get_keywords(){
            if(this.keywords == null) {
                return false
            }
            return this.keywords.split('\n')
        },
        get_categories(){
            if(this.categories == null) {
                return false
            }
            return this.categories.split(',');
        },
        set_new_data(d){
            this.data = d
        },
        largest_number_index(array){
            var largest_number_index = 0;
            var array_length = array.length
            for(var i = 0; i < array_length; i++){
                if(array[i] > array[largest_number_index]){
                    largest_number_index = i;
                }
            }
            return largest_number_index
        },
        create_keyword_chunks(keywords, chunk_size){
            //const chunkSize = 25;
            var chunks = []
            for (let c = 0; c < keywords.length; c += chunk_size) {
                const chunk = keywords.slice(c, c + chunk_size);
                chunks.push(chunk)
            }
            return chunks
        },
        create_keyword_categories(categories){
            var c = []
            for(const category of categories) {
                c[category] = []
            }
            return c
        }
    }
}
</script>
