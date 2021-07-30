(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50},
    height = 1000 - margin.top - margin.bottom,
    width = 1000- margin.left - margin.right;
    var vaccinedata = JSON.parse(sessionStorage.getItem("vaccineByDateToPass") || "[]");
    let dropdown = $('#state-dropdown');
    var svg = d3.select('body')
    .append('svg')
    .attr("width", 1000)
    .attr("height", 1000)
    .append('g')
    .attr('transform', 'translate('+ margin.left + ',' + margin.top +')');
    var promises = [];
    promises.push(d3.csv("data/population.csv"));
    Promise.all(promises).then(function(values) {
        var populationdata = values[0];
        var covid =[];
    var stateData={}
    var tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("opacity", 0.8);
    var grouped_vaccine_data = d3.group(vaccinedata,
        d => d.Date,
        d => d.Province_State );

    var sorted_countries_byvaccineState = getFilteredData(grouped_vaccine_data);
    sorted_countries_byvaccineState = sorted_countries_byvaccineState[sorted_countries_byvaccineState.length-1];
    var latestDate = sorted_countries_byvaccineState[0];

    var sorted_countries_byLastvaccineDate = vaccinedata.filter(function(d){
        return d.Date === latestDate;
    });
    sorted_countries_byLastvaccineDate.forEach(function(d) {
        d.People_Fully_Vaccinated = +d.People_Fully_Vaccinated;
      });


    _(sorted_countries_byLastvaccineDate)
          .keyBy('Province_State')
          .merge(_.keyBy(populationdata, 'state'))
          .values()
          .value();

    sorted_countries_byLastvaccineDate.forEach(function(d) {
        console.log(d);
        d.percentOfPopulation = d.population && d.People_Fully_Vaccinated ? Number(d.People_Fully_Vaccinated || 0)/Number(d.population.replace(/,/g,'') || 0)*100
            : 1;
      });

    console.log(sorted_countries_byLastvaccineDate);
    sorted_countries_byLastvaccineDate.sort(function(a, b) {
        return d3.ascending(a.percentOfPopulation, b.percentOfPopulation)
    })
    var x = d3.scaleBand().range ([0, width]).padding(0.5);
    var y = d3.scaleLinear().range ([height, 0]);

        const yAxisTickFormat = number => d3.format("s")(number);

        var g = svg.append('g')
        .attr("transform", "translate(" + 0 + "," + 0 + ")");

        x.domain(sorted_countries_byLastvaccineDate.map(function(d){
            return d.Province_State;
        }));

        y.domain([0, d3.max(sorted_countries_byLastvaccineDate, function(d) { return d.percentOfPopulation; })]);

        g.append("g")
             .attr("transform", "translate(0," + height + ")")
             .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y).tickFormat(function(d){
            console.log(d);
            return d;
            }))
            .append("text")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("value");

        g.selectAll(".bar")
            .data(sorted_countries_byLastvaccineDate)
            .enter().append("rect")
            .attr('width', '2px')
            .style("fill", 'lightgreen')
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.Province_State); })
            .attr("y", function(d) { return y(d.percentOfPopulation); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return (d.percentOfPopulation === 1 ? 'No Data' : height - y(d.percentOfPopulation) ); })
            .on("mouseover", function(event, d) {
                console.log('hello');
                percent = Number(d.percentOfPopulation);
                console.log('hi', percent);
                tooltip.style("display", "flex")
                       .html(function() {
                  tooltip.attr("country", d.percentOfPopulation);
                  return `${d.Province_State} Percentage Fully Vaccinated: ${percent || 0}%`;})
                       .style("left", (event.pageX + 10)+"px")
                       .style("top", (event.pageY - 28) + "px")
              })
              .on("mouseout", () => {
                tooltip.style("display", "none")
            });

        svg.append("text")
            .attr("class", "labelforX")
            .attr("x", width)
            .attr("y", height - 6)
            .style('color', 'red')
            .text("States of USA");

        svg.append("text")
            .attr("class", "labelforY")
            .attr("y", 6)
            .attr("dy", ".75em")
            .style('margin-top', '50px')
            .style('float', 'right')
            .attr("transform", "rotate(-90)")
            .text('Total Number of Full Vaccinations (Millions)');
    });



})();

function getFilteredData (grouped_vaccine_data) {
   return d3.map(grouped_vaccine_data, (function(d){
        return d;
    }));

    // return sorted_countries_byvaccineState;

}

