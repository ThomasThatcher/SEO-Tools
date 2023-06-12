<template>
    
</template>

<script>
//import { defineComponent } from '@vue/composition-api'
import { pipeline } from '@xenova/transformers';

let classifier = await pipeline('sentiment-analysis');

export default {
    
}
</script>
