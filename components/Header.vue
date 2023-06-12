<template>
    <nav class="bg-gray-800">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between">
                <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div class="flex flex-shrink-0 items-center">
                        <img class="hidden h-8 w-auto lg:block" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company">
                    </div>
                    <div class="hidden sm:ml-6 sm:block">
                        <div class="flex space-x-4">
                            <NuxtLink id="alt-text-gen" exact-active-class="active" class="inactive" to="/alt-text-gen">Alt Text Generator</NuxtLink>
                            <NuxtLink id="text-class" exact-active-class="active" class="inactive" to="/text-classifer">Text Classifier</NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

</template>

<script lang="ts">

    //const route = useRoute()
    //console.log(route.path)
    /*
    export default{
        data() {
            return {
                text_clas: false,
                alt_text_gen: false
            }
        },
        mounted(){
            if(route.path == '/alt-text-gen'){
                this.alt_text_gen = true
                this.text_clas = false
            }
            if(route.path == '/text-classifer'){
                this.text_clas = true
                this.alt_text_gen = false
            }
        }
    }
    */
</script>
