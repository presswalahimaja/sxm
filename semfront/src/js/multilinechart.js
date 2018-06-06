// Create chart legends
function createMultiSeriesLineChartLegend(mainDiv, columnsInfo, colorRange) {
  var z = d3.scaleOrdinal()
    .range(colorRange);
  var mainDivName = mainDiv.substr(1, mainDiv.length);
  $(mainDiv).before("<div id='Legend_" + mainDivName + "'  style='margin-top:0; margin-bottom:0;'></div>");
  var keys = Object.keys(columnsInfo);
  keys.forEach(function (d) {
    var cloloCode = z(d);
    $("#Legend_" + mainDivName).append("<span class='team-graph' style='display: inline-block; margin-left:10px;'>\
  			<span style='background:" + cloloCode + ";width: 10px;height: 10px;display: inline-block;vertical-align: middle;'>&nbsp;</span>\
  			<span style='padding-top: 0;font-family:Source Sans Pro, sans-serif;font-size: 13px;display: inline;'>" + columnsInfo[d] + " </span>\
  		</span>");
  });
}

// Create chart
function createMultiSeriesLineChart(config) {
  var keys = Object.keys(config.data[0]);
  var tempObj = {};
  keys.forEach(function (d) {
    tempObj[d] = 0;
  });
  config.data.splice(0, 0, tempObj);
  var data = config.data;
  var columnsInfo = config.columnsInfo;
  var xAxis = config.xAxis;
  var yAxis = config.yAxis;
  var overs = config.overs;
  var colorRange = config.colorRange;
  var mainDiv = config.mainDiv;
  var mainDivName = mainDiv.substr(1, mainDiv.length);
  var label = config.label;
  var requireCircle = config.requireCircle || false;
  var requireLegend = config.requireLegend;
  var imageData = config.imageData;
  d3.select(mainDiv).append("svg").attr("width", $(mainDiv).width()).attr("height", $(mainDiv).height());
  var svg = d3.select(mainDiv + " svg"),
    margin = {top: 20, right: 15, bottom: 30, left: 45},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  setTimeout(function () {
    var img = document.createElement('img');
    img.src = window.location.origin + imageData.url;
    var imgs = svg.selectAll("image").data([0]);
    imgs.enter()
      .append("svg:image")
      .attr("xlink:href", img.src)
      .attr("x", ((width / 2) - (imageData.width / 2)) + (margin.left / 1.5))
      .attr("y", (height / 2) - (imageData.height / 2))
      .attr("width", imageData.width)
      .attr("height", imageData.height)
      .attr("opacity", '0.13')
      .attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); opacity: 0.13;");

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	// draw legends
    if (requireLegend != null && requireLegend != undefined && requireLegend != false) {
      $("#Legend_" + mainDivName).remove();
      createMultiSeriesLineChartLegend(mainDiv, columnsInfo, colorRange);
    }

    var parseTime = d3.timeParse("%Y%m%d");
    var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal().range(colorRange);

    var line = d3.line()
      .x(function (d) {
        return x(d[xAxis]);
      })
      .y(function (d) {
        return y(d[yAxis]);
      });
    var columns = Object.keys(columnsInfo);
    var groupData = columns.map(function (id) {
      return {
        id: id,
        values: data.filter(function (d, i) {
          //CBT:remove last blank or value is 0 data to show only that much of line
          if ((d[id] != 0 && d[id] != null && d[id] != undefined) || i == 0) return d;
        }).map(function (d, i) {
          var tempObj = {};
          tempObj[xAxis] = d[xAxis];
          tempObj[yAxis] = d[id];
          return tempObj;
        })
      };
    });
	
	// X-axis ticks
	var maxOver = d3.max(data, function (d) {
		return d.over;		
	});
	if(overs <= 20){
		var overArray = [];
		for(var i=0; i<=overs; i++)
			overArray.push(i);
		x.domain(d3.extent(overArray, function (d) {
		  return d;
		}));
	}else{
		x.domain(d3.extent(data, function (d) {
		  return d[xAxis];
		}));
	}
    y.domain([
      d3.min(groupData, function (c) {
        return d3.min(c.values, function (d) {
          return d[yAxis];
        });
      }),
      d3.max(groupData, function (c) {
        return d3.max(c.values, function (d) {
          return d[yAxis];
        });
      })
    ]);
    z.domain(groupData.map(function (c) {
      return c.id;
    }));
	
	var divider = (maxOver <= 15) ? 3 : 5;
	var xTicks = (overs <= 20) ? overs : Math.ceil(maxOver/divider);
	xTicks = (xTicks < 2) ? 4 : xTicks;
	console.log(xTicks)
	// X-axis grids
	g.append("g")
      .attr("class", "x-grid gridline")
      .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x).ticks(xTicks).tickSize(-height).tickFormat(""))
	
	// Y-axis grids
	g.append("g")
      .attr("class", "y-grid gridline")
	  .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""))
	
	// X-axis ticks
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(xTicks))
      .append("text")
      .attr("x", width/2)
      .attr("y", margin.bottom * 0.9)
      .attr("dx", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text(label.xAxis);
	
	// Y-axis ticks
    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(5))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height/2))
	  .attr("y", "-35")
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .text(label.yAxis);

    var city = g.selectAll(".city")
      .data(groupData)
      .enter().append("g")
      .attr("class", "city");

    city.append("path")
      .attr("class", function(d ,i){
		  return "line line"+i;
	  })
      .attr("d", function (d) {
        return line(d.values);
      })
      .style("stroke", function (d) {
        return z(d.id);
      }).style("fill", "none").style("stroke-width", "3px");

    if (requireCircle == true) {
      //CBT:for wicket Circles in multiseries line chart
      var circleRadius = 6;
      var keys = Object.keys(columnsInfo);
      var element = g.append("g")
		.attr("class", "charttooltip")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function (d) {
          return "translate(" + x(d[xAxis]) + ",0)";
        });

      var circles = element.selectAll("circle")
        .data(function (d) {
          var teamWiseData = keys.map(function (key) {
            return {key: key, value: d[key], circles: d["circle_" + key], over: d.over};
          });

          var dataObj = [];
          teamWiseData.forEach(function (teamData) {
            if (teamData.circles != undefined && teamData.circles != 0 && teamData.circles.length > 0) {
              teamData.circles.forEach(function (data, i) {
                var tempObj = {};
                tempObj["key"] = teamData["key"];
                tempObj["value"] = teamData["value"];
                tempObj["circles"] = [data];
                tempObj["over"] = teamData["over"];
                tempObj["circleNumber"] = i;
                dataObj.push(tempObj);
              });
            } else {
              teamData["circles"] = [];
              teamData["circleNumber"] = 0;
              dataObj.push(teamData);
            }
          });
          return dataObj;
        })
        .enter().append("circle")
        .attr("cx", function (d) {
          return 0;
        })
        .attr("cy", function (d) {
          return y(d.value) + (d.circleNumber * (circleRadius * 2));
        })
        .attr("r", circleRadius)
        .attr("fill", "#fff")
        .attr("stroke", function (d) {
          if (d.circles == undefined || d.circles.length <= 0) {
            return "#fff";
          } else {
            return z(d.key);
          }
        })
        .attr("data", function (d) {
          var data = {};
          data["over"] = d.over;
          data["runs"] = d.value;
          if (d.circles != undefined && d.circles.length > 0) {
            data["circles"] = d.circles
            // return JSON.stringify(d.circles);
          }
          else {
            data["circles"] = [];
          }
          return JSON.stringify(data);
        })
        .attr("stroke-width", "2px")
        .attr("fill-opacity", function (d) {
          if (d.circles == undefined || d.circles.length <= 0) {
            return 0.05;
          } else {
            return 1.0;
          }
        })
        .attr("stroke-opacity", function (d) {
          if (d.circles == undefined || d.circles.length <= 0) {
            return 0.05;
          } else {
            return 1.0;
          }
        });
		
      circles.on("mouseover", function () {
        var currentEl = d3.select(this);
        currentEl.attr("r", 7);
        var fadeInSpeed = 120;
        d3.select("#circletooltip_" + mainDivName)
          .transition()
          .duration(fadeInSpeed)
          .style("opacity", function () {
            return 1;
          });
        d3.select("#circletooltip_" + mainDivName).attr("transform", function (d) {
          var mouseCoords = d3.mouse(this.parentNode);
          var xCo = 0;
          if (mouseCoords[0] + 10 >= width * 0.80) {
            xCo = mouseCoords[0] - parseFloat(d3.selectAll("#circletooltipRect_" + mainDivName)
                .attr("width"));
          } else {
            xCo = mouseCoords[0] + 10;
          }
          var x = xCo;
          var yCo = 0;
          if (mouseCoords[0] + 10 >= width * 0.80) {
            yCo = mouseCoords[1] + 10;
          } else {
            yCo = mouseCoords[1];
          }
          var x = xCo;
          var y = yCo;
          return "translate(" + x + "," + y + ")";
        });
        //CBT:calculate tooltips text
        var wicketData = JSON.parse(currentEl.attr("data"));
        var tooltipsText = "";
        d3.selectAll("#circletooltipText_" + mainDivName).text("");
        var yPos = 0;
        d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos).attr("dy", "1.2em").text(label.xAxis + ":  " + wicketData.over);
        yPos = yPos + 1;
        d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.5em").text(label.yAxis + ":  " + wicketData.runs);
        wicketData.circles.forEach(function (d, i) {
          yPos = yPos + 1;
          d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.9em").text(d["name"] + " - (" + d["at"] + ")");
        });
        //CBT:calculate width of the text based on characters
        var dims = helpers.getDimensions("circletooltipText_" + mainDivName);
        d3.selectAll("#circletooltipText_" + mainDivName + " tspan")
          .attr("x", dims.w + 2);

        d3.selectAll("#circletooltipRect_" + mainDivName)
          .attr("width", dims.w + 10)
          .attr("height", dims.h + 10);

      });
      circles.on("mousemove", function () {
        var currentEl = d3.select(this);
        currentEl.attr("r", 7);
        d3.selectAll("#circletooltip_" + mainDivName)
          .attr("transform", function (d) {
            var mouseCoords = d3.mouse(this.parentNode);
            var xCo = 0;
            if (mouseCoords[0] + 10 >= width * 0.80) {
              xCo = mouseCoords[0] - parseFloat(d3.selectAll("#circletooltipRect_" + mainDivName)
                  .attr("width"));
            } else {
              xCo = mouseCoords[0] + 10;
            }
            var x = xCo;
            var yCo = 0;
            if (mouseCoords[0] + 10 >= width * 0.80) {
              yCo = mouseCoords[1] + 10;
            } else {
              yCo = mouseCoords[1];
            }
            var x = xCo;
            var y = yCo;
            return "translate(" + x + "," + y + ")";
          });
      });
      circles.on("mouseout", function () {
        var currentEl = d3.select(this);
        currentEl.attr("r", 6);
        d3.select("#circletooltip_" + mainDivName)
          .style("opacity", function () {
            return 0;
          })
          .attr("transform", function (d, i) {
            var x = -500;
            var y = -500;
            return "translate(" + x + "," + y + ")";
          });
      });

      //CBT:END: for wicket Circles in multiseries line chart
      //CBT:circle tooltips start
      var circleTooltipg = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 9)
        .attr("text-anchor", "end")
        .attr("id", "circletooltip_" + mainDivName)
        .attr("style", "opacity:0")
        .attr("transform", "translate(-500,-500)");

      circleTooltipg.append("rect")
        .attr("id", "circletooltipRect_" + mainDivName)
        .attr("x", 0)
        .attr("width", 120)
        .attr("height", 80)
        .attr("opacity", 0.71)
        .style("fill", "#000000");

      circleTooltipg
        .append("text")
        .attr("id", "circletooltipText_" + mainDivName)
        .attr("x", 10)
        .attr("y", 10)
        .attr("fill", function () {
          return "#fff"
        })
        .style("font-size", function (d) {
          return 9;
        })
        .style("font-family", function (d) {
          return "sans-serif";
        })
        .text(function (d, i) {
          return "";
        });
    }
  }, 300);
}

// Redraw charts on auto refresh
function drawMultiSeriesLineChart(config) {
  var keys = Object.keys(config.data[0]);
  var tempObj = {};
  keys.forEach(function (d) {
    tempObj[d] = 0;
  });
  config.data.splice(0, 0, tempObj);	
  var data = config.data;
  var columnsInfo = config.columnsInfo;
  var colorRange = config.colorRange;
  var xAxis = config.xAxis;
  var yAxis = config.yAxis;
  var overs = config.overs;
  var mainDiv = config.mainDiv;
  var mainDivName = mainDiv.substr(1, mainDiv.length);
  var label = config.label;
  var requireCircle = config.requireCircle || false;
  
	var svgtrans = d3.select(mainDiv).transition();
	var svg = d3.select(mainDiv + " svg"),
		margin = {top: 20, right: 15, bottom: 30, left: 45},
		width  = svg.attr("width") - margin.left - margin.right,
		height = svg.attr("height") - margin.top - margin.bottom;	
	
	var columns = Object.keys(columnsInfo);
	var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal().range(colorRange);
		
	var groupData = columns.map(function (id) {
      return {
        id: id,
        values: data.filter(function (d, i) {
          if ((d[id] != 0 && d[id] != null && d[id] != undefined) || i == 0) return d;
        }).map(function (d, i) {
          var tempObj = {};
          tempObj[xAxis] = d[xAxis];
          tempObj[yAxis] = d[id];
          return tempObj;
        })
      };
    });
	
	// X-axis ticks
	var maxOver = d3.max(data, function (d) {
		return d.over;		
	});
	if(overs <= 20){
		var overArray = [];
		for(var i=0; i<=overs; i++)
			overArray.push(i);
		x.domain(d3.extent(overArray, function (d) {
		  return d;
		}));
	}else{
		x.domain(d3.extent(data, function (d) {
		  return d[xAxis];
		}));
	}
    y.domain([
      d3.min(groupData, function (c) {
        return d3.min(c.values, function (d) {
          return d[yAxis];
        });
      }),
      d3.max(groupData, function (c) {
        return d3.max(c.values, function (d) {
          return d[yAxis];
        });
      })
    ]);
    z.domain(groupData.map(function (c) {
      return c.id;
    }));
	
	var line = d3.line()
      .x(function(d){ return x(d[xAxis]) })
      .y(function(d){ return y(d[yAxis]) });
	
	if (requireCircle == true) {
	var circleRadius = 6;
	var keys = Object.keys(columnsInfo);
	
	svg.select(".charttooltip").remove();
	var element = svg.select("g").append("g")
        .attr("class", "charttooltip")
		.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function (d) {
          return "translate(" + x(d[xAxis]) + ",0)";
        });

      var circles = element.selectAll("circle")
        .data(function (d) {
          var teamWiseData = keys.map(function (key) {
            return {key: key, value: d[key], circles: d["circle_" + key], over: d.over};
          });
          var dataObj = [];
          teamWiseData.forEach(function (teamData) {
            if (teamData.circles != undefined && teamData.circles != 0 && teamData.circles.length > 0) {
              teamData.circles.forEach(function (data, i) {
                var tempObj = {};
                tempObj["key"] = teamData["key"];
                tempObj["value"] = teamData["value"];
                tempObj["circles"] = [data];
                tempObj["over"] = teamData["over"];
                tempObj["circleNumber"] = i;
                dataObj.push(tempObj);
              });
            } else {
              teamData["circles"] = [];
              teamData["circleNumber"] = 0;
              dataObj.push(teamData);
            }
          });
          return dataObj;
        })
        .enter().append("circle")
        .attr("cx", function (d) {
          return 0;
        })
        .attr("cy", function (d) {
          return y(d.value) + (d.circleNumber * (circleRadius * 2));
        })
        .attr("r", circleRadius)
        .attr("fill", "#fff")
        .attr("stroke", function (d) {
          if (d.circles == undefined || d.circles.length <= 0) {
            return "#fff";
          } else {
            return z(d.key);
          }
        })
        .attr("data", function (d) {
          var data = {};
          data["over"] = d.over;
          data["runs"] = d.value;
          if (d.circles != undefined && d.circles.length > 0) {
            data["circles"] = d.circles
            // return JSON.stringify(d.circles);
          }
          else {
            data["circles"] = [];
          }
          return JSON.stringify(data);
        })
        .attr("stroke-width", "2px")
        .attr("fill-opacity", function (d) {
          if (d.circles == undefined || d.circles.length <= 0) {
            return 0.05;
          } else {
            return 1.0;
          }
        })
        .attr("stroke-opacity", function (d) {
          if (d.circles == undefined || d.circles.length <= 0) {
            return 0.05;
          } else {
            return 1.0;
          }
        });
		
      circles.on("mouseover", function () {
        var currentEl = d3.select(this);
        currentEl.attr("r", 7);
        var fadeInSpeed = 120;
        d3.select("#circletooltip_" + mainDivName)
          .transition()
          .duration(fadeInSpeed)
          .style("opacity", function () {
            return 1;
          });
        d3.select("#circletooltip_" + mainDivName).attr("transform", function (d) {
          var mouseCoords = d3.mouse(this.parentNode);
          var xCo = 0;
          if (mouseCoords[0] + 10 >= width * 0.80) {
            xCo = mouseCoords[0] - parseFloat(d3.selectAll("#circletooltipRect_" + mainDivName)
                .attr("width"));
          } else {
            xCo = mouseCoords[0] + 10;
          }
          var x = xCo;
          var yCo = 0;
          if (mouseCoords[0] + 10 >= width * 0.80) {
            yCo = mouseCoords[1] + 10;
          } else {
            yCo = mouseCoords[1];
          }
          var x = xCo;
          var y = yCo;
          return "translate(" + x + "," + y + ")";
        });
        //CBT:calculate tooltips text
        var wicketData = JSON.parse(currentEl.attr("data"));
        var tooltipsText = "";
        d3.selectAll("#circletooltipText_" + mainDivName).text("");
        var yPos = 0;
        d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos).attr("dy", "1.2em").text(label.xAxis + ":  " + wicketData.over);
        yPos = yPos + 1;
        d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.5em").text(label.yAxis + ":  " + wicketData.runs);
        wicketData.circles.forEach(function (d, i) {
          yPos = yPos + 1;
          d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.9em").text(d["name"] + " - (" + d["at"] + ")");
        });
        //CBT:calculate width of the text based on characters
        var dims = helpers.getDimensions("circletooltipText_" + mainDivName);
        d3.selectAll("#circletooltipText_" + mainDivName + " tspan")
          .attr("x", dims.w + 2);

        d3.selectAll("#circletooltipRect_" + mainDivName)
          .attr("width", dims.w + 10)
          .attr("height", dims.h + 10);

      });
      circles.on("mousemove", function () {
        var currentEl = d3.select(this);
        currentEl.attr("r", 7);
        d3.selectAll("#circletooltip_" + mainDivName)
          .attr("transform", function (d) {
            var mouseCoords = d3.mouse(this.parentNode);
            var xCo = 0;
            if (mouseCoords[0] + 10 >= width * 0.80) {
              xCo = mouseCoords[0] - parseFloat(d3.selectAll("#circletooltipRect_" + mainDivName)
                  .attr("width"));
            } else {
              xCo = mouseCoords[0] + 10;
            }
            var x = xCo;
            var yCo = 0;
            if (mouseCoords[0] + 10 >= width * 0.80) {
              yCo = mouseCoords[1] + 10;
            } else {
              yCo = mouseCoords[1];
            }
            var x = xCo;
            var y = yCo;
            return "translate(" + x + "," + y + ")";
          });
      });
      circles.on("mouseout", function () {
        var currentEl = d3.select(this);
        currentEl.attr("r", 6);
        d3.select("#circletooltip_" + mainDivName)
          .style("opacity", function () {
            return 0;
          })
          .attr("transform", function (d, i) {
            var x = -500;
            var y = -500;
            return "translate(" + x + "," + y + ")";
          });
      });
	}
	  
	// change lines
	var city = svg.selectAll(".city")
				.data(groupData);
	
	var newLine = city.select("path")
		.attr("d", function(d){
			return line(d.values);
		});
	
	svgtrans.select(".city line")
		.duration(750)
	
	var divider = (maxOver <= 15) ? 3 : 5;
	var xTicks = (overs <= 20) ? overs : Math.ceil(maxOver/divider);
	xTicks = (xTicks < 2) ? 4 : xTicks;
	
	// change x-axis grids
	svgtrans.select(".x-grid.gridline")
		.duration(750)
	    .call(d3.axisBottom(x).ticks(xTicks).tickSize(-height).tickFormat(""))
	
	// change y-axis grids
	svgtrans.select(".y-grid.gridline")
		.duration(750)
	    .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""))
	
	// change x-axis ticks
	svgtrans.select(".axis.axis--x") 
		.duration(750)
		.call(d3.axisBottom(x).ticks(xTicks));

	// change y-axis ticks		
	svgtrans.select(".axis.axis--y")
        .duration(750)
        .call(d3.axisLeft(y).ticks(5));
	
}

// Create chart
function createGroupBarChart(config) {
  var data = config.data;
  var columnsInfo = config.columnsInfo;
  var xAxis = config.xAxis;
  var yAxis = config.yAxis;
  var overs = config.overs;
  var startover = config.startover;				
  var endover = config.endover;
  var colorRange = config.colorRange;
  var mainDiv = config.mainDiv;
  var mainDivName = mainDiv.substr(1, mainDiv.length);
  var label = config.label;
  var requireLegend = config.requireLegend;
  var imageData = config.imageData;
  d3.select(mainDiv).append("svg").attr("width", $(mainDiv).width()).attr("height", $(mainDiv).height());
  var svg = d3.select(mainDiv + " svg"),
    margin = {top: 20, right: 15, bottom: 30, left: 45},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
	
  setTimeout(function () {
    var img = document.createElement('img');
    img.src = window.location.origin + imageData.url;
    var imgs = svg.selectAll("image").data([0]);
    imgs.enter()
      .append("svg:image")
      .attr("xlink:href", img.src)
      .attr("x", ((width / 2) - (imageData.width / 2)) + (margin.left / 1.5))
      .attr("y", (height / 2) - (imageData.height / 2))
      .attr("width", imageData.width)
      .attr("height", imageData.height)
      .attr("opacity", '0.13')
      .attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); opacity: 0.13;");
	  
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (requireLegend != null && requireLegend != undefined && requireLegend != false) {
      $("#Legend_" + mainDivName).remove();
      createMultiSeriesLineChartLegend(mainDiv, columnsInfo, colorRange);

    }
    var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
    var x1 = d3.scaleBand().padding(0.05);
    var y  = d3.scaleLinear().rangeRound([height, 0]);
    var z  = d3.scaleOrdinal().range(colorRange);

    var keys = Object.keys(columnsInfo);
	var overArray = [];
	for(var i=startover; i<=endover; i++)
		overArray.push({'over':i});
	x0.domain(overArray.map(function (d) {
      return d[xAxis];
    }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function (d) {
      return d3.max(keys, function (key) {
        return d[key];
      });
    })]).nice();

    var element = g.append("g")
	  .attr("class", "chartbar")
      .selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function (d) {
        return "translate(" + x0(d[xAxis]) + ",0)";
      });
	  
    var rect = element.selectAll("rect")
      .data(function (d, i) {
        return keys.map(function (key) {
          return {key: key, value: d[key], index: key + "_" + i + "_" + d[xAxis]};
        });
      })
      .enter().append("rect")
      .attr("x", function (d) {
        return x1(d.key);
      })
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("width", x1.bandwidth())
      .attr("data-index", function (d, i) {
        return d.index;
      })
      .attr("height", function (d) {
        return height - y(d.value);
      })
      .attr("fill", function (d) {
        return z(d.key);
      });

    rect.on("mouseover", function () {
      var currentEl = d3.select(this);
      var index = currentEl.attr("data-index");
      barTooltip.showTooltip(self, index);
    });
    rect.on("mouseout", function () {
      var currentEl = d3.select(this);
      var index = currentEl.attr("data-index");
      barTooltip.hideTooltip(self, index);
    });
    rect.on("mousemove", function () {
      barTooltip.moveTooltip(self);
    });

    var circleRadius = x1.bandwidth()*0.4;
    var circles = element.selectAll("circle")
      .data(function (d) {
        var teamWiseData = keys.map(function (key) {
          return {key: key, value: d[key], circles: d["circle_" + key], over: d.over};
        });

        var dataObj = [];
        teamWiseData.forEach(function (teamData) {
          if (teamData.circles != undefined && teamData.circles != 0 && teamData.circles.length > 0) {
            teamData.circles.forEach(function (data, i) {
              var tempObj = {};
              tempObj["key"] = teamData["key"];
              tempObj["value"] = teamData["value"];
              tempObj["circles"] = [data];
              tempObj["over"] = teamData["over"];
              tempObj["circleNumber"] = i;
              dataObj.push(tempObj);
            });
          } else {
            teamData["circleNumber"] = 0;
            dataObj.push(teamData);
          }
        });
        return dataObj;
      })
      .enter().append("circle")
      .attr("cx", function (d) {
        return x1(d.key) + (x1.bandwidth() / 2);
      })
      .attr("cy", function (d) {
        if((y(d.value)-(circleRadius*0.9)) - (d.circleNumber * (circleRadius * 2))<0){
          return (y(d.value)+(circleRadius)) + (d.circleNumber * (circleRadius * 2));
        }else{
          return (y(d.value)-(circleRadius*0.9)) - (d.circleNumber * (circleRadius * 2));
        }
      })
      .attr("r", circleRadius)
      .attr("fill", "#fff")
      .attr("stroke", function (d) {
        return z(d.key);
      })
      .attr("data", function (d) {
        var data = {};
        data["over"] = d.over;
        data["runs"] = d.value;
        if (d.circles != undefined && d.circles.length > 0) {
          data["circles"] = d.circles
          // return JSON.stringify(d.circles);
        }
        else {
          data["circles"] = [];
        }
        return JSON.stringify(data);
      })
      .attr("stroke-width", "2px").attr("display", function (d) {
      if (d.circles == undefined || d.circles.length <= 0) {
        return "none";
      } else {
        return "block";
      }
    });

    circles.on("mouseover", function () {
      var currentEl = d3.select(this);
      currentEl.attr("r", parseFloat(currentEl.attr("r"))+1);
	  
      var fadeInSpeed = 120;
      d3.select("#circletooltip_" + mainDivName)
        .transition()
        .duration(fadeInSpeed)
        .style("opacity", function () {
          return 1;
        });
      d3.select("#circletooltip_" + mainDivName)
        .attr("transform", function (d) {
          var mouseCoords = d3.mouse(this.parentNode);
          var xCo=0;
          if(mouseCoords[0] + 10 >=width*0.80){
            xCo=mouseCoords[0]-parseFloat(d3.selectAll("#circletooltipRect_" + mainDivName)
                .attr("width"));
          }else{
            xCo=mouseCoords[0] + 10;
          }
          var x = xCo;
          var yCo=0;
          if(mouseCoords[0] + 10 >=width*0.80){
            yCo=mouseCoords[1]+10;
          }else{
            yCo=mouseCoords[1];
          }
          var x = xCo;
          var y = yCo;
          return "translate(" + x + "," + y + ")";
        });
      
	  //CBT:calculate tooltips text
      var wicketData = JSON.parse(currentEl.attr("data"));
      var tooltipsText = "";
      d3.selectAll("#circletooltipText_" + mainDivName).text("");
      var yPos = 0;
      d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.2em").text(label.xAxis + ":  " + wicketData.over);
      yPos = yPos + 1;
      d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.5em").text(label.yAxis + ":  " + wicketData.runs);
      wicketData.circles.forEach(function (d, i) {
        yPos = yPos + 1;
        d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.9em").text(d["name"] + " - (" + d["at"] + ")");
      });
      
	  //CBT:calculate width of the text based on characters
      var dims = helpers.getDimensions("circletooltipText_" + mainDivName);
      d3.selectAll("#circletooltipText_" + mainDivName + " tspan").attr("x", dims.w + 2);
      d3.selectAll("#circletooltipRect_" + mainDivName).attr("width", dims.w + 10).attr("height", dims.h + 10);

    });
    circles.on("mousemove", function () {
      var currentEl = d3.select(this);
      d3.selectAll("#circletooltip_" + mainDivName)
        .attr("transform", function (d) {
          var mouseCoords = d3.mouse(this.parentNode);
          var xCo=0;
          if(mouseCoords[0] + 10 >=width*0.80){
            xCo=mouseCoords[0]-parseFloat(d3.selectAll("#circletooltipRect_" + mainDivName)
                .attr("width"));
          }else{
            xCo=mouseCoords[0] + 10;
          }
          var yCo=0;
          if(mouseCoords[0] + 10 >=width*0.80){
            yCo=mouseCoords[1]+10;
          }else{
            yCo=mouseCoords[1];
          }
          var x = xCo;
          var y = yCo;
          return "translate(" + x + "," + y + ")";
        });
    });
    circles.on("mouseout", function () {
      var currentEl = d3.select(this);
      currentEl.attr("r", parseFloat(currentEl.attr("r"))-1);
      d3.select("#circletooltip_" + mainDivName)
        .style("opacity", function () {
          return 0;
        });
      d3.select("#circletooltip_" + mainDivName).attr("transform", function (d, i) {
          var x = -500;
          var y = -500;
          return "translate(" + x + "," + y + ")";
        });
    });

    var self = {};
    self.svg = svg;
    self.cssPrefix = "groupBar0_";
    self.data = data;
    self.keys = keys;
    self.height = height;
    self.width = width;
    self.label = label;
    self.yAxis = yAxis;
    self.xAxis = xAxis;
    barTooltip.addTooltips(self);	
	
    //CBT:circle tooltips start
    var circleTooltipg = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 9)
      .attr("text-anchor", "end")
      .attr("id", "circletooltip_" + mainDivName)
      .attr("style", "opacity:0")
      .attr("transform", "translate(-500,-500)");

    circleTooltipg.append("rect")
      .attr("id", "circletooltipRect_" + mainDivName)
      .attr("x", 0)
      .attr("width", 120)
      .attr("height", 80)
      .attr("opacity", 0.71)
      .style("fill", "#000000");

    circleTooltipg
      .append("text")
      .attr("id", "circletooltipText_" + mainDivName)
      .attr("x", 10)
      .attr("y", 10)
      .attr("fill", function () {
        return "#fff"
      })
      .style("font-size", function (d) {
        return 9;
      })
      .style("font-family", function (d) {
        return "sans-serif";
      })
      .text(function (d, i) {
        return "";
      });
	
	var xTicks = (endover - startover) + 1;
	// X-axis ticks
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0).ticks(xTicks))
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.bottom * 0.9)
      .attr("dx", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text(label.xAxis);

	// Y-axis ticks
    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(5))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height/2))
	  .attr("y", "-35")
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .text(label.yAxis);
  }, 300);
  setTimeout(function(){
	drawGroupBarChart(config);	
  }, 1000);
  
}

// Redraw charts on auto refresh
function drawGroupBarChart(config) {
  var data = config.data;
  var columnsInfo = config.columnsInfo;
  var colorRange = config.colorRange;
  var xAxis = config.xAxis;
  var yAxis = config.yAxis; 
  var overs = config.overs;
  var startover = config.startover;
  var endover = config.endover;  
  var mainDiv = config.mainDiv;
  var mainDivName = mainDiv.substr(1, mainDiv.length);
  var label = config.label;
  var requireLegend = config.requireLegend;
  
  var svgtrans = d3.select(mainDiv).transition();
  var svg = d3.select(mainDiv + " svg"),
	margin = {top: 20, right: 15, bottom: 30, left: 45},
	width  = svg.attr("width") - margin.left - margin.right,
	height = svg.attr("height") - margin.top - margin.bottom;  
	
	var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
    var x1 = d3.scaleBand().padding(0.05);
    var y  = d3.scaleLinear().rangeRound([height, 0]);
    var z  = d3.scaleOrdinal().range(colorRange);

    var keys = Object.keys(columnsInfo);
	var overArray = [];
	for(var i=startover; i<=endover; i++)
		overArray.push({'over':i});
	x0.domain(overArray.map(function (d) {
      return d[xAxis];
    }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function (d) {
      return d3.max(keys, function (key) {
        return d[key];
      });
    })]).nice();
	
	svg.select(".chartbar").remove();
	svg.selectAll(".bartooltip").remove();
	svg.select("#circletooltip_" + mainDivName).remove();
	
	var element = svg.select("g").append("g")
	  .attr("class", "chartbar")
      .selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function (d) {
        return "translate(" + x0(d[xAxis]) + ",0)";
      });
	
	var rect = element.selectAll("rect")
      .data(function (d, i) {
        return keys.map(function (key) {
          return {key: key, value: d[key], index: key + "_" + i + "_" + d[xAxis]};
        });
      })
      .enter().append("rect")
      .attr("x", function (d) {
        return x1(d.key);
      })
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("width", x1.bandwidth())
      .attr("data-index", function (d, i) {
        return d.index;
      })
      .attr("height", function (d) {
        return height - y(d.value);
      })
      .attr("fill", function (d) {
        return z(d.key);
      });

	var self = {};
    self.svg = svg;
    self.cssPrefix = "groupBar0_";
    self.data = data;
    self.keys = keys;
    self.height = height;
    self.width = width;
    self.label = label;
    self.yAxis = yAxis;
    self.xAxis = xAxis;
    barTooltip.addTooltips(self);
	  
	rect.on("mouseover", function () {
      var currentEl = d3.select(this);
      var index = currentEl.attr("data-index");
      barTooltip.showTooltip(self, index);
    });
    rect.on("mouseout", function () {
      var currentEl = d3.select(this);
      var index = currentEl.attr("data-index");
      barTooltip.hideTooltip(self, index);
    });
    rect.on("mousemove", function () {
      barTooltip.moveTooltip(self);
    });

    var circleRadius = x1.bandwidth()*0.4;
    var circles = element.selectAll("circle")
      .data(function (d) {
        var teamWiseData = keys.map(function (key) {
          return {key: key, value: d[key], circles: d["circle_" + key], over: d.over};
        });
        var dataObj = [];
        teamWiseData.forEach(function (teamData) {
          if (teamData.circles != undefined && teamData.circles != 0 && teamData.circles.length > 0) {
            teamData.circles.forEach(function (data, i) {
              var tempObj = {};
              tempObj["key"] = teamData["key"];
              tempObj["value"] = teamData["value"];
              tempObj["circles"] = [data];
              tempObj["over"] = teamData["over"];
              tempObj["circleNumber"] = i;
              dataObj.push(tempObj);
            });
          } else {
            teamData["circleNumber"] = 0;
            dataObj.push(teamData);
          }
        });
        return dataObj;
      })
      .enter().append("circle")
      .attr("cx", function (d) {
        return x1(d.key) + (x1.bandwidth() / 2);
      })
      .attr("cy", function (d) {
        if((y(d.value)-(circleRadius*0.9)) - (d.circleNumber * (circleRadius * 2))<0){
          return (y(d.value)+(circleRadius)) + (d.circleNumber * (circleRadius * 2));
        }else{
          return (y(d.value)-(circleRadius*0.9)) - (d.circleNumber * (circleRadius * 2));
        }
      })
      .attr("r", circleRadius)
      .attr("fill", "#fff")
      .attr("stroke", function (d) {
        return z(d.key);
      })
      .attr("data", function (d) {
        var data = {};
        data["over"] = d.over;
        data["runs"] = d.value;
        if (d.circles != undefined && d.circles.length > 0) {
          data["circles"] = d.circles
        }
        else {
          data["circles"] = [];
        }
        return JSON.stringify(data);
      })
      .attr("stroke-width", "2px").attr("display", function (d) {
      if (d.circles == undefined || d.circles.length <= 0) {
        return "none";
      } else {
        return "block";
      }
    });

    circles.on("mouseover", function () {
      var currentEl = d3.select(this);
      currentEl.attr("r", parseFloat(currentEl.attr("r"))+1);
	  
      var fadeInSpeed = 120;
      d3.select("#circletooltip_" + mainDivName)
        .transition()
        .duration(fadeInSpeed)
        .style("opacity", function () {
          return 1;
        });
      d3.select("#circletooltip_" + mainDivName)
        .attr("transform", function (d) {
          var mouseCoords = d3.mouse(this.parentNode);
          var xCo=0;
          if(mouseCoords[0] + 10 >=width*0.80){
            xCo=mouseCoords[0]-parseFloat(d3.selectAll("#circletooltipRect_" + mainDivName)
                .attr("width"));
          }else{
            xCo=mouseCoords[0] + 10;
          }
          var x = xCo;
          var yCo=0;
          if(mouseCoords[0] + 10 >=width*0.80){
            yCo=mouseCoords[1]+10;
          }else{
            yCo=mouseCoords[1];
          }
          var x = xCo;
          var y = yCo;
          return "translate(" + x + "," + y + ")";
        });
      
	  //CBT:calculate tooltips text
      var wicketData = JSON.parse(currentEl.attr("data"));
      var tooltipsText = "";
      d3.selectAll("#circletooltipText_" + mainDivName).text("");
      var yPos = 0;
      d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.2em").text(label.xAxis + ":  " + wicketData.over);
      yPos = yPos + 1;
      d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.5em").text(label.yAxis + ":  " + wicketData.runs);
      wicketData.circles.forEach(function (d, i) {
        yPos = yPos + 1;
        d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.9em").text(d["name"] + " - (" + d["at"] + ")");
      });
      
	  //CBT:calculate width of the text based on characters
      var dims = helpers.getDimensions("circletooltipText_" + mainDivName);
      d3.selectAll("#circletooltipText_" + mainDivName + " tspan").attr("x", dims.w + 2);
      d3.selectAll("#circletooltipRect_" + mainDivName).attr("width", dims.w + 10).attr("height", dims.h + 10);

    });
    circles.on("mousemove", function () {
      var currentEl = d3.select(this);
      d3.selectAll("#circletooltip_" + mainDivName)
        .attr("transform", function (d) {
          var mouseCoords = d3.mouse(this.parentNode);
          var xCo=0;
          if(mouseCoords[0] + 10 >=width*0.80){
            xCo=mouseCoords[0]-parseFloat(d3.selectAll("#circletooltipRect_" + mainDivName)
                .attr("width"));
          }else{
            xCo=mouseCoords[0] + 10;
          }
          var yCo=0;
          if(mouseCoords[0] + 10 >=width*0.80){
            yCo=mouseCoords[1]+10;
          }else{
            yCo=mouseCoords[1];
          }
          var x = xCo;
          var y = yCo;
          return "translate(" + x + "," + y + ")";
        });
    });
    circles.on("mouseout", function () {
      var currentEl = d3.select(this);
      currentEl.attr("r", parseFloat(currentEl.attr("r"))-1);
      d3.select("#circletooltip_" + mainDivName)
        .style("opacity", function () {
          return 0;
        });
      d3.select("#circletooltip_" + mainDivName).attr("transform", function (d, i) {
          var x = -500;
          var y = -500;
          return "translate(" + x + "," + y + ")";
        });
    });
	
	//CBT:circle tooltips start
    var circleTooltipg = svg.select("g").append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 9)
      .attr("text-anchor", "end")
      .attr("id", "circletooltip_" + mainDivName)
      .attr("style", "opacity:0")
      .attr("transform", "translate(-500,-500)");

    circleTooltipg.append("rect")
      .attr("id", "circletooltipRect_" + mainDivName)
      .attr("x", 0)
      .attr("width", 120)
      .attr("height", 80)
      .attr("opacity", 0.71)
      .style("fill", "#000000");

    circleTooltipg
      .append("text")
      .attr("id", "circletooltipText_" + mainDivName)
      .attr("x", 10)
      .attr("y", 10)
      .attr("fill", function () {
        return "#fff"
      })
      .style("font-size", function (d) {
        return 9;
      })
      .style("font-family", function (d) {
        return "sans-serif";
      })
      .text(function (d, i) {
        return "";
      });
	
	var xTicks = (endover - startover) + 1;
	// change x-axis ticks
	svgtrans.select(".axis.axis--x") 
		.duration(750)
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x0).ticks(xTicks));
	
	// change y-axis ticks		
	svgtrans.select(".axis.axis--y")
        .duration(750)
        .call(d3.axisLeft(y).ticks(5));	
	
}

// Get element dimenstions - popups
var helpers = {
  getDimensions: function (id) {
    var el = document.getElementById(id);
    var w = 0, h = 0;
    if (el) {
      var dimensions = el.getBBox();
      w = dimensions.width;
      h = dimensions.height;
    } else {
      console.log("error: getDimensions() " + id + " not found.");
    }
    return {w: w, h: h};
  }
};

// Tooltip popup
var barTooltip = {
  addTooltips: function (pie) {
    var keys = pie.keys;
    // group the label groups (label, percentage, value) into a single element for simpler positioning
    var element = pie.svg.append("g")
	  .attr("class", "bartooltip")	
      .selectAll("g")
      .data(pie.data)
      .enter().append("g")
      .attr("class", function (d, i) {
        return pie.cssPrefix + "tooltips" + "_" + i
      });

    tooltips = element.selectAll("g")
      .data(function (d, i) {
        return keys.map(function (key) {
          return {key: key, value: d[key], index: key + "_" + i + "_" + d[pie.xAxis]};
        });
      })
      .enter()
      .append("g")
      .attr("class", pie.cssPrefix + "tooltip")
      .attr("id", function (d, i) {
        return pie.cssPrefix + "tooltip" + d.index;
      })
      .style("opacity", 0)
      .append("rect")
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("x", -2)
      .attr("opacity", 0.71)
      .style("fill", "#000000");

    element.selectAll("g")
      .data(function (d, i) {
        return keys.map(function (key) {
          return {key: key, value: d[key], index: key + "_" + i + "_" + d[pie.xAxis]};
        });
      })
      .append("text")
      .attr("fill", function (d) {
        return "#efefef"
      })
      .style("font-size", function (d) {
        return 9;
      })
      .style("font-family", function (d) {
        return "sans-serif";
      })
      .text(function (d, i) {
        var caption = "Runs:{runs}";
        return barTooltip.replacePlaceholders(pie, caption, i, {
          runs: d.value,
        });
      });

    element.selectAll("g rect")
      .attr("width", function (d, i) {
        var dims = helpers.getDimensions(pie.cssPrefix + "tooltip" + d.index);
        return dims.w + (2 * 4);
      })
      .attr("height", function (d, i) {
        var dims = helpers.getDimensions(pie.cssPrefix + "tooltip" + d.index);
        return dims.h + (2 * 4);
      })
      .attr("y", function (d, i) {
        var dims = helpers.getDimensions(pie.cssPrefix + "tooltip" + d.index);
        return -(dims.h / 2) + 1;
      });
  },

  showTooltip: function (pie, index) {
    var fadeInSpeed = 250;
    if (barTooltip.currentTooltip === index) {
      fadeInSpeed = 1;
    }

    barTooltip.currentTooltip = index;
    d3.select("#" + pie.cssPrefix + "tooltip" + index)
      .transition()
      .duration(fadeInSpeed)
      .style("opacity", function () {
        return 1;
      });

    barTooltip.moveTooltip(pie);
  },

  moveTooltip: function (pie) {
    d3.selectAll("#" + pie.cssPrefix + "tooltip" + barTooltip.currentTooltip)
      .attr("transform", function (d) {
        var mouseCoords = d3.mouse(this.parentNode);
        var x = mouseCoords[0] + 4 + 2;
        var y = mouseCoords[1] - (2 * 4) - 2;
        return "translate(" + x + "," + y + ")";
      });
  },

  hideTooltip: function (pie, index) {
    d3.select("#" + pie.cssPrefix + "tooltip" + index)
      .style("opacity", function () {
        return 0;
      });

    // move the tooltip offscreen. This ensures that when the user next mouseovers the segment the hidden
    // element won't interfere
    d3.select("#" + pie.cssPrefix + "tooltip" + barTooltip.currentTooltip)
      .attr("transform", function (d, i) {
        var x = pie.width + 1000;
        var y = pie.height + 1000;
        return "translate(" + x + "," + y + ")";
      });
  },

  replacePlaceholders: function (pie, str, index, replacements) {
    var replacer = function () {
      return function (match) {
        var placeholder = arguments[1];
        if (replacements.hasOwnProperty(placeholder)) {
          return replacements[arguments[1]];
        } else {
          return arguments[0];
        }
      };
    };
    return str.replace(/\{(\w+)\}/g, replacer(replacements));
  }
};