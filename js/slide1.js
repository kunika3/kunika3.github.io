var integratedData= [];

(function () {
    var date = 'June-2021';
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

        console.log(populationdata);
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



        // Format vaccine data
        grouped_vaccine_data.forEach(function(element, key, value) {
            var tempData = [];

            element.forEach(function(data, index) {

                    sortData[index] = {'fully_vaccinated' : data[data.length-1].People_Fully_Vaccinated, 'partially_vaccinated' : data[data.length-1].People_Partially_Vaccinated, 'Date_vaccine': data[data.length-1].Date,
                    'lat': data[data.length-1].Lat, 'long': data[data.length-1].Long_};

                    tempData.push(sortData[index]);
            });
            integratedDatavaccine[key] = tempData;

        });

        //Format covid data
        grouped_data.forEach(function(element, key, value) {
            var tempData = [];

            element.forEach(function(data, index) {
                if(!dateData.includes(index)) {
                    dateData.push(index);
                }

                sortData[index] = {'cases' : data[data.length-1].cases, 'state': data[data.length-1].state, 'date': data[data.length-1].date};

                tempData.push(sortData[index]);
            });
            integratedData[key] = tempData;
        });

        //create one single data
        for (var id in integratedData){
            for (var idv in integratedDatavaccine) {
                if (id === idv) {
                    for (val in integratedData[id]) {

                        var comDate = integratedDatavaccine[idv].filter(word => {
                            return word.Date_vaccine === integratedData[id][val].date} );
                        integratedData[id][val].lat = integratedDatavaccine[idv][0].lat;
                        integratedData[id][val].long = integratedDatavaccine[idv][0].long;
                        if(comDate && comDate[0] && comDate[0] !== undefined) {
                            integratedData[id][val].fully_vaccinated = comDate[0].fully_vaccinated;
                            integratedData[id][val].partially_vaccinated = comDate[0].partially_vaccinated;
                        }

                    }

                }
            }

        }

        //integrate with state data
        // states.forEach(function(element, key) {
        //     element['properties'].covid = integratedData[element.properties.name];
        // });

        // var list = d3.select('body').append("select");

        // list.selectAll("option")
        // .data(d3.map(grouped_data_byDate, function(d){return d;}))
        // .enter()
        // .append("option")
        // .attr("value", function(d) { console.log(d, d[0]); return d[0];})
        // .text(function(d){console.log(d, d[0]);return d[0];})
        // .attr("value",function(d){return d;})
        // .on('change',function(){
        //     onchange();
        // });


        // d3.select("body").selectAll("option")
        // .data(d3.map(grouped_data_byDate, function(d){return d;}))
        // .enter()
        // .append("option")
        // .text(function(d){console.log(d, d[0]);return d[0];})
        // .attr("value",function(d){return d;});



        dropdown.selectedIndex = dateData.length;

        let max = d3.max(covid1data, function (d, i) {
            return d.cases;
        });

        let min = d3.min(covid1data, function (d, i) {
            return d.cases;
        });



        // var colorScale = d3.scaleLinear()
        //     .domain(0, 10000, 500000, 800000, 1000000)
        //     .range(["blue", "aqua", "purple", "indigo", "green"]);
    //     var colorScale = d3.scaleThreshold()
    // .domain([min,max])
    // .range(d3.schemeBlues[30]);

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

        function onchange(value, text, index) {
            d3.selectAll("svg").remove();
            console.log(value, text, index);
            selectValue = d3.select('select').property('value')
            selectIndex = d3.select('option').property('index')
            console.log(selectIndex);

            getCombinedDataForMap(covid1data, vaccine1data, populationdata, states, date);
            getSvgPath(states, path, colorScale, populationdata)

            // g.selectAll( "path" )
            //     .data( integratedData)
            //     .enter()
            //     .append( "path" )
            //     .attr('d', path)
            //     .attr('fill', function(d) {
            //         console.log(d);
            //     })



            //     .attr( "stroke", "none" )
            //     .attr( "opacity", 0.5)
            //     .attr( "d", path )
            //     .attr("class", "incident")
        };

        getCombinedDataForMap(covid1data, vaccine1data, populationdata, states, date);
        getSvgPath(states, path, colorScale, populationdata)
        // var arry = d3.map(grouped_data_byDate, function(d, index){ return d;});

        // d3.json("https://gist.githubusercontent.com/Bradleykingz/3aa5206b6819a3c38b5d73cb814ed470/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json", function (error, uState) {
        //     if (error) throw error;
        //     _(uState.features)
        //         .keyBy('properties.name')
        //         .merge(_.keyBy(covid1data, 'State'))
        //         .values()
        //         .value();

        // console.log(uState);
        // svg.selectAll('path')
        //     .data(states.features)
        //     .enter()
        //     .append('path')
        //     .attr("d", path)
        //     .attr('class', 'state')
        //     .attr("value",function(d){return d.state;})
        //     .attr("date",function(d){
        //         return d.date;})
        //     .attr("cases",function(d){return d.cases;})
        //     .style("pointer-events","all")
        //     .style("fill", function(d) {

        //         //The join works
        //         console.log(colorScale(d.cases), d.cases)
        //         if (d.cases) {
        //             return colorScale(d.cases);
        //         } else {
        //             return "#ccc";
        //         }
        //     })
        //     .on("mouseover", function(event, d) {
        //         console.log('hello');
        //         percent = Number(d.People_Fully_Vaccinated)/Number(d.population.replace(/,/g,''))*100;
        //         console.log('hi', percent);
        //         tooltip.style("display", "flex")
        //                .html(function() {
        //           tooltip.attr("country", d.state);
        //           return `${d.state} Cases: ${d.cases},
        //                     Deaths: ${d.deaths}, FullyVaccinated%: ${percent || 0}`;})
        //                .style("left", (event.pageX + 10)+"px")
        //                .style("top", (event.pageY - 28) + "px")
        //       })
        //       .on("mouseout", () => {
        //         tooltip.style("display", "none")
        //     });
            // .on('mouseover', (event, d) => {
            //     console.log(d.cases);
            //     var xPosition = d3.select(this).attr("px");
            //     // var yPosition = parseFloat(d3.select(this).attr("cy"));

            //     d3.select('body')
            //     .append("div")
            //     .attr("id", "tooltip")
            //     .transition().duration(200)
            //     .style('opacity', 0.9)
            //     .style('left', (d3.xPosition) + 'px')
            //     // .style('top', (d3.event.pageY / 1.5) + 'px')

            //     // // .attr("y", yPosition)
            //     .text( "Confirmed cases "+d.cases);

            // })
                //   tooltipCases
                //     .attr('data-year', d.cases)
                //     .text("The exact value of<br>this cell is: " + d.cases)
                //     .style("left", (d3.pointer(this)[0]+70) + "px")
                    // .style("top", (d3.pointer(this)[1]) + "px")
            // })
            // .on("mouseleave", function(d){
            //     tooltipCases.style("opacity", 0)
            // })




        // svg.append('g')
        //     .attr('class', 'state')
        //     .selectAll('path')
        //     .data(states.features)
        //     .enter()
        //     .append('path')
        //     .style("fill", function(d) {

        //         //The join works
        //         console.log(d, d.cases)

        //              if (d.cases) {

        //                  return colorScale(d.cases);
        //              } else {
        //                  return "black";
        //              }
        //     })

        // svg.selectAll( "path" )
        //     .selectAll('.state')
        //     .data(states)
        //     .enter()
        //     .append('path')
        //     .attr('class', 'state')
        //     .attr('d', path)
        //     .style("fill", "none")
        //     .style("stroke", "black")
        //     .style("stroke-width", "2");




                // d.total =  d.covid[d.covid.length-1].cases || 0;
                // return colorScale(d.total);
            // .append("circle", ".pin")
            // .attr("r", 2)
            // .raise()
            // .attr("transform", function(d) {
            //     console.log(d);
            //     return "translate(" + projection([
            //     +d.Longitude,
            //     +d.Latitude
            //     ]) + ")";
            // });


    });
    let dropdown = $('#locality-dropdown');

    dropdown.empty();

    dropdown.append('<option disabled>Choose Month-Year</option>');

    $.getScript('js/story1.js', function()
    {
        // script is now loaded and executed.
        // put your dependent JS here.
        console.log('Loaded');
    });

    function getCombinedDataForMap (covid1data, vaccine1data, populationdata, states, date) {

        console.log(vaccine1data);
        var sorted_countries_byDate = covid1data.filter(function(d){
            return d.date === date;
        });

        var sorted_countries_byvaccineDate = vaccine1data.filter(function(d){
            return d.Date === date;
        });

        console.log(sorted_countries_byDate, sorted_countries_byvaccineDate);

        // var more_sort = sorted_countries_byDate.filter(function(d){
        //     console.log(d3.map(d[1], function(d, index){ return d;}));
        // })

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

        console.log(states);
        // _(states.features)
        //     .keyBy('properties.name')
        //     .merge(_.keyBy(sorted_countries_byDate, 'state'))
        //     .values()
        //     .value();


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
    }

})();

