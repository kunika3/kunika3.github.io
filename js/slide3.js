(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50},
    height = 600 - margin.top - margin.bottom,
    width = 800- margin.left - margin.right;
    var states = JSON.parse(localStorage.getItem("objectToPass") || "[]");
    var vaccinedata = JSON.parse(localStorage.getItem("vaccineToPass") || "[]");
    let dropdown = $('#state-dropdown');

    dropdown.empty();

    dropdown.append('<option disabled>Choose Month-Year</option>');
    var covid =[];
    var stateData={}
    // for (user in vaccineusers) {
    //     covid.push(vaccineusers[user].properties.covid);
    // }

    var x = d3.scaleTime()
      .domain(d3.extent(vaccinedata, function(d) { return new Date(d.Date); }))
      .range([ 0, width ]);

    var y = d3.scaleLinear()
      .domain([0, d3.max(vaccinedata, function(d) { return +d.People_Fully_Vaccinated/1000000 || 0; })])
      .range([ height, 0 ]);

    var grouped_vaccine_data = d3.group(vaccinedata,
        d => d.Date,
        d => d.Province_State );

    // var dropdownData = d3.map(grouped_vaccine_data, function(d, index){ return d;});

    // console.log(dropdownData);

    var sorted_countries_byvaccineState = getFilteredData(grouped_vaccine_data);
    console.log(sorted_countries_byvaccineState);

    // let result = covid.map(a => stateData[a[0]['state']] = a[0]['state']);

    dropdown.selectedIndex = sorted_countries_byvaccineState.length;

        var select = d3.select('body')
            .append('select')
                .attr('class','select')
                .on('change',function()
                { onchange(this.value, this.options[this.selectedIndex].text, this.selectedIndex)

                });


                var options = select
                .selectAll('option')
                    .data(d3.map(dropdownData, function(d, index){ return d;})).enter()
                    .append('option')
                    .text(function(d){return d[0];})
                    .attr("index",function(d, index){return index})
                    .attr("value",function(d){return d;});


                    function onchange(value, text, index) {
                        var x1 = d3.scaleTime()
                            .domain(d3.extent(vaccinedata, function(d) { return new Date(d.Date); }))
                            .range([ 0, width ]);

                        var y1 = d3.scaleLinear()
                            .domain([0, d3.max(vaccinedata, function(d) { return +d.People_Fully_Vaccinated/1000000 || 0; })])
                            .range([ height, 0 ]);
                        d3.selectAll("svg").remove();
                        selectValue = d3.select('select').property('value')
                        selectIndex = d3.select('select').property('index')
                        console.log(dropdownData[index]);

                        filterResult = getFilteredData(states, vaccinedata, dropdownData[index][0]);
                        console.log(filterResult);
                        getLineMap(height, width, margin, filterResult, x, y);

                    };
    getLineMap(height, width, margin, sorted_countries_byvaccineState, x, y);

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

function getFilteredData (grouped_vaccine_data) {
    var sorted_countries_byvaccineState = vaccinedata.map(function(d, index){
        return d;
    });

    return sorted_countries_byvaccineState;

}

function getLineMap (height, width, margin, sorted_countries_byvaccineState, x, y) {
    const yAxisTickFormat = number => d3.format("s")(number);

    // svg.append("g")
    //   .call(d3.axisLeft(y));

    // x.domain(d3.extent(sorted_countries_byvaccineState, function(d) { return d.Date; }));
    // y.domain([0, d3.max(sorted_countries_byvaccineState, function(d) { return d.People_Fully_Vaccinated; })]);

    // var axis = d3.axisLeft(scale).tickFormat(function(d){
    //     if(this.parentNode.nextSibling){
    //    return d/1000000} else { return d/1000000  + " Million"}});
    //    var yAxis = d3.svg.axis()
    //    .scale(y)
    //    .ticks(5)
    //    .tickFormat(d3.format("s"))
    //    .orient("left");

    // // var y = d3.scaleLinear()
    // // .domain([0, 6000000])
    // // .range([height, ]);

    // var x = d3.scaleBand()
    // .range([0, width])
    // .padding(0.1);

    var svg = d3.select('body')
    .append('svg')
    .attr("width", 800)
    .attr("height", 600)
    .append('g')
    .attr('transform', 'translate('+ margin.left + ',' + margin.top +')');

    // x.domain(sorted_countries_byvaccineState.map(function(d){return d.Date; }));
    // scale.domain([0, d3.max(sorted_countries_byvaccineState, function(d) {return d.People_Fully_Vaccinated})]);
    // console.log('hello');
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(sorted_countries_byvaccineState)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return x(d.Date); } )
    //     .attr("cy", function (d) { console.log(d.People_Fully_Vaccinated || 0); return y(d.People_Fully_Vaccinated || 0 ); } )
    //     .attr("r", 2)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#CC0000");
        // .attr('x', function(d){return x(d.date);})
        // .attr('width', x.bandwidth())
        // .attr('y', function(d){return y(d.fully_vaccinated);})
        // .attr('height', function(d){return height - y(d.fully_vaccinated);})
        // .attr('fill', 'green');

        // var line = d3.line()
        // .x(function(d) { return x(d.Date); })
        // .scale(function(d) { return scale(d.People_Fully_Vaccinated || 0); })
        // .curve(d3.curveMonotoneX)

        // svg.append("path")
        // .datum(sorted_countries_byvaccineState)
        // .attr("class", "line")
        // .attr("transform", "translate(" + 100 + "," + 100 + ")")
        // .attr("d", line)
        // .style("fill", "none")
        // .style("stroke", "#CC0000")
        // .style("stroke-width", "2");
    svg.append("path")
        .datum(sorted_countries_byvaccineState)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { console.log(d);return x(new Date(d.Date)) })
          .y(function(d) { console.log(+d.People_Fully_Vaccinated); return y(+d.People_Fully_Vaccinated/1000000 || 0) })
        )
    svg.append("g")
        .style("display", "none")
        .append("circle")
        .attr("class", "y")
        .style("fill", "none")
        .style("stroke", "green")
        .attr("r", 4)
        .style('pointer-events', 'all')
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        focus.select("circle.y")
            .attr("transform",
                  "translate(" + x(d.date) + "," +
                                 y(d.close) + ")");
    }



    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    svg.append("text")
    .attr("class", "labelforX")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Months");

    svg.append("g")
    .call(d3.axisLeft(y));

    svg.append("text")
    .attr("class", "labelforY")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text('People Fully Vaccinated in in Millions')

    //     svg.append('g')
    // .attr('transform', 'translate(0,' + height + ')')
    // .call(d3.axisBottom(x));

    // svg.append('g')
    //     .call(axis.tickFormat(yAxisTickFormat));
    // svg.append("g").attr("transform", "translate(20, 50)").call(axis);

}