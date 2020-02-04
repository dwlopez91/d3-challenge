var svgWidth = 1200;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthData, err) {
  if (err) throw err;

  // parse data
  healthData.forEach(function(data) {
    data.smokes = +data.smokes;
    data.income = +data.income;
  });

console.log(healthData);

  var xLinearScale = d3.scaleLinear()
  .domain([8, d3.max(healthData, d => d.smokes)])
  .range([0, width]);

var yLinearScale = d3.scaleLinear()
  .domain([35000, d3.max(healthData, d => d.income)])
  .range([height, 0]);

// Create axis functions.
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chartGroup.append("g")
  .call(leftAxis);
 

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.smokes))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", 15)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  var circletextGroup = chartGroup.selectAll()
  .data(healthData)
  .enter()
  .append("text")
  .attr("x", d => xLinearScale(d.smokes))
  .attr("y", d => yLinearScale(d.income))
  .style("font-size", "12px")
  .style("text-anchor", "middle")
  .style('fill', 'white')
  .text(d => (d.abbr));

circlesGroup = updateToolTip(bottomAxis, circlesGroup);

var labelsGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);

var smokingLabel = labelsGroup.append("text")
.attr("x", 0)
.attr("y", 20)
.classed("active", true)
.text("Percentage of State Population that Smokes");

chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Average Income");

});


function updateToolTip(bottomAxis, circlesGroup) {

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, 60])
    .html(function(d) {
      return (`<strong>${(d.smokes)} smoking percent <strong><hr>${d.income} 
      average income`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
    // onmouseout event
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });

  return circlesGroup;
}
