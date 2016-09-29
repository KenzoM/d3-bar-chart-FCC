$( document ).ready(function(){
  const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  const w = 800;
  const h = 450;
  function render(data){
    const margin = {
      top: 50,
      bottom: 50,
      left: 50,
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

    const line = d3.line()
                    .x((d) =>{
                      let date = dateParser(d[0])
                      return x(date)
                    } )
                    .y((d) =>{
                      return y(d[1])
                    }
                  )

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

      //enter()

      this.selectAll(".trendline")
            .data([params.data])
            .enter()
              .append("path")
              .classed("trendline", true)


      this.selectAll(".point")
          .data(params.data)
          .enter()
            .append("circle")
            .classed("point", true)
            .attr("r", 2)

      //update
      this.select(".trendline")
            .attr("d", (d)=>{
              return line(d)
            })

      this.selectAll(".point")
            .attr("cx", function(d){
              // console.log(d)
              let date = dateParser(d[0])
              // console.log(x(date))
              return x(date)
            })
            .attr("cy", function(d){
              return y(d[1])
            })

      //exit
      this.selectAll(".trendline")
        .data([params.data])
        .enter()
          .exit()
          .remove()

      this.selectAll(".point")
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
