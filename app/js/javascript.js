$( document ).ready(function(){
  //SVG canvas width and height
  const w = 1200;
  const h = 600;

  function removeIcon(){
    let removeEl = document.getElementById('wrapper');
    let containerEl = removeEl.parentNode;
    containerEl.removeChild(removeEl)
  }

  //append title of the bar chart
  function title(){
    let item = document.createElement("h1");
    item.innerHTML = "Gross Domestic Product"
    item.className = "title";
    let title = document.getElementById('card')
    title.appendChild(item)
  }

  //append the source data on the bottom of the bar chart
  function source(data){
    let url = "http://www.bea.gov/national/pdf/nipaguid.pdf"
    let item = document.createElement("a");
    item.innerHTML = data.description
    item.className = "source";
    item.href = url;
    let title = document.getElementById('card')
    title.appendChild(item)
  }

  //render the barchart from data
  function render(data){
    const margin = {
      top: 5,
      bottom: 150,
      left: 90,
      right: 50
    }
    const width = w - (margin.left + margin.right);
    const height = h - (margin.top + margin.bottom);

    //create canvas with id="chart"
    const svg = d3.select("#card")
                  .append("svg")
                    .attr("id","chart")
                    .attr("width", w)
                    .attr("height", h)

    const chart = svg.append("g")
                    .classed("display", true)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const dateParser = d3.timeParse("%Y-%m-%d");

    //define x-scale and y-scale
    const x = d3.scaleTime()
                  .domain(d3.extent(data, function(d){
                    let date = dateParser(d[0])
                    return date
                  }))
                  .range([0,width]);

    const y = d3.scaleLinear()
                  .domain([0, d3.max(data, function(d){
                    return d[1]
                  })])
                  .range([height, 0]);

    const xAxis = d3.axisBottom(x)
                      .tickFormat(d3.timeFormat("%Y"));

    const yAxis = d3.axisLeft(y);

    //add gridlines
    const yGridLines = d3.axisLeft(y)
                          .tickSize(-width)
                          .tickFormat("")

    //define the line function
    const line = d3.line()
                    .x((d) =>{
                      let date = dateParser(d[0])
                      return x(date)
                    } )
                    .y((d) =>{
                      return y(d[1])
                    } )

    //add tooltip for user's interaction
    const tooltip = d3.select("#card")
                .append("div")
                  .classed("tooltip", true)
                  .style("opacity",0)

    //plot the barchart from data using #call method
    function plot(params){
      //add gridlines
      this.append("g")
        .call(params.gridlines)
        .classed("gridline",true)
        .attr("transform","translate(0,0)")

      //create axis for x and y
      this.append("g")
        .classed("x axis", true)
        .attr("transform","translate(0,"+ height +")")
        .call(params.axis.x)

      this.append("g")
        .classed("y axis", true)
        .attr("transform", "translate(0,0)")
        .call(params.axis.y)

      //style our axis
      this.select(".y.axis")
        .selectAll("text")
        .style("font-size","18px")

      this.select(".x.axis")
        .selectAll("text")
        .style("font-size","16px")

      //add labels to our axis
      this.select(".y.axis")
          .append("text")
          .style("fill","black")
          .style("font-size", "16px")
          .attr("x", 0)
          .attr("y", 20)
          .attr("transform", "translate(0,0) rotate(-90)" )
          .text("Gross Domestic Product, USA")

      //enter()
      this.selectAll(".trendline")
            .data([params.data])
            .enter()
              .append("path")
              .classed("trendline", true)

      this.selectAll(".bar")
          .data(params.data)
          .enter()
              .append("rect")
              .classed("bar", true)
              //add event listener to display info over mouseover
              .on("mouseover", function(d,i){
                let dateFormat = d3.timeFormat("%B-%Y")(dateParser(d[0]));
                // console.log(d3.timeFormat("%b")(dateParser(d[0])))
                let text = "$" + d[1].toLocaleString() + " Billion"  +"<br/>" + "<strong>"+dateFormat+"</strong>";
                d3.select(this).style("fill", "#DF744A");
                tooltip.transition()
                        .style("opacity", .9)
                tooltip.html(text)
                        .style("left", d3.event.pageX + "px")
                        .style("top", (d3.event.pageY - 28) + "px")
              })
            .on("mouseout", function(d,i){
                d3.select(this).style("fill", "#BFD8D2");
                tooltip.transition()
                      .style("opacity",0)
              });

      //update
      this.selectAll(".trendline")
      .transition()
        .duration(2000)
        .attr("d", (d)=>{
          return line(d)
          })

      this.selectAll(".bar")
        .attr("x", function(d,i){
          let date = dateParser(d[0])
          return x(date)
        })
        .attr("y", function(d,i){
          return y(d[1]);
        })
        .transition()
  			.duration(100)
  			.delay(function (d, i) {
  				return i * 10;
  			})
        .attr("height", function(d,i){
          return height - y(d[1])
        })
        .attr("width", function(d){
          return width / params.data.length
        })

      //exit
      this.selectAll(".trendline")
        .data([params.data])
        .enter()
          .exit()
          .remove()

      this.selectAll(".bar")
        .data(params.data)
        .enter()
          .exit()
          .remove()

    }

    plot.call(chart,{
      data: data,
      axis:{
        x: xAxis,
        y: yAxis
      },
      gridlines: yGridLines
    })
  }

  const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  $.ajax({
    type: "GET",
    dataType: "json",
    url: url,
    beforeSend: ()=> {
    },
    complete: () =>{
      //remove loading icon
      removeIcon();
    },
    success: (data) =>{
      title()
      render(data.data)
      source(data)
    },
    fail: () =>{
      console.log('failure!')
    },
    error: () =>{
      console.log('error!')
    }
  });
});
