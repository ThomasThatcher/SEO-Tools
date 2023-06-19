<template>

<div class="container w-1/2 mx-auto mt-20">

   
<form>   
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <select v-model="country_code" id="countries" class="float-left bg-gray-50 mx-1 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/12 p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>Country</option>
            <option value="au">Australia</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="fr">France</option>
            <option value="de">Germany</option>
        </select>
        <input v-model="keyword" type="search" id="default-search" class="block m-1 w-9/12 p-4 pl-4 text-sm text-gray-900 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Provide a seed keyword..." required>
        <button @click.prevent="keyword_generator()" type="submit" class="text-white absolute right-20 w-32 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
    </div>

    <div>
        <!--<div v-for="r in results">
            <div class="relative overflow-x-auto">
                <table class="w-10/12 text-sm text-left text-gray-500 dark:text-gray-400 mt-6">
                    <thead class="text-gray-200 bg-gray-50 dark:bg-gray-300 dark:text-gray-900">
                        <tr><th scope="col" class="px-6 py-3">{{ r }}</th></tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white dark:bg-gray-200 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                <p v-for="k in r">{{ k }}</p>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>-->
        <div v-if="show" v-for="(key, value) of results['questions']">
            <p>{{ value }}</p>
            <p v-for="(kk, vv) in key">{{ kk }}</p>
        </div>
    </div>
</form>


</div>

</template>

<script lang="ts">
import { parseString } from "xml2js"

export default {
    data: () => ({
        country_code: 'au',
        keyword: null,
        api: '',
        prefixes: {
			'questions' : ['who', 'what', 'where', 'why', 'when', 'how', 'is', 'can', 'will', 'which', 'are'], // <> Keyword
			'prepositions' : ['can', 'for', 'is', 'near', 'to', 'with', 'without'], // Keyword <> 
			'comparisons' : ['and', 'like', 'or', 'versus', 'vs'], // Keyword <>
            'alphabeticals' : ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
		},
		results: {
			'related': [],
			'questions' : {'who' : [], 'what' : [], 'where' : [], 'why' : [], 'when' : [], 'how' : [], 'is' : [], 'can' : [], 'will' : [], 'which' : [], 'are' : []},			
			'prepositions' : {'can' : [], 'for' : [], 'is' : [], 'near' : [], 'to' : [], 'with' : [], 'without' : []}, 
			'comparisons' : {'and' : [], 'like' : [], 'or' : [], 'versus' : [], 'vs' : []},
            'alphabeticals' : {'a':[],'b':[],'c':[],'d':[],'e':[],'f':[],'g':[],'h':[],'i':[],'j':[],'k':[],'l':[],'m':[],'n':[],'o':[],'p':[],'q':[],'r':[],'s':[],'t':[],'u':[],'v':[],'w':[],'x':[],'y':[],'z':[]}
		},
        promises: [],
        show: false,
        keywords_generated: false,
        key: null
    }),
    methods: {
        keyword_generator(){
            this.reset()
            var api_endpoint = `http://google.com/complete/search?output=toolbar&gl=${this.country_code}&q=${this.keyword}`
            
            var result = this.query_endpoint(this.keyword)
            //this.results['related'].push(result)

            for(const [prefix_category, prefixes] of Object.entries(this.prefixes)){
                switch(prefix_category){
                    case 'questions':
                        for(const prefix of prefixes){
                            var result = this.query_endpoint(`${prefix} ${this.keyword}`)
                            this.results[prefix_category][prefix].push(result)
                        }
                    case 'prepositions':
                        for(const prefix of prefixes){
                            var result = this.query_endpoint(`${this.keyword} ${prefix}`)
                            this.results[prefix_category][prefix].push(result)
                        }
                    case 'comparisons':
                        for(const prefix of prefixes){
                            var result = this.query_endpoint(`${this.keyword} ${prefix}`)
                            this.results[prefix_category][prefix].push(result)
                        }
                    case 'alphabeticals':
                        for(const prefix of prefixes){
                            var result = this.query_endpoint(`${this.keyword} ${prefix}`)
                            this.results[prefix_category][prefix].push(result)
                        }
                }
            }

            Promise.allSettled(this.promises).then((values) => { this.show = true })
        },
        query_endpoint(keyword){
            var keywords = []
            this.promises.push(
                fetch("/api/keyword-gen", {
                    method: "POST",
                    body: JSON.stringify({ country_code: this.country_code, keyword: keyword }), 
                    headers: { "Content-type": "application/json; charset=UTF-8" }
                }).then(response => response.body.getReader().read()).then(stream => new TextDecoder().decode(stream.value)).then(data => {
                    parseString(data, function (err, results) {
                        var suggestions = results.toplevel.CompleteSuggestion
                        for (const s of suggestions){
                            var suggestion = s.suggestion[0].$.data
                            //console.log(suggestion)
                            keywords.push(suggestion)
                        }
                    })
                }
            )) 
            return keywords
        },
        reset(){
            this.show = false
            this.results = {
                'related': [],
                'questions' : {'who' : [], 'what' : [], 'where' : [], 'why' : [], 'when' : [], 'how' : [], 'is' : [], 'can' : [], 'will' : [], 'which' : [], 'are' : []},			
                'prepositions' : {'can' : [], 'for' : [], 'is' : [], 'near' : [], 'to' : [], 'with' : [], 'without' : []}, 
                'comparisons' : {'and' : [], 'like' : [], 'or' : [], 'versus' : [], 'vs' : []},
                'alphabeticals' : {'a':[],'b':[],'c':[],'d':[],'e':[],'f':[],'g':[],'h':[],'i':[],'j':[],'k':[],'l':[],'m':[],'n':[],'o':[],'p':[],'q':[],'r':[],'s':[],'t':[],'u':[],'v':[],'w':[],'x':[],'y':[],'z':[]}
		    }
        }
    }
}
</script>