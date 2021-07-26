let url= 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv'

let req = new XMLHttpRequest();
let data;
async function getData() {
    const response = await d3.csv(url);
    console.log(response);
}

