(function() {
    let state = 'California';
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

    var x = d3.scaleTime()
      .domain(d3.extent(vaccinedata, function(d) { return new Date(d.Date); }))
      .range([ 0, width ]);

    var y = d3.scaleLinear()
      .domain([0, d3.max(vaccinedata, function(d) { return +d.People_Fully_Vaccinated/1000000 || 0; })])
      .range([ height, 0 ]);

    var grouped_vaccine_data = d3.group(vaccinedata,
        d => d.Province_State,
        d => d.Date );


    var dropdownData = d3.map(grouped_vaccine_data, function(d, index){ return d;});

    console.log(dropdownData);

    var sorted_countries_byvaccineState = getFilteredData(states, vaccinedata, state);

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

    options.property('selected', function(d){
        return d[0] === state;
    })

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



})();

function getFilteredData (states, vaccinedata, state) {
    var sorted_countries_byvaccineState = vaccinedata.filter(function(d){
        return d.Province_State === state;
    });

    return sorted_countries_byvaccineState;

}

function getLineMap (height, width, margin, sorted_countries_byvaccineState, x, y) {
    const yAxisTickFormat = number => d3.format("s")(number);

    var tooltip = d3.select("body").append("div")
                      .attr("id", "tooltip")
                      .style("opacity", 0.8);
    var svg = d3.select('body')
    .append('svg')
    .attr("width", 800)
    .attr("height", 600)
    .append('g')
    .attr('transform', 'translate('+ margin.left + ',' + margin.top +')');

    svg.append("path")
        .datum(sorted_countries_byvaccineState)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { console.log(d);return x(new Date(d.Date)) })
          .y(function(d) { console.log(+d.People_Fully_Vaccinated); return y(+d.People_Fully_Vaccinated/1000000 || 0) })
        ).on("mouseover", function(event, d) {
            tooltip.style("display", "flex")
                   .html(function() {
              tooltip.attr("country", d.People_Fully_Vaccinated);
              return `FullyVaccinated: ${Number(d.People_Fully_Vaccinated)}`;})
                   .style("left", (event.pageX + 10)+"px")
                   .style("top", (event.pageY - 28) + "px")
          })
          .on("mouseout", () => {
            tooltip.style("display", "none")
        });

    svg.append("path")
        .datum(sorted_countries_byvaccineState)
        .attr("fill", "none")
        .attr("stroke", "orange")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { console.log(d);return x(new Date(d.Date)) })
          .y(function(d) { console.log(+d.People_Partially_Vaccinated); return y(+d.People_Partially_Vaccinated/1000000) })
        ).on("mouseover", function(event, d) {
            tooltip.style("display", "flex")
                   .html(function() {
              tooltip.attr("country", d.People_Partially_Vaccinated);
              return `PartiallyVaccinated: ${Number(+d.People_Partially_Vaccinated)}`;})
                   .style("left", (event.pageX + 10)+"px")
                   .style("top", (event.pageY - 28) + "px")
          })
          .on("mouseout", () => {
            tooltip.style("display", "none")
        });

    svg.append("g")
        .style("display", "none")
        .append("circle")
        .attr("class", "y")
        .style("fill", "none")
        .style("stroke", "green")
        .attr("r", 4)
        .style('pointer-events', 'all')



    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    svg.append("text")
    .attr("class", "labelforX")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Months of Years");

    svg.append("g")
    .call(d3.axisLeft(y));

    svg.append("text")
    .attr("class", "labelforY")
    .attr("y", 6)
    .attr("dy", ".75em")
    .style('margin-top', '50px')
    .style('float', 'right')
    .attr("transform", "rotate(-90)")
    .text('Full and Partially Vaccinations (100k-M)');

}