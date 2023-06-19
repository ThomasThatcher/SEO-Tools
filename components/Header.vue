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
                            <NuxtLink id="keyword-gen-class" exact-active-class="active" class="inactive" to="/keyword-generator">Keyword Generator</NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

</template>

<script lang="ts">
    export default{
        
    }
</script>
