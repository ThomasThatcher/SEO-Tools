import { parseString } from "xml2js"
export default defineEventHandler(async (event) => {
    const data = await readBody(event)
    const country_code = data.country_code
    const keyword = data.keyword
    const api_endpoint = `http://google.com/complete/search?output=toolbar&gl=${country_code}&q=${keyword}`

    var xml = null
    var json_response = []

    await fetch(api_endpoint)
        .then(response => response.body.getReader().read())
        .then(stream => { xml = new TextDecoder().decode(stream.value) }
    )

    parseString(xml, function (err, results) {
  
        // parsing to json
        let data = JSON.stringify(results)
            
        // display the json data
        //console.log("results", results.toplevel.CompleteSuggestion);
        var suggestions = results.toplevel.CompleteSuggestion
        for (const suggestion of suggestions){
            var s = suggestion.suggestion[0].$.data
            json_response.push(s)
            console.log(s)
        }
    });
    console.log(json_response)
    return xml
})