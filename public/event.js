let indice;
let single = true;


let url = window.location.href;
let query = url.split("?")[1];


var x, i;
x = document.querySelectorAll(".link");
for (i = 0; i < x.length; i++) {
  var u = x[i].href.split("?")[0];
  u+="?"+query;
  x[i].href = u;
}

function logout(){
  window.location.href ="/";
}

var p = query.split("&");
var project = p[0].split("=")[1];
var name = p[1].split("=")[1];
var email = p[2].split("=")[1];
var post = p[3].split("=")[1];

function back(){
  window.location.href = "/project?email="+email+"&name="+name;
}

$(function () {
  $(".profile").tooltip({html: true, placement: "left", trigger: "hover"});
})
document.getElementById("heading").innerHTML = project;
document.getElementById("post").innerHTML = post;

function user(){
  fetch('/user_detail',{
     method:'POST',
     enctype:'multipart/form-data',
     headers:{ 'Accept':'application/json , text/plain , text/html */*',
      'Content-type':'application/json'
    },
    body:JSON.stringify({project:project})
  })
  .then(res=>res.json())
  .then(data=>{

    for( let i=0 ; i<data.detail.length ; i++ ){
      let op1 = document.createElement('option');
      op1.innerHTML+=`${data.detail[i].email}`;
      document.getElementById("user").appendChild(op1);
    }


  })
}



function check(){

 if( document.getElementById("myCheck").checked == true ){
  single = false;
  document.getElementById("single").style.display = "none";
  document.getElementById("multi").style.display = "block";
}else{
  single = true;
  document.getElementById("single").style.display = "block";
  document.getElementById("multi").style.display = "none";
}

}




$(document).ready(function(){


 $("#new").click(function(){
   $("#event_form").show( "slide", {direction: "right" }, 500 );
   anime({
    targets: '.table',
    opacity: 0.2,
    duration: 500
  })
 })

 $("#cancel").click(function(){
   $("#event_form").hide( "slide", {direction: "left" }, 500 );
   anime({
    targets: '.table',
    opacity: 1,
    duration: 500
  })
})

})


function display(x){
 indice = x;

 fetch('/update_event' , {
   method:'POST',
   enctype:'multipart/form-data',
   headers:{
       'Accept':'application/json , text/plain , text/html */*',
       'Content-type':'application/json'
   },
   body:JSON.stringify({index:x,project:project,email:email})
})
.then(res => res.json())
.then( data=>{



 single = data.single;
 if( data.single == false ){
   document.getElementById("myCheck").checked = true;
   document.getElementById("multi").style.display = "block";
   document.getElementById("single").style.display = "none";
 }else{
   document.getElementById("myCheck").checked = false;
   document.getElementById("multi").style.display = "none";
   document.getElementById("single").style.display = "block";
 }




 document.getElementById("title").value = data.title;
 document.getElementById("user").value = data.user;
 document.getElementById("location").value = data.location;
 document.getElementById("repeat").value =data.repeat;
 document.getElementById("start_single").value = data.start_single;
 document.getElementById("start_time_single").value = data.start_time_single;
 document.getElementById("end_time_single").value = data.end_time_single;
 document.getElementById("from").value = data.from;
 document.getElementById("to").value = data.to;
 document.getElementById("start_time_multi").value = data.start_time_multi;
 document.getElementById("end_time_multi").value = data.end_time_multi;
 document.getElementById("overview").value = data.overview;
 document.getElementById("submit").style.display = "none";
 document.getElementById("submit1").style.display = "block";
 document.getElementById("cancel").style.float = "right";
 document.getElementById("new").click();

})

}

function remove(x){

fetch('/remove_event' , {
  method:'POST',
  enctype:'multipart/form-data',
  headers:{
      'Accept':'application/json , text/plain , text/html */*',
      'Content-type':'application/json'
  },
  body:JSON.stringify({id:x,project:project,email:email})
})
.then(res => res.json())
.then( data=>{
  if( data.success ){
   window.alert("Trash Event");
   window.location.reload()
 }else{
   window.alert(data.msg);
 }
})
.catch(err=>{
console.log(err);
})


fetch('/remove_tag' , {
  method:'POST',
  enctype:'multipart/form-data',
  headers:{
    'Accept':'application/json , text/plain , text/html */*',
    'Content-type':'application/json'
  },
  body:JSON.stringify({index:x , which:"event_form"})
})
.then(res => res.json())
.then( data=>{
   window.location.reload();
})
.catch(err=>{
console.log(err);
})


}

function complete(x){

   fetch('/complete_event' , {
       method:'POST',
       enctype:'multipart/form-data',
       headers:{
           'Accept':'application/json , text/plain , text/html */*',
           'Content-type':'application/json'
       },
       body:JSON.stringify({id:x,project:project,email:email})
    })
   .then(res => res.json())
   .then( data=>{
     if( data.success ){
        window.alert("Event Completed");
        window.location.reload()
     }else{
       window.alert(data.msg);
     }
   })
   .catch(err=>{
     console.log(err);
   })

 }


document.getElementById("cancel").onclick = function(){

  document.getElementById("title").value = "";
  document.getElementById("location").value = "";
  document.getElementById("overview").value = "";
  document.getElementById("start_single").value = "";
  document.getElementById("start_time_single").value = "12:00 am";
  document.getElementById("end_time_single").value = "12:00 am";
  document.getElementById("from").value = "";
  document.getElementById("to").value = "";
  document.getElementById("start_time_multi").value = "12:00 am";
  document.getElementById("end_time_multi").value = "12:00 am";
  document.getElementById("submit").style.display = "block";
  document.getElementById("submit1").style.display = "none";
  document.getElementById("cancel").style.float = "right";
  document.getElementById("multi").style.display = "none";
  document.getElementById("single").style.display = "block";

}



document.getElementById("submit").onclick = submitform;
document.getElementById("submit1").onclick = submitform1;


function submitform(e){

 e.preventDefault();
 const title = document.getElementById("title").value;
 const start_single = document.getElementById("start_single").value;
 const start_time_single = document.getElementById("start_time_single").value;
 const end_time_single = document.getElementById("end_time_single").value;
 const start_time_multi = document.getElementById("start_time_multi").value;
 const end_time_multi = document.getElementById("end_time_multi").value;
 const from = document.getElementById("from").value;
 const to = document.getElementById("to").value;
 const location = document.getElementById("location").value;
 const repeat = document.getElementById("repeat").value;
 const user = document.getElementById("user").value;
 const overview = document.getElementById("overview").value;


 var duration = 0;
 var begin = 0;
 var end = 0;

 var error = null;

 if( from != ""){
  var date1 = new Date(from);
  var date2 = new Date(to);
// To calculate the time difference of two dates
  var Difference_In_Time = date2.getTime() - date1.getTime();


// To calculate the no. of days between two dates
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  duration = Difference_In_Days ;

  if( parseInt(duration) < 0 ){
    error = "Please Fill the Dates appropriately";
  }

  duration+=" days";
  begin = from + " / " + start_time_multi;
  end1 = to + " / " + end_time_multi;
 }
 else{
  var start = start_time_single.split(" ");
  var end = end_time_single.split(" ");
  begin = start_single + " / " + start_time_single;
  end1 = start_single + " / " + end_time_single;
 if( start[1] == end[1] ){
   var s =0;
   var e = 0;

   var t1 = start[0].split(":");
   var t11 = t1[0];
   var t12 = t1[1];


     if( t11 == "12" ){
      if( t12 == "30" ){
       s=0.5+start[1]=="am"?0:12;
      }else{
       s=0+start[1]=="am"?0:12;
      }
     }else{
      if( t12 == "30" ){
        s = parseInt(t11)+0.5+12;
      }else{
        s = parseInt(t11)+12;
      }
     }

    var t2 = end[0].split(":");
    var t21 = t2[0];
    var t22 = t2[1];


       if( t21 == "12" ){
        if( t22 == "30" ){
         e=0.5+start[1]=="am"?0:12;
        }else{
         e=0+start[1]=="am"?0:12;
        }
       }else{
        if( t22 == "30" ){
          e = parseInt(t21)+0.5+12;
        }else{
          e = parseInt(t21)+12;
        }
       }

    duration = e-s;
    if( duration < 0 ){
      error = "Please fill the time in appropriate manner";
    }

 }else{

     if( start[1] == "pm" ){
       error = "Please fill the time in appropriate manner";
     }


     var s = 0;
     var e = 0;

     var t1 = start[0].split(":");
     var t11 = t1[0];
     var t12 = t1[1];

       if( t11 == "12" ){
        if( t12 == "30" ){
         s=0.5;
        }else{
         s=0;
        }
       }else{
        if( t12 == "30" ){
          s = parseInt(t11)+0.5;
        }else{
          s = parseInt(t11);
        }
       }

      var t2 = end[0].split(":");
      var t21 = t2[0];
      var t22 = t2[1];


         if( t21 == "12" ){
          if( t22 == "30" ){
           e=0.5;
          }else{
           e=0;
          }
         }else{
          if( t22 == "30" ){
            e = parseInt(t21)+0.5;
          }else{
            e = parseInt(t21);
          }
         }

      duration = e-s+12;

    }
   }


if( error !=null ){
  window.alert(error);
}else{

 const data = {
   title:title,
   start_single:start_single,
   start_time_single:start_time_single,
   end_time_single:end_time_single,
   start_time_multi:start_time_multi,
   end_time_multi:end_time_multi,
   from:from,
   to:to,
   location:location,
   repeat:repeat,
   user:user,
   duration:duration,
   begin:begin,
   end:end1,
   single:single,
   overview:overview,
   project:project,
   email:email
 }


fetch('/event',{
 method:'POST',
 enctype:'multipart/form-data',
 headers:{
     'Accept':'application/json , text/plain , text/html */*',
     'Content-type':'application/json'
 },
 body:JSON.stringify(data)
})
 .then(res =>{
     return res.json();
  })
 .then( data=>{

        if( data.success=="true" ){
            window.alert("Your Event is succesfully submitted!");
            const tr = document.createElement('tr');

            tr.classList.add('detail');
            tr.innerHTML = `

            <td  id="data">
            <div class="dropdown">
              <button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown" >&otimes;</button>
              <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
                <li role="presentation"><a  role="menuitem" tabindex="-1" id="a1" style="cursor:pointer" onclick="display(${data.id} , 0)">Update Project </a></li>
                <li role="presentation"><a  role="menuitem" tabindex="-1" id="a2" style="cursor:pointer" onclick="remove(${data.id})">Trash Project</a></li>
                <li role="presentation"><a  role="menuitem" tabindex="-1" id="a3"style="cursor:pointer" onclick="complete(${data.id})">Completed</a></li>
              </ul>
            </div>
            </td>
            <td id="data"><a href="" style="color:blue">${title}</a></td>
            <td id="data">${user}</td>
            <td id="data">${begin}</td>
            <td id="data">${end1}</td>
            <td id="data">${duration}</td>
            <td id="data">${location}</td>
            <td id="data">${repeat}</td>
            `;
            document.querySelector('#myTable').appendChild(tr);




         $(document).ready(function(){
          $("#event_form").hide( "slide", {direction: "right" }, 500 , function(){
            document.getElementById("notify1").style.display = "block";
            setTimeout(function(){
            document.getElementById("notify1").style.display = "none";
           } , 1000 )
          })
         anime({
          targets: '.table',
          opacity: 1,
          duration: 500
         })
        })

           document.getElementById("title").value = "";
           document.getElementById("location").value = "";
           document.getElementById("overview").value = "";
           document.getElementById("start_single").value = "";
           document.getElementById("start_time_single").value = "12:00 am";
           document.getElementById("end_time_single").value = "12:00 am";
           document.getElementById("from").value = "";
           document.getElementById("to").value = "";
           document.getElementById("start_time_multi").value = "12:00 am";
           document.getElementById("end_time_multi").value = "12:00 am";
       }else{
           window.alert(data.msg);
       }

 })

 }
}



function submitform1(e){
e.preventDefault();
const id = indice;
const title = document.getElementById("title").value;
const start_single = document.getElementById("start_single").value;
const start_time_single = document.getElementById("start_time_single").value;
const end_time_single = document.getElementById("end_time_single").value;
const start_time_multi = document.getElementById("start_time_multi").value;
const end_time_multi = document.getElementById("end_time_multi").value;
const from = document.getElementById("from").value;
const to = document.getElementById("to").value;
const location = document.getElementById("location").value;
const repeat = document.getElementById("repeat").value;
const user = document.getElementById("user").value;
const overview = document.getElementById("overview").value;



var duration = 0;
var begin = 0;
var end = 0;

var error = null;

if( from != ""){
 var date1 = new Date(from);
 var date2 = new Date(to);
// To calculate the time difference of two dates
 var Difference_In_Time = date2.getTime() - date1.getTime();
// To calculate the no. of days between two dates
 var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
 duration = Difference_In_Days ;
 duration+=" days";
 begin = from + " / " + start_time_multi;
 end1 = to + " / " + end_time_multi;
}
else{
 var start = start_time_single.split(" ");
 var end = end_time_single.split(" ");
 begin = start_single + " / " + start_time_single;
 end1 = start_single + " / " + end_time_single;
if( start[1] == end[1] ){
  var s =0;
  var e = 0;

  var t1 = start[0].split(":");
  var t11 = t1[0];
  var t12 = t1[1];


    if( t11 == "12" ){
     if( t12 == "30" ){
      s=0.5+start[1]=="am"?0:12;
     }else{
      s=0+start[1]=="am"?0:12;
     }
    }else{
     if( t12 == "30" ){
       s = parseInt(t11)+0.5+12;
     }else{
       s = parseInt(t11)+12;
     }
    }

   var t2 = end[0].split(":");
   var t21 = t2[0];
   var t22 = t2[1];


      if( t21 == "12" ){
       if( t22 == "30" ){
        e=0.5+start[1]=="am"?0:12;
       }else{
        e=0+start[1]=="am"?0:12;
       }
      }else{
       if( t22 == "30" ){
         e = parseInt(t21)+0.5+12;
       }else{
         e = parseInt(t21)+12;
       }
      }

   duration = e-s;
   if( duration < 0 ){
     error = "Please fill the time in appropriate manner";
   }

}else{

    if( start[1] == "pm" ){
      error = "Please fill the time in appropriate manner";
    }


    var s = 0;
    var e = 0;

    var t1 = start[0].split(":");
    var t11 = t1[0];
    var t12 = t1[1];

      if( t11 == "12" ){
       if( t12 == "30" ){
        s=0.5;
       }else{
        s=0;
       }
      }else{
       if( t12 == "30" ){
         s = parseInt(t11)+0.5;
       }else{
         s = parseInt(t11);
       }
      }

     var t2 = end[0].split(":");
     var t21 = t2[0];
     var t22 = t2[1];


        if( t21 == "12" ){
         if( t22 == "30" ){
          e=0.5;
         }else{
          e=0;
         }
        }else{
         if( t22 == "30" ){
           e = parseInt(t21)+0.5;
         }else{
           e = parseInt(t21);
         }
        }

     duration = e-s+12;

   }
  }


if( error !=null ){
 window.alert(error);
}else{

const data = {
  id:id,
  title:title,
  start_single:start_single,
  start_time_single:start_time_single,
  end_time_single:end_time_single,
  start_time_multi:start_time_multi,
  end_time_multi:end_time_multi,
  from:from,
  to:to,
  location:location,
  repeat:repeat,
  user:user,
  id:id,
  duration:duration,
  begin:begin,
  end:end1,
  single:single,
  overview:overview,
  project:project,
  email:email
}



fetch('/updateevent' , {
method:'POST',
enctype:'multipart/form-data',
headers:{
    'Accept':'application/json , text/plain , text/html */*',
    'Content-type':'application/json'
},
body:JSON.stringify(data)
})
.then(res =>{
  return res.json();
})
.then( data=>{
if( data.success== true ){
  document.getElementById("submit").display = "block";
  document.getElementById("submit1").display = "none";
  document.getElementById("cancel").left= "80px";

  window.alert("Successfully updated");
  $(document).ready(function(){
    $("#event_form").hide( "slide", {direction: "right" }, 500 , function(){
      window.location.reload()
    });
    anime({
     targets: '.table',
     opacity: 1,
     duration: 500
   })
  })




   document.getElementById("notify").style.display = "block";
   setTimeout(function(){
   document.getElementById("notify").style.display = "none";
   } , 1000 );

}else{
    window.alert("Something Went Wrong");
}

})

}
}

user();
