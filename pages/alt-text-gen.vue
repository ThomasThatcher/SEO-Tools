<template class="max-w-screen-xl">
    <div class="flex flex-row">
        <div class="basis-1/2">
            <form class="max-w-3xl p-10">
                <label for="message" class="align-middle block mb-2 text-sm font-medium">Image URLs</label>
                <textarea v-model="urls" id="message" rows="15" class="block p-2.5 w-full text-sm rounded-lg border border-gray-100 focus:ring-blue-300 focus:border-blue-500 dark:border-gray-200 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Provide a list of image URLs on each line..."></textarea>
                <button @click.prevent="image_to_text()" class="float-right m-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
        </div>
        <div class="basis-1/2 overflow-scroll h-screen mt-10">
            <section v-for="d of data" class="bg-white dark:bg-gray-200 m-5 rounded-lg">
                <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-4 lg:grid-cols-12">
                    <div class="hidden lg:mt-0 lg:col-span-3 lg:flex">
                        <img class="max-w-full rounded-lg" :src="d.url" alt="mockup">
                    </div>
                    <div class="w-5/6 m-4 mr-auto place-self-center lg:col-span-7">
                        <label class="font-semibold max-w-2xl mb-6 md:text-sm lg:text-sm">Image URL</label>
                        <p class="w-5/6 mb-6 font-light lg:mb-8 md:text-sm lg:text-sm">{{ d.url }}</p>
                        <label class="font-semibold max-w-2xl mb-6 md:text-sm lg:text-sm">Generated ALT Text</label>
                        <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-sm lg:text-sm">{{ d.response }}</p>
                    </div>                
                </div>
            </section>
        </div>

        <!--<div v-for="d of data" class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <img class="rounded-t-lg" :src="d.url" alt="" />
                <div class="p-5">
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ d.response }}</p>
                </div>
            </div>
        </div>-->
</div>
</template>

<script lang="ts">
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
            this.data = []
            var image_urls = this.get_urls()
            for(const image_url of image_urls){
                await fetch("/api/alt-gen", {
                    method: "POST",
                    body: JSON.stringify({ url: image_url }), headers: { "Content-type": "application/json; charset=UTF-8" }
                })
                .then((response) => response.json())
                .then((json) => {
                    this.data.push({ url: image_url, response: json.generated_text })
                })
            }
        }
    }
}
</script>
