(function() {
    let state = 'Washington';
    let date = 'July-2021';
    var margin = { top: 50, left: 50, right: 50, bottom: 50},
    height = 800 - margin.top - margin.bottom,
    width = 1200- margin.left - margin.right;
    states = JSON.parse(localStorage.getItem("objectToPass") || "[]");
    let dropdown = $('#locality-dropdown');

    dropdown.empty();

    dropdown.append('<option disabled>Choose Month-Year</option>');

    console.log(states);
    var covid =[];
    var stateData={}
    // for (user in vaccineusers) {
    //     covid.push(vaccineusers[user].properties.covid);
    // }


    var filterResult = getFilteredData(state, covid);


    let result = covid.map(a => stateData[a[0]['state']] = a[0]['state']);

    dropdown.selectedIndex = result.length;

        var select = d3.select('body')
            .append('select')
                .attr('class','select')
                .on('change',onchange)

            var options = select
            .selectAll('option')
                .data(result).enter()
                .append('option')
                    .text(function (d, i) { d3.select(this).attr('index', i); return d; });


                    function onchange() {
                        d3.selectAll("svg").remove();
                        selectValue = d3.select('select').property('value')
                        selectIndex = d3.select('select').property('index')
                        console.log(selectValue);

                        filterResult = getFilteredData(selectValue, covid);
                        console.log(filterResult);
                        getLineMap(height, width, margin, filterResult);

                    };
    getLineMap(height, width, margin, states);

    // svg.append('path')
    //     .data(filterResult[0])
    //     // .enter().append('rect')
    //     // .attr('class', 'bar')
    //     // .enter()
    //     .attr('fill', 'none')
    //     .attr("stroke", "red")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", d3.line()
    //         .x(function(d) { return x(d.date) })
    //         .y(function(d) { return y(d.fully_vaccinated) })
    //     )






})();

function getFilteredData (state, covid) {
         return covid.filter(function (data) {
            return data[0].state === state
         })
}

function getLineMap (height, width, margin, states) {
    const yAxisTickFormat = number => d3.format("s")(number);

    var y = d3.scaleLinear()
    .domain([100, 6000000])
    .range([height, 10]);

    var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

    var svg = d3.select('body')
    .append('svg')
    .attr("width", 1200)
    .attr("height", 800)
    .append('g')
    .attr('transform', 'translate('+ margin.left + ',' + margin.top +')');

    x.domain(states.features.map(function(d){return d.date; }));
    y.domain([0, d3.max(states.features, function(d) {return d.fully_vaccinated})]);
    console.log('hello');
    svg.append('g')
        .selectAll("dot")
        .data(states.features)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.date); } )
        .attr("cy", function (d) { console.log(d.People_Fully_Vaccinated); return y(d.People_Fully_Vaccinated || 0 ); } )
        .attr("r", 2)
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .style("fill", "#CC0000");
        // .attr('x', function(d){return x(d.date);})
        // .attr('width', x.bandwidth())
        // .attr('y', function(d){return y(d.fully_vaccinated);})
        // .attr('height', function(d){return height - y(d.fully_vaccinated);})
        // .attr('fill', 'green');

        var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.fully_vaccinated || 0); })
        .curve(d3.curveMonotoneX)

        svg.append("path")
        .datum(states.features)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");

        svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

    svg.append('g')
        .call(d3.axisLeft(y).tickFormat(yAxisTickFormat));

}