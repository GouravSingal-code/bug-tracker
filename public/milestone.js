let indice;

function logout(){
  window.location.href ="/";
}

let url = window.location.href;
let query = url.split("?")[1];


var x, i;
x = document.querySelectorAll(".link");
for (i = 0; i < x.length; i++) {
  var u = x[i].href.split("?")[0];
  u+="?"+query;
  x[i].href = u;
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

function display(x){

indice = x;
fetch('/update_milestone' , {
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

  document.getElementById("title").value = data.title;
  document.getElementById("start").value = data.start;
  document.getElementById("end").value = data.end;
  document.getElementById("flag").value = data.flag;
  document.getElementById("user").value = data.user;
  document.getElementById("tag").value = data.tag;
  document.getElementById("submit").style.display = "none";
  document.getElementById("submit1").style.display = "block";
  document.getElementById("cancel").style.float = "right";
  document.getElementById("new").click();

})

}


function remove(x){

fetch('/remove_milestone' , {
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
   window.alert("Trash MileStone");
   window.location.reload()
 }else{
   window.alert(data.msg);
 }
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

function complete(x){

   fetch('/complete_milestone' , {
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
        window.alert("Milestone Completed");
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
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
  document.getElementById("flag").value = "Internal";
  document.getElementById("tag").value = "";
  document.getElementById("submit").style.display = "block";
  document.getElementById("submit1").style.display = "none";
  document.getElementById("cancel").style.float = "right";
 }

document.getElementById("submit").onclick = submitform;

document.getElementById("submit1").onclick = submitform1;

function submitform(e){

 e.preventDefault();
 const title = document.getElementById("title").value;
 const start = document.getElementById("start").value;
 const end = document.getElementById("end").value;
 const flag = document.getElementById("flag").value;
 const user = document.getElementById("user").value;
 const tag = document.getElementById("tag").value;


 const data = {
   title:title,
   start:start,
   end:end,
   flag:flag,
   user:user,
   tag:tag,
   project:project,
   email:email
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
            <td id="data">${tag}</td>
            <td id="data">${start}</td>
            <td id="data">${end}</td>
            <td id="data"></td>
            `;
            document.querySelector('#myTable').appendChild(tr);

            $(document).ready(function(){
             $("#milestone_form").hide( "slide", {direction: "right" }, 500 , function(){
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
           document.getElementById("start").value = "";
           document.getElementById("end").value = "";
           document.getElementById("flag").value = "Internal";
           document.getElementById("tag").value = "";

       }else{
           window.alert(data.msg);
       }

 })

 }

function submitform1(e){

e.preventDefault();

const id = indice;
const title = document.getElementById("title").value;
const start = document.getElementById("start").value;
const end = document.getElementById("end").value;
const flag = document.getElementById("flag").value;
const user = document.getElementById("user").value;
const tag = document.getElementById("tag").value;


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
  window.alert("Successfully updated");
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


user();
