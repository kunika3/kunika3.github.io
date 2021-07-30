(function() {
    // var margin = { top: 50, left: 50, right: 50, bottom: 50},
    // height = 600 - margin.top - margin.bottom,
    // width = 800 - margin.left - margin.right;
    // var promises = [];
    // let url= 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv'
    // let req = new XMLHttpRequest();
    // let data;
    // var  svg = d3.select('#canvas')
    //         .append('svg')
    //         .attr('height', height + margin.top + margin.bottom)
    //         .attr('width', width + margin.left + margin.right)
    //         .append('g')
    //         .attr('transform', 'translate('+ margin.left + ',' + margin.top +')');
    // let g = svg.append( "g" );
    // let confirmed = svg.append( "g" );

    // async function getData() {
    //     const response = await d3.csv(url);
    //     console.log(response);
    // }
    // let dropdown = $('#locality-dropdown');

    // dropdown.empty();

    // dropdown.append('<option disabled>Choose Month-Year</option>');

    // d3.queue()
    //     .defer(d3.json, 'world.topojson')
    //     .await(ready)

    // function ready(error, data){
    //     console.log(data);
    // }
})();

function getFilteredData(data, group) {
	data.filter(function(val, key) {
        console.log('point', val, key);

         });
}


