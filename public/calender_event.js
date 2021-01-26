let single = true;


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




function delete_event(x){

fetch('/remove_event' , {
  method:'POST',
  enctype:'multipart/form-data',
  headers:{
    'Accept':'application/json , text/plain , text/html */*',
    'Content-type':'application/json'
  },
  body:JSON.stringify({index:x-1,project:project,email:email})
})
.then(res => res.json())
.then( data=>{
   window.location.reload();
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
  body:JSON.stringify({index:x-1 , which:"event_form"})
})
.then(res => res.json())
.then( data=>{
   window.location.reload();
})
.catch(err=>{
console.log(err);
})


}



document.getElementById("cancel2").onclick = function(){

  document.getElementById("title2").value = "";
  document.getElementById("location2").value = "";
  document.getElementById("overview2").value = "";
  document.getElementById("start_single2").value = "";
  document.getElementById("start_time_single2").value = "12:00 am";
  document.getElementById("end_time_single2").value = "12:00 am";
  document.getElementById("from2").value = "";
  document.getElementById("to2").value = "";
  document.getElementById("start_time_multi2").value = "12:00 am";
  document.getElementById("end_time_multi2").value = "12:00 am";
}



document.getElementById("submit2").onclick = submitform2;
document.getElementById("submit22").onclick = submitform22;


function submitform2(e){

 e.preventDefault();

 const title = document.getElementById("title2").value;
 const start_single = document.getElementById("start_single2").value;
 const start_time_single = document.getElementById("start_time_single2").value;
 const end_time_single = document.getElementById("end_time_single2").value;
 const start_time_multi = document.getElementById("start_time_multi2").value;
 const end_time_multi = document.getElementById("end_time_multi2").value;
 const from = document.getElementById("from2").value;
 const to = document.getElementById("to2").value;
 const location = document.getElementById("location2").value;
 const repeat = document.getElementById("repeat2").value;
 const user = document.getElementById("user2").value;
 const overview = document.getElementById("overview2").value;


 var duration = 0;
 var begin = 0;
 var end = 0;

 var error = null;

 if( single==false){
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
  if( project == "" ){
    project = document.getElementById("project2").value;
  }
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



// special thing about form-data is that network methods such as fetch api  can accept formData object as a
//body , its encoded and sent out with contentType multipart-formdata



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

        if( data.success==true ){
           window.alert("Your Event is succesfully submitted!");

           $(document).ready(function(){
            $("#event_form").hide( "slide", {direction: "right" }, 500 );
          })





         const d = {
           which:"event_form",
           title:title,
           year:document.getElementById("year").innerHTML,
           month:document.getElementById("month").value,
           day:current_day,
           date:current_date,
           email:email,
           project:project
         }

          fetch("/tag" , {
            method:'POST',
            enctype:'multipart/form-data',
            headers:{
                'Accept':'application/json , text/plain , text/html */*',
                'Content-type':'application/json'
            },
            body:JSON.stringify(d)
          })
          .then(res=>{
            return res.json()
          })
          .then(data=>{

            for( let j =0 ; j<document.querySelectorAll("#data").length ; j++ ){
              if(  document.querySelectorAll("#data")[j].childNodes[0].innerHTML == parseInt(current_date,10).toString() ){
                var div = document.createElement('div');
                div.classList.add('msg_div');
                div.innerHTML=`<p  class="profile1" title="<div>${d.title}</div>" data-toggle="tooltip"  style='width:100%;border:2px solid green' >${d.title}</p>`;
                document.querySelectorAll("#data")[j].childNodes[1].appendChild(div);
                break;
              }
            }


          })

          $(document).ready(function(){
            $("#which").hide("slide" , {direction:"right"} , 20);
          })

           document.getElementById("title2").value = "";
           document.getElementById("location2").value = "";
           document.getElementById("overview2").value = "";
           document.getElementById("start_single2").value = "";
           document.getElementById("start_time_single2").value = "12:00 am";
           document.getElementById("end_time_single2").value = "12:00 am";
           document.getElementById("from2").value = "";
           document.getElementById("to2").value = "";
           document.getElementById("start_time_multi2").value = "12:00 am";
           document.getElementById("end_time_multi2").value = "12:00 am";
       }else{
           window.alert(data.msg);
       }

 })

 }
}



function submitform22(e){
e.preventDefault();
const id = indice;
const title = document.getElementById("title2").value;
const start_single = document.getElementById("start_single2").value;
const start_time_single = document.getElementById("start_time_single2").value;
const end_time_single = document.getElementById("end_time_single2").value;
const start_time_multi = document.getElementById("start_time_multi2").value;
const end_time_multi = document.getElementById("end_time_multi2").value;
const from = document.getElementById("from2").value;
const to = document.getElementById("to2").value;
const location = document.getElementById("location2").value;
const repeat = document.getElementById("repeat2").value;
const user = document.getElementById("user2").value;
const overview = document.getElementById("overview2").value;



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

  if( project == "" ){
    project = document.getElementById("project2").value;
  }
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
  document.getElementById("submit2").display = "block";
  document.getElementById("submit22").display = "none";
  document.getElementById("cancel2").left= "60px";

  window.alert("Successfull Updated");
  $(document).ready(function(){
    $("#event_form").hide( "slide", {direction: "right" }, 500 , function(){
      window.location.reload()
    });
  })

}else{
    window.alert("Something Went Wrong");
}

})

}
}
