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
    .attr("transform","translate(0,"+(svgHeight/2+margin.bottom)+")");
    //.attr("transform","translate("+(svgWidth/2)+","+(svgHeight/2+margin.bottom)+")");

var barChart = svg.append('g')
    .classed('barGroup',true)
    .attr("transform","translate("+(margin.left)+","+margin.top+")");
    //.attr("transform","translate("+(svgWidth/2)+","+margin.top+")");

function updateBar(barData) {
    //console.log(barData)
    var series = d3.stack().keys(catList)(barData)
    //console.log(series)
    var xScale;
    var yScale;
    var color;

    if (init) {
        xScale = d3.scaleBand()
            .domain(barData.map(function(d){return d.month;}))
            .range([0, svgWidth-margin.right-margin.left])
            //.range([0, (svgWidth/2)-margin.right])
            .padding(0.1);

        yScale = d3.scaleLinear()
            .domain([0,d3.max(series, d => d3.max(d, d=> d[1]))])
            .range([svgHeight/2-margin.bottom,margin.top]);

        var colorList = ['#0e550e','#d5eb14','#c29914','#e02e01','#e008aa','#080207']

        color = d3.scaleOrdinal(colorList);

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

        const xAxis = barChart.append("g")
            .attr("id", "xAxis")
            .attr("transform", "translate(0,"+(svgHeight/2-margin.bottom)+")")
            .call(d3.axisBottom(xScale))
            .attr('font-size',8);
        
        const yAxis = barChart.append("g")
            .attr("id", "yAxis")
            .call(d3.axisLeft(yScale));

        barChart.append('text')
                .attr("transform", "translate(0,"+(margin.top/1.5)+")")
                .text('AQI Category Distribution by Month')
                .attr('font-size',16)

        barChart.selectAll('.colorLegend')
                .data(colorList)
                .enter()
                .append('rect')
                .attr('fill', d => d)
                .attr('y',(d,i) => i*30+svgHeight/20)
                .attr('x', -55)
                .attr('height',10)
                .attr('width',10)
                .classed('colorLegend',true)

        var textList = ['Good','Moderate','Unhealthy SG','Unhealthy','V Unhealthy','Hazardous']

        barChart.selectAll('.textLegend')
                .data(textList)
                .enter()
                .append('text')
                .attr('y',(d,i) => i*30+svgHeight/21)
                .attr('font-size',8)
                .attr('x', -50)
                .attr('text-anchor','middle')
                .text(d => d)
                .classed('textLegend',true)

        init = false;

    } else {
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
    }

}
     