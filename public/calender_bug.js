let status = "Open";


function delete_bug(x){
fetch('/remove_bug' , {
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
  body:JSON.stringify({index:x-1 , which:"bug_form"})
})
.then(res => res.json())
.then( data=>{
   window.location.reload();
})
.catch(err=>{
console.log(err);
})



}

document.getElementById("cancel1").onclick = function(){

document.getElementById("title1").value = "";
document.getElementById("date1").value = "";
document.getElementById("tag1").value = "";
document.getElementById("overview1").value = "";
document.getElementById("file1").value = "";

}


document.getElementById("submit1").onclick = submitform1;
document.getElementById("submit11").onclick = submitform11;

function submitform1(e){

 e.preventDefault();

 const state =  status;
 const title = document.getElementById("title1").value
 const assign_to = document.getElementById("assign_to1").value;
 const add_follower = document.getElementById("add_follower1").value ;
 const date = document.getElementById("date1").value;
 const severity = document.getElementById("severity1").value;
 const release = document.getElementById("release1").value ;
 const affect = document.getElementById("affect1").value ;
 const classify = document.getElementById("classify1").value ;
 const reproducible  = document.getElementById("reproducible1").value ;
 const tag = document.getElementById("tag1").value ;
 const overview = document.getElementById("overview1").value ;


// special thing about form-data is that network methods such as fetch api  can accept formData object as a
//body , its encoded and sent out with contentType multipart-formdata



 let fd = new FormData(bug1);

 fd.append("status" , state);
 fd.append("email" , email);
 if( project!="" ){
  fd.append("project" , project);
 }


 fetch('/bug' , {
     method:'POST',
     body:fd
 })
 .then(res =>{
     return res.json();
 })
 .then( data=>{

        if( data.success==true ){

           window.alert("Your project is succesfully submitted!");

           $(document).ready(function(){
             $("#bug_form").hide( "slide", {direction: "right" }, 500);
           })

           if( project == "" ){
            project = document.getElementById('project').value;
           }

           const d = {
             which:"bug_form",
             title:title,
             year:document.getElementById("year").innerHTML,
             month:document.getElementById("month").value,
             day:current_day,
             date:current_date,
             project:project,
             email:email
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
                  div.innerHTML=`<p  class="profile1" title="<div>${d.title}</div>" data-toggle="tooltip"  style='width:100%;border:2px solid blue' >${d.title}</p>`;
                  document.querySelectorAll("#data")[j].childNodes[1].appendChild(div);
                  break;
                }
              }

            })


            $(document).ready(function(){
              $("#which").hide("slide" , {direction:"right"} , 20);
            })

           document.getElementById("title1").value = "";
           document.getElementById("date1").value = "";
           document.getElementById("tag1").value = "";
           document.getElementById("overview1").value = "";
           document.getElementById("file1").value = "";

       }

         else{
             window.alert(data.msg);
         }

 })

}

function submitform11(e){
e.preventDefault();

const id = indice;
const state =  status;
const title = document.getElementById("title1").value;
const assign_to = document.getElementById("assign_to1").value;
const add_follower = document.getElementById("add_follower1").value;
const date = document.getElementById("date1").value;
const severity = document.getElementById("severity1").value;
const release = document.getElementById("release1").value;
const affect = document.getElementById("affect1").value;
const classify = document.getElementById("classify1").value;
const reproducible  = document.getElementById("reproducible1").value;
const tag = document.getElementById("tag1").value;
const overview = document.getElementById("overview1").value;
if( project == "" ){
  project = document.getElementById("project").value;
}

fetch('/updatebug' , {
method:'POST',
enctype:'multipart/form-data',
headers:{
    'Accept':'application/json , text/plain , text/html */*',
    'Content-type':'application/json'
},
body:JSON.stringify({project:project,email:email,status:state,title:title,assign_to:assign_to,add_follower:add_follower,date:date,severity:severity,release:release,affect:affect,reproducible:reproducible,tag:tag,classify:classify,overview:overview,id:id})
})
.then(res =>{
  return res.json();
})
.then( data=>{
if( data.success== true ){
  document.getElementById("submit").display = "block";
  document.getElementById("submit1").display = "none";
  document.getElementById("cancel").left= "60px";
    window.alert("Successfully updated");
  $(document).ready(function(){
    $("#bug_form").hide( "slide", {direction: "right" }, 500 , function(){
      window.location.reload()
    });
  })
}else{
    window.alert("Something Went Wrong");
}

})

}
