let indice;

$(document).ready(function(){


 $("#new").click(function(){
   $("#milestone_form").show( "slide", {direction: "right" }, 500 );
   anime({
    targets: '.table',
    opacity: 0.2,
    duration: 500
  })
 })

 $("#cancel").click(function(){
   $("#milestone_form").hide( "slide", {direction: "left" }, 500 );
   anime({
    targets: '.table',
    opacity: 1,
    duration: 500
  })
})

})

function remove(x){

fetch('/remove_milestone' , {
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
   console.log(data.success);
   window.location.reload()
})
.catch(err=>{
console.log(err);
})


fetch('/remove_milestone' , {
  method:'POST',
  enctype:'multipart/form-data',
  headers:{
    'Accept':'application/json , text/plain , text/html */*',
    'Content-type':'application/json'
  },
  body:JSON.stringify({index:x , which:"milestone_form"})
})
.then(res => res.json())
.then( data=>{
   window.location.reload();
})
.catch(err=>{
console.log(err);
})


}

document.getElementById("cancel3").onclick = function(){
  document.getElementById("title3").value = "";
  document.getElementById("start3").value = "";
  document.getElementById("end3").value = "";
  document.getElementById("flag3").value = "";
  document.getElementById("tag3").value = "";
}

document.getElementById("submit3").onclick = submitform;

document.getElementById("submit33").onclick = submitform1;


function submitform(e){

 e.preventDefault();
 const title = document.getElementById("title3").value;
 const start = document.getElementById("start3").value;
 const end = document.getElementById("end3").value;
 const flag = document.getElementById("flag3").value;
 const user = document.getElementById("user3").value;
 const tag = document.getElementById("tag3").value;
 if( project == "" ){
   project = document.getElementById("project3").value;
   console.log(project);
 }

 const data = {
   title:title,
   start:start,
   end:end,
   flag:flag,
   user:user,
   tag:tag,
   project:project,email:email
 }


fetch('/milestone',{
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
            window.alert("Your Milestone is succesfully submitted!");

            $(document).ready(function(){
              $("#milestone_form").hide( "slide", {direction: "right" }, 500);
            })


            const d = {
              which:"milestone_form",
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
                   div.innerHTML=`<p  class="profile1" title="<div>${d.title}</div>" data-toggle="tooltip"  style='width:100%;border:2px solid purple' >${d.title}</p>`;
                   document.querySelectorAll("#data")[j].childNodes[1].appendChild(div);
                   break;
                 }
               }

             })


           $(document).ready(function(){
             $("#which").hide("slide" , {direction:"right"} , 20);
           })

           document.getElementById("title3").value = "";
           document.getElementById("start3").value = "";
           document.getElementById("end3").value = "";
           document.getElementById("flag3").value = "";
           document.getElementById("tag3").value = "";


       }else{
           window.alert(data.msg);
       }

 })

 }

function submitform1(e){

e.preventDefault();

const id = indice;
const title = document.getElementById("title3").value;
const start = document.getElementById("start3").value;
const end = document.getElementById("end3").value;
const flag = document.getElementById("flag3").value;
const user = document.getElementById("user3").value;
const tag = document.getElementById("tag3").value;
if( project == "" ){
  project = document.getElementById("project2").value;
  console.log(project);
}

const data = {
  title:title,
  start:start,
  end:end,
  flag:flag,
  user:user,
  tag:tag,
  id:id,
  project:project,
  email:email
}


fetch('/updatemilestone' , {
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

  window.alert("Successfully Updated");
  $(document).ready(function(){
    $("#milestone_form").hide( "slide", {direction: "right" }, 500 , function(){
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
