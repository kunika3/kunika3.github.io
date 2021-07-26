let url= 'https://github.com/nytimes/covid-19-data/blob/c7fa3211d71d0c70c617064cac12d72b2eb81d59/us-states.csv';
let req = new XMLHttpRequest();
let data;
async function init() {
    const data = await d3.csv(url)
    .then(function(data){
        console.log(data)
    }).catch(function(error){

    });
}

