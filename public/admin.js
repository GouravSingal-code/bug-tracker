var email = window.location.href;
email = email.split("=")[1];


// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }
function getRandomColor() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',0.5)';
}



function logout(){
  window.location.href ="/";
}


fetch('/data',{
  method:'POST',
  enctype:'multipart/form-data',
  headers:{ 'Accept':'application/json , text/plain , text/html */*',
   'Content-type':'application/json'
  },
  body:JSON.stringify({email:email})
 })
 .then(res=>res.json())
 .then(data=>{

   if( data.success ){
    let a = data.detail;
    datasets = [];


    for( let i=0 ; i<a.project.length ; i++ ){
      let d = [];
      d.push(a.bug[i]);
      d.push(a.event[i]);
      d.push(a.cmilestone[i]);
      d.push(a.cbug[i]);
      d.push(a.cevent[i]);
      d.push(a.milestone[i]);

      let c1 = getRandomColor();

      const object = {
        label:a.project[i],
        backgroundColor:c1,
        borderColor:c1,
        pointBackgroundColor:c1,
        data:d,
      }
      datasets.push(object);
    }



    		var config = {
    			type: 'radar',
    			data: {
    				labels: [
              'Open Bugs',
              'Open Events',
              'Close Milestones',
              'Close Bugs',
              'Close Events',
              'Open MileStones',
            ],
    				datasets: datasets,
          },
    			options: {
    				legend: {
              display:true,
              position:'right',
              fullWidth:true,
              labels:{
                fontSize:20,
              }
    				},
    				title: {
    					display: false,
    					text: "YOUR PROJECTS",
              fontSize:30,
              fontColor:'black',
              align:'start',
    				},
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
    				scale: {
    					ticks: {
    						beginAtZero: true,
                fontSize:20,
    					},
              gridLines: {
               color: 'red'
              },
              pointLabels: {
                fontSize: 20,
                fontColor:'rgb(153 ,153,0)'
              },
              label:{
                fontSize:20,
              },
              text:{
                fontSize:20
              }
    				}
    			}
    		};

        var ctx = document.getElementById('detail').getContext('2d');

        var myChart = new Chart(ctx, config);
      }
  })


function move(){
  let no = document.querySelector('.badge').innerHTML;
  if( no == "" ){
    no = 0;
  }
  window.location.href = "/messages?email="+email+"&name="+name+"&new_="+no;
}


fetch('/notify', {
 method:'POST',
 enctype:'multipart/form-data',
 headers:{ 'Accept':'application/json , text/plain , text/html */*',
  'Content-type':'application/json'
},
body:JSON.stringify({email:email})
})
.then(res=>res.json())
.then(data=>{

  if( data.success ){
  let no = parseInt(data.no,10);

  fetch('/newnotify', {
  method:'POST',
  enctype:'multipart/form-data',
  headers:{ 'Accept':'application/json , text/plain , text/html */*',
  'Content-type':'application/json'
  },
  body:JSON.stringify({email:email,no:no})
  })
  .then(res=>res.json())
  .then(data=>{
   if( parseInt(data.length,10) > 0 ){
    document.querySelector('.badge').innerHTML =data.length;
   }

   var total = parseInt(data.length,10)+parseInt(no,10);

  fetch('/setnotify',{
  method:'POST',
  enctype:'multipart/form-data',
  headers:{ 'Accept':'application/json , text/plain , text/html */*',
   'Content-type':'application/json'
  },
  body:JSON.stringify({email:email,no:total})
  })
  .then(res=>res.json())
  .then(data=>{
  console.log(data);
  })
  .catch(err=>{
   window.alert(err);
  })
  })
  .catch(err=>{
  window.alert(err);
  })

}else{
  window.alert(data.msg);
}


})
.catch(err=>{
  window.alert(err);
})
