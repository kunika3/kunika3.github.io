(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50},
    height = 400-margin.top - margin.bottom,
    width = 800-margin.left-margin.right;
    var promises = [];
    let url= 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv'
    let req = new XMLHttpRequest();
    let data;
    var  svg = d3.select('#map')
            .append('svg')
            .attr('height', height+margin.top+margin.bottom)
            .attr('width', height+margin.left+margin.right)
            .append('g')
            .attr('transform', 'translate('+ margin.left + ',' + margin.top +')');

    let drawCanvas = () => {
        svg.attr('width', width);
        svg.attr('height', height);
    }
    async function getData() {
        const response = await d3.csv(url);
        drawCanvas();
        console.log(response);
    }
    promises.push(d3.json("world.topojson"));
    Promise.all(promises).then(function(values) {
        console.log('values', values);
    });
    // d3.queue()
    //     .defer(d3.json, 'world.topojson')
    //     .await(ready)

    function ready(error, data){
        console.log(data);
    }
})();

