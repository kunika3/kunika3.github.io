(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50},
    height = 600 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;
    var promises = [];
    let url= 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv'
    let req = new XMLHttpRequest();
    let data;
    var  svg = d3.select('#canvas')
            .append('svg')
            .attr('height', height + margin.top + margin.bottom)
            .attr('width', width + margin.left + margin.right)
            .append('g')
            .attr('transform', 'translate('+ margin.left + ',' + margin.top +')');

    // async function getData() {
    //     const response = await d3.csv(url);
    //     console.log(response);
    // }
    promises.push(d3.json("json/usa-states.json"));
    promises.push(d3.csv(url));
    Promise.all(promises).then(function(values) {
        console.log('values', values);
        var slide1data = values[0];
        var covid1data = values[1];
        var integratedData= {};
        var states = topojson.feature(slide1data, slide1data.objects.states).features

        var projection = d3.geoAlbersUsa()
            .translate([width/2, height/2])
            .scale(900)

        var path = d3.geoPath()
            .projection(projection)

        svg.selectAll('.state')
            .data(states)
            .enter()
            .append('path')
            .attr('class', 'state')
            .attr('d', path)

        covid1data.forEach(function(element, key) {
            integratedData[element["state"]] = {"cases": +element["cases"], "deaths": +element["deaths"], "iso2": element["state"]};
        });

        states.forEach(function(element, key) {
            console.log(element);
            // integratedData[element["state"]] = {"cases": +element["cases"], "deaths": +element["deaths"], "iso2": element["state"]};
        });

        console.log(integratedData);


        // svg.selectAll('.confirmedcases')
        //     .data(covid1data)
        //     .enter()
        //     .append('circle')
        //     .attr('r', 2)
        //     .attr('cx', function(d) {
        //         console.log('d', d);
        //     })
        //     .attr('cy', 10)
    });
    // d3.queue()
    //     .defer(d3.json, 'world.topojson')
    //     .await(ready)

    // function ready(error, data){
    //     console.log(data);
    // }
})();


