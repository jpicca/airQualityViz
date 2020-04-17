//var svgWidth = window.innerWidth;
var svgWidth = window.innerWidth*0.5;
var svgHeight = window.innerHeight*0.75;

// Formatting margins
var margin = ({top: 10, right: 10, bottom: 20, left: 80})

var svg = d3.select("#charts")
    .append("svg")
    //.attr("transform","translate("+(window.innerWidth-svgWidth)+",0)") // this is new
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var init = true;

//var map = svg.append('g');

var lineChart = svg.append('g')
    .classed('lineGroup',true)
    .attr("transform","translate("+(margin.left)+","+(margin.top)+")");
    //.attr("transform","translate("+(svgWidth/2)+","+(svgHeight/2+margin.bottom)+")");

var barChart = svg.append('g')
    .classed('barGroup',true)
    .attr("transform","translate("+(margin.left)+","+margin.top+")");
    //.attr("transform","translate("+(svgWidth/2)+","+margin.top+")");

function updateBar(barData,lineData) {
    //console.log(barData)
    var series = d3.stack().keys(catList)(barData)
    //console.log(series)
    var xScale;
    var yScale;
    var color;

    var xScaleLine;
    var yScaleLine;
    var yAxisLine;
    var createLine;

    // **** Format line Data properly ****
    var monthList = ['January','February','March','April','May','June','July','August','September',
                    'October','November','December']
    var formatData = []

    monthList.forEach(entry => {

        let emptyDict = {}
        emptyDict['month'] = entry
        emptyDict['value'] = lineData[entry]

        //console.log()

        formatData.push(emptyDict)

    })

    // Parser for our month strings
    var parseTime = d3.timeParse('%B');

    var parsedJan = parseTime('January')
    var parsedDec = parseTime('December')

    // Create color groups for line plot
    var catRectGreen = [{'month':parsedJan,'value':0},{'month':parsedJan,'value':50},
                        {'month':parsedDec,'value':50},{'month':parsedDec,'value':0}];

    var catRectYellow = [{'month':parsedJan,'value':50},{'month':parsedJan,'value':100},
                        {'month':parsedDec,'value':100},{'month':parsedDec,'value':50}];

    var catRectOrange = [{'month':parsedJan,'value':100},{'month':parsedJan,'value':150},
                        {'month':parsedDec,'value':150},{'month':parsedDec,'value':100}];

    var catRectRed = [{'month':parsedJan,'value':150},{'month':parsedJan,'value':160},
                        {'month':parsedDec,'value':160},{'month':parsedDec,'value':150}];
    
    // **********************************

    if (init) {
        xScale = d3.scaleBand()
            .domain(barData.map(function(d){return d.month;}))
            .range([0, svgWidth-margin.right-margin.left])
            //.range([0, (svgWidth/2)-margin.right])
            .padding(0.1);

        formatData.forEach(entry => {
            entry.month = parseTime(entry.month);
            entry.value = +entry.value;
        });

        //console.log(formatData)

        // x scale for line chart
        xScaleLine = d3.scaleTime()
            .domain(d3.extent(formatData, d => d.month))
            .range([0, svgWidth-margin.right-margin.left]);

        yScale = d3.scaleLinear()
            .domain([0,d3.max(series, d => d3.max(d, d=> d[1]))])
            .range([svgHeight/2-margin.bottom,margin.top]);

        // y scale for line chart
        yScaleLine = d3.scaleLinear()
            .domain([0, 160])//d3.max(formatData, d => d.value)])
            .range([svgHeight-margin.bottom-margin.top,svgHeight/2+margin.top+margin.bottom])

        // Colors for categories
        var colorList = ['#0e550e','#d5eb14','#c29914','#e02e01','#e008aa','#080207']

        color = d3.scaleOrdinal(colorList);

        // Line generator for line chart
        createLine = d3.line()
            .x(data => xScaleLine(data.month))
            .y(data => yScaleLine(data.value));

        var rects = barChart.selectAll("g").data(series).enter()
            .append("g")
            .attr("fill", d => color(d.key));

        rects.selectAll("rect")
            .data(d => d)
            .enter()
            .append("rect")
            .attr("x", (d, i) => xScale(d.data.month))
            .attr("y", d=> yScale(d[1]))
            .attr("height", d=> yScale(d[0]) - yScale(d[1]))
            .attr("width", xScale.bandwidth())

        const xAxisLine = lineChart.append("g")
            .attr("id", "xAxisLine")
            .attr("transform", "translate(0,"+(svgHeight-margin.bottom-margin.top)+")")
            .call(d3.axisBottom(xScaleLine).tickFormat(d3.timeFormat("%b")))
            .attr('font-size',8);
        
        yAxisLine = lineChart.append("g")
            .attr("id", "yAxisLine")
            .call(d3.axisLeft(yScaleLine));

        const xAxis = barChart.append("g")
            .attr("id", "xAxisLine")
            .attr("transform", "translate(0,"+(svgHeight/2-margin.bottom)+")")
            .call(d3.axisBottom(xScale))
            .attr('font-size',8);
        
        const yAxis = barChart.append("g")
            .attr("id", "yAxis")
            .call(d3.axisLeft(yScale));

        // Add rectangular background colors to line chart
        lineChart.data([catRectGreen])
            .append('path')
            .attr("fill", "#0e550e")
            .attr("opacity",0.3)
            .attr("d", d => createLine(d));

        lineChart.data([catRectYellow])
            .append('path')
            .attr("fill", '#d5eb14')
            .attr("opacity",0.3)
            .attr("d", d => createLine(d));

        lineChart.data([catRectOrange])
            .append('path')
            .attr("fill", '#c29914')
            .attr("opacity",0.3)
            .attr("d", d => createLine(d));

        lineChart.data([catRectRed])
            .append('path')
            .attr("fill", '#e02e01')
            .attr("opacity",0.3)
            .attr("d", d => createLine(d));

        // Create line on line chart
        lineChart.data([formatData])
            .append('path')
            .classed('linePath',true)
            .attr("stroke", "black")
            .attr("stroke-width", "3")
            .attr("fill", "none")
            .attr("d", d => createLine(d));

        lineChart.append('text')
            .attr("transform", "translate(0,"+(margin.top/1.5)+")")
            .text('Average AQI Value by Month')
            .attr('font-size',16)
            .attr("transform", "translate(0,"+(svgHeight/2+margin.top*2.9)+")");

        barChart.append('text')
                .attr("transform", "translate(0,"+(margin.top/1.5)+")")
                .text('AQI Category Distribution by Month')
                .attr('font-size',16)

        barChart.selectAll('.colorLegend')
                .data(colorList)
                .enter()
                .append('rect')
                .attr('fill', d => d)
                .attr('y',(d,i) => i*30+svgHeight/3)
                .attr('x', -57)
                .attr('height',10)
                .attr('width',10)
                .classed('colorLegend',true)

        var textList = ['Good','Moderate','Unhealthy SG','Unhealthy','V Unhealthy','Hazardous']

        barChart.selectAll('.textLegend')
                .data(textList)
                .enter()
                .append('text')
                .attr('y',(d,i) => i*30+svgHeight/3.05)
                .attr('font-size',8)
                .attr('x', -52)
                .attr('text-anchor','middle')
                .text(d => d)
                .classed('textLegend',true)

        init = false;

    } else {

        // Update bars
        var rects = barChart.selectAll("g").data(series)

        yScale = d3.scaleLinear()
            .domain([0,d3.max(series, d => d3.max(d, d=> d[1]))])
            .range([svgHeight/2-margin.bottom,margin.top]);

        rects.selectAll("rect")
            .data(d => d)
            .transition()
            .duration(500)
            .attr("y", d=> yScale(d[1]))
            .attr("height", d=> yScale(d[0]) - yScale(d[1]))

        // Update line

        formatData.forEach(entry => {
            entry.month = parseTime(entry.month);
            entry.value = +entry.value;
        });

        xScaleLine = d3.scaleTime()
            .domain(d3.extent(formatData, d => d.month))
            .range([0, svgWidth-margin.right-margin.left]);

        yScaleLine = d3.scaleLinear()
            .domain([0, 160]) //d3.max(formatData, d => d.value)])
            .range([svgHeight-margin.bottom-margin.top,svgHeight/2+margin.top+margin.bottom])

        // Line generator for line chart
        createLine = d3.line()
            .x(data => xScaleLine(data.month))
            .y(data => yScaleLine(data.value));
        
        //yAxisLine = lineChart.select('#yAxisLine')
        //    .transition()
        //    .duration(500)
        //    .call(d3.axisLeft(yScaleLine));

        lineChart.select('.linePath')
            .data([formatData])
            .transition()
            .duration(500)
            .attr("d", d => createLine(d));

    }

}
     