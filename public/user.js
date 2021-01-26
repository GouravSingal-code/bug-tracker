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
var email2 = p[2].split("=")[1];
var post = p[3].split("=")[1];

function back(){
  window.location.href = "/project?email="+email2+"&name="+name;
}

$(function () {
  $(".profile").tooltip({html: true, placement: "left", trigger: "hover"});
})

document.getElementById("heading").innerHTML = project;
document.getElementById("post").innerHTML = post;


$(document).ready(function(){

         $("#new").click(function(){
           $("#user_form").show( "slide", {direction: "right" }, 500 );
         })

         $("#cancel").click(function(){
           $("#user_form").hide( "slide", {direction: "left" }, 500 );
        })

})


document.getElementById("cancel").onclick = function(){
    document.getElementById("email").value = "";
}


document.getElementById("submit").onclick = submitform;



 function submitform(e){

  e.preventDefault();

  const email1 = document.getElementById("email").value;
  const project = document.getElementById("project").value;
  const post = document.getElementById("post_").value;

// special thing about form-data is that network methods such as fetch api  can accept formData object as a
//body , its encoded and sent out with contentType multipart-formdata


      fetch('/user' , {
       method:'POST',
       enctype:'multipart/form-data',
       headers:{
        'Accept':'application/json , text/plain , text/html */*',
        'Content-type':'application/json'
       },
      body:JSON.stringify({project:project,email:email1,post:post,from:email2})
      })
     .then(res =>{
         return res.json();
     })
     .then( data=>{

            if( data.success==true ){
              window.alert("Connection Sent Successfully!");

              let div = document.createElement('div');
              div.className = "use";
              div.innerHTML = `
                  <i class="fa fa-trash" id="trash" onclick=delete_("${email1}") style="cursor:pointer;position:absolute;top:0px;right:0px"></i>
                  <img src="./img/user2.png" style="width:100px;height:100px" />
                  <h6 style="text-align:center;">${email1}</h6>
                  <h6 style="text-align:center;">${post}</h6>
              `;
              document.getElementById("user").appendChild(div);

              $(document).ready(function(){
               $("#user_form").hide( "slide", {direction: "right" }, 500 , function(){
                 document.getElementById("notify1").style.display = "block";
                 setTimeout(function(){
                 document.getElementById("notify1").style.display = "none";
                } , 1000 )
               })
              })

               document.getElementById("email").value = "";
             }else{
                 window.alert(data.msg);
             }

     })


  }







  function delete_(y){


       fetch('/user_delete', {
        method:'POST',
        enctype:'multipart/form-data',
        headers:{ 'Accept':'application/json , text/plain , text/html */*',
        'Content-type':'application/json'
        },
        body:JSON.stringify({project:project,email:y}),
       })
       .then(res=>res.json())
       .then(data=>{
         if( data.success ){
           window.alert("User Trashed!");
           window.location.reload();
         }else{
           window.alert(data.msg);
         }
       })


   }


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
     let div = document.createElement('div');
     div.className = "use";
     div.innerHTML = `
         <i class="fa fa-trash" id="trash" onclick=delete_("${data.detail[i].email}") style="cursor:pointer;position:absolute;top:0px;right:0px"></i>
         <img src="./img/user2.png" style="width:100px;height:100px" />
         <h6 style="text-align:center;">${data.detail[i].email}</h6>
         <h6 style="text-align:center;">${data.detail[i].post}</h6>
     `;
     document.getElementById("user").appendChild(div);
   }

 })
