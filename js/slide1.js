(function () {
    var margin = { top: 50, left: 50, right: 50, bottom: 50},
    height = 600 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;
    var promises = [];
    let url= 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv'
    let urlVaccine= 'https://raw.githubusercontent.com/govex/COVID-19/master/data_tables/vaccine_data/us_data/time_series/people_vaccinated_us_timeline.csv'
    let req = new XMLHttpRequest();
    let data;

    var tooltip = d3.select("body").append("div")
                      .attr("id", "tooltip")
                      .style("opacity", 0.8);
    promises.push(d3.json("json/usa-states.json"));
    promises.push(d3.csv(url));
    promises.push(d3.csv(urlVaccine));
    promises.push(d3.csv("data/population.csv"));
    Promise.all(promises).then(function(values) {
        var slide1data = values[0];
        var covid1data = values[1];
        var vaccine1data = values[2];
        var populationdata = values[3];

        sessionStorage.setItem( 'vaccineByDateToPass', JSON.stringify(vaccine1data) );
        var integratedDatavaccine = [];
        var dateData = [];
        var x=0;
        var sortData= {};
        var states = topojson.feature(slide1data, slide1data.objects.states)

        localStorage.setItem( 'objectToPass', JSON.stringify(states) );


        var projection = d3.geoAlbersUsa()
            .translate([width/2, height/2])
            .scale(900)

        var path = d3.geoPath()
            .projection(projection)


        covid1data.forEach(function(element, key) {
            var parseDate = d3.timeParse("%Y-%m-%d");
            var formatDate = d3.timeFormat("%B-%Y");
            element.date = formatDate(parseDate(element.date));
        });
        var date = covid1data[covid1data.length-1].date;
        vaccine1data.forEach(function(element, key) {
            var parseDate = d3.timeParse("%Y-%m-%d");
            var formatDate = d3.timeFormat("%B-%Y");
            element.Date = formatDate(parseDate(element.Date));
        });
        localStorage.setItem( 'vaccineToPass', JSON.stringify(vaccine1data) );
        var grouped_data = d3.group(covid1data,
            d => d.state,
            d => d.date );


        var grouped_data_byDate = d3.group(covid1data,
            d => d.date,
            d => d.state);


        var grouped_vaccine_data = d3.group(vaccine1data,
            d => d.Province_State,
            d => d.Date );


        dropdown.selectedIndex = dateData.length;

        let max = d3.max(covid1data, function (d, i) {
            return d.cases;
        });

        let min = d3.min(covid1data, function (d, i) {
            return d.cases;
        });

        var colorScale = d3.scaleThreshold()
            .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
            .range(['white','pink', 'red']);




        var select = d3.select('body')
            .append('select')
                .attr('class','select')
                .on('change',function()
                { onchange(this.value, this.options[this.selectedIndex].text, this.selectedIndex)

                });


        var options = select
            .selectAll('option')
                .data(d3.map(grouped_data_byDate, function(d, index){ return d;})).enter()
                .append('option')
                .text(function(d){return d[0];})
                .attr("index",function(d, index){return index})
                .attr("value",function(d){return d;});

        options.property('selected', function(d){
            return d[0] === date;
        });

        function onchange(value, text, index) {
            d3.selectAll("svg").remove();
            console.log(value, text, index);
            date = text;
            options.property('selected', function(d){
                return d[0] === date;
            });

            getCombinedDataForMap(covid1data, vaccine1data, populationdata, states, date);
            getSvgPath(states, path, colorScale, populationdata)

        };

        getCombinedDataForMap(covid1data, vaccine1data, populationdata, states, date);
        getSvgPath(states, path, colorScale, populationdata)



    });
    let dropdown = $('#state-dropdown');

    dropdown.empty();

    dropdown.append('<option disabled>Choose Month-Year</option>');
    function getCombinedDataForMap (covid1data, vaccine1data, populationdata, states, date) {

        console.log(vaccine1data);
        var sorted_countries_byDate = covid1data.filter(function(d){
            return d.date === date;
        });

        var sorted_countries_byvaccineDate = vaccine1data.filter(function(d){
            return d.Date === date;
        });

        console.log(sorted_countries_byDate, sorted_countries_byvaccineDate);

       _(states.features)
            .keyBy('properties.name')
            .merge(_.keyBy(sorted_countries_byDate, 'state'))
            .values()
            .value();

        if (sorted_countries_byvaccineDate && sorted_countries_byvaccineDate.length > 0) {
            _(states.features)
            .keyBy('properties.name')
            .merge(_.keyBy(sorted_countries_byvaccineDate, 'Province_State'))
            .values()
            .value();
        }


        _(states.features)
        .keyBy('properties.name')
        .merge(_.keyBy(populationdata, 'state'))
        .values()
        .value();


    }

    function getSvgPath(states, path, colorScale, populationdata) {

        var  svg = d3.select('#canvas')
            .append('svg')
            .attr('height', height + margin.top + margin.bottom)
            .attr('width', width + margin.left + margin.right)
            .attr('transform', 'translate('+ margin.left + ',' + margin.top +')');

        svg.selectAll('path')
            .data(states.features)
            .enter()
            .append('path')
            .attr("d", path)
            .attr('class', 'state')
            .attr("value",function(d){return d.state;})
            .attr("date",function(d){
                return d.date;})
            .attr("cases",function(d){return d.cases;})
            .style("pointer-events","all")
            .style("fill", function(d) {

                //The join works
                console.log(colorScale(d.cases), d.cases)
                if (d.cases) {
                    return colorScale(d.cases);
                } else {
                    return "#ccc";
                }
            })
            .on("mouseover", function(event, d) {
                console.log('hello');
                percent = Number(d.People_Fully_Vaccinated)/Number(d.population.replace(/,/g,''))*100;
                console.log('hi', percent);
                tooltip.style("display", "flex")
                       .html(function() {
                  tooltip.attr("country", d.state);
                  return `${d.state} Cases: ${d.cases},
                            Deaths: ${d.deaths}, FullyVaccinated%: ${percent || 0}`;})
                       .style("left", (event.pageX + 10)+"px")
                       .style("top", (event.pageY - 28) + "px")
              })
              .on("mouseout", () => {
                tooltip.style("display", "none")
            });

            svg.selectAll('g.legend')
            .data(colorScale.range().reverse())
            .enter()
            .append('g').attr('class', 'legend')
            .append('rect')
            .attr("x", width - 780)
            .attr("y", function(d, i) {
                return i * 20;
            }).attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d){return d;})
            .append('text')
            .attr("x", width - 765) //leave 5 pixel space after the <rect>
            .attr("y", function(d, i) {
                return i * 20;
            }).text(function(d){
                return (d);
            })

    }

})();