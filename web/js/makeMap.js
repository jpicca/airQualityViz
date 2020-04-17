d3.json('./counties-albers-10m.json', function(us) {

    //console.log(us)
    var path = d3.geoPath()
    
    var projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305])

    d3.select('#map').html(`<svg viewBox="0 0 975 610">
    <g fill="none" stroke="#000" stroke-linejoin="round" stroke-linecap="round">
      <path stroke="#aaa" stroke-width="0.5" d="${path(topojson.mesh(us, us.objects.counties, (a, b) => a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0)))}"></path>
      <path stroke-width="0.5" d="${path(topojson.mesh(us, us.objects.states, (a, b) => a !== b))}"></path>
      <path d="${path(topojson.feature(us, us.objects.nation))}"></path>
    </g>
  </svg>`)

    

    d3.json("cities.json", function(collection) {
    
        var mapG = d3.select('#map').select('g')

        mapG.append('text')
            .text('Average AQI for the Year')
            .attr('stroke','black')
            .attr('fill','black')
            .attr('font-size',20)
            .attr('x',400)
            .attr('y',20)
        
        var circles = mapG.selectAll("circle")
            .data(collection.objects)
            .enter().append("circle")
            .style("stroke", "black")  
            .style("opacity", .6) 
            .style("fill", d => {
                let colorList = ['#0e550e','#d5eb14','#c29914']
                if (mapData[d.city] < 50) {
                    return colorList[0]
                } else if (mapData[d.city] < 100) {
                    return colorList[1]
                } else {
                    return colorList[2]
                }
            })
            .classed('checked', d => {
                if (d.city == 'Dallas') {
                    return true;
                } else {
                    return false;
                }
            })
            .attr("r", d => mapData[d.city]/4)
            .attr("cx",d => projection([d.circle.coordinates[1],d.circle.coordinates[0]])[0])
            .attr("cy",d => projection([d.circle.coordinates[1],d.circle.coordinates[0]])[1])

        var toolTip = d3.tip()
			.attr("class", "tooltip")
			.attr('font-size', 40)
            .offset([40, 40])
            .style('background','white')
			.html(function(d) {
			    return (`<strong>${d.city}: ${mapData[d.city].toFixed(1)}</strong>`);
            });
            
        mapG.call(toolTip);

        circles.on("mouseover", function(data) {
            toolTip.show(data, this);
            })
            // onmouseout event
            .on("mouseout", function(data) {
                toolTip.hide(data);
            });

        circles.on('click', function(d) {
            //console.log(d.city)
            city = d.city;
            d3.select('.checked')
                .classed('checked',false)

            d3.select(this).classed('checked',true)

            mapClick(city);
        })
    });

})

function updateMap(data) {

    var mapG = d3.select('#map').select('g')
    
    mapG.selectAll("circle")
        .attr("fill", d => {
            let colorList = ['#0e550e','#d5eb14','#c29914']
            if (data[d.city] < 50) {
                return colorList[0]
            } else if (data[d.city] < 100) {
                return colorList[1]
            } else {
                return colorList[2]
            }
        })
        .attr("r", d => data[d.city]/4)

}