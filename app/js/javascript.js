$( document ).ready(function(){
  const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  const w = 1200;
  const h = 600;

  function render(data){
    const margin = {
      top: 50,
      bottom: 100,
      left: 90,
      right: 50
    }
    const width = w - (margin.left + margin.right);
    const height = h - (margin.top + margin.bottom);

    //create canvas with id="chart"
    const svg = d3.select("body")
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

    //define the line function
    const line = d3.line()
                    .x((d) =>{
                      let date = dateParser(d[0])
                      return x(date)
                    } )
                    .y((d) =>{
                      return y(d[1])
                    } )

    const tooltip = d3.select("body")
                .append("div")
                  .classed("tooltip", true)
                  .style("opacity",0)


    function plot(params){
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
                let text = "$" + d[1] + " Billion"  +"<br/>" + "<strong>"+dateFormat+"</strong>";
                d3.select(this).style("fill", "black");
                tooltip.transition()
                        .style("opacity", .9)
                tooltip.html(text)
                        .style("left", d3.event.pageX + "px")
                        .style("top", (d3.event.pageY - 28) + "px")
              })
            .on("mouseout", function(d,i){
                d3.select(this).style("fill", "skyblue");
                tooltip.transition()
                      .style("opacity",0)
              });


      //update
      this.selectAll(".trendline")
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
        .attr("height", function(d,i){
          return height - y(d[1])
        })
        .attr("width", function(d){
          return width / params.data.length
        })
        .style("fill", "skyblue");

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
      }
    })

  }
  $.ajax({
    type: "GET",
    dataType: "json",
    url: url,
    beforeSend: ()=> {
      console.log('beforeSend')
    },
    success: (data) =>{
      //sent data plots to render function
      console.log(data)
      render(data.data)
    },
    fail: () =>{
      console.log('failure!')
    },
    error: () =>{
      console.log('error!')
    }
  });
});
