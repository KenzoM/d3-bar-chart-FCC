$( document ).ready(function(){
  const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

  $.ajax({
    type: "GET",
    dataType: "json",
    url: url,
    beforeSend: ()=> console.log('beforeSend'),
    success: (data) =>{
      console.log(data)
    },
    fail: () =>{
      console.log('failure!')
    },
    error: () =>{
      console.log('error!')
    }
});
});
