function logout(){
  window.location.href ="/";
}




          $(document).ready(function(){

           $("#new").click(function(){

             $("#chat_form").show( "slide", {direction: "right" }, 500 );
             anime({
              targets: '.table',
              opacity: 0.2,
              duration: 500
            })
           })

           $("#cancel").click(function(){
             $("#chat_form").hide( "slide", {direction: "left" }, 500 );
             anime({
              targets: '.table',
              opacity: 1,
              duration: 500
            })
          })
          })






 document.getElementById("cancel").onclick = function(){
   document.getElementById("title").value = "";
   document.getElementById("overview").value = "";
 }



document.getElementById("submit").onclick = submitform;



  let url = window.location.href;
  let query = url.split("?")[1];

  var p = query.split("&");
  var email1 = p[0].split("=")[1];
  var name = p[1].split("=")[1];


  $(function(){
     $(".profile").tooltip({html: true, placement: "left", trigger: "hover"});
  })



      function submitform(e){

           e.preventDefault();
           const title = document.getElementById("title").value;
           const overview = document.getElementById("overview").value;
           const project = document.getElementById('project').value;
           const email2 = document.getElementById('user').value;


           fetch('/chat' , {

               method:'POST',
               enctype:'multipart/form-data',
               headers:{
                   'Accept':'application/json , text/plain , text/html */*',
                   'Content-type':'application/json'
               },
               body:JSON.stringify({title:title,overview:overview,project:project,email:email2,from_:email1})
           })
           .then(res =>{
               return res.json();
           })
           .then( data=>{

                  if( data.success==true ){

                      $(document).ready(function(){
                        $("#chat_form").hide( "slide", {direction: "right" }, 500 , function(){
                          document.getElementById("notify").style.display = "block";
                          setTimeout(function(){
                          document.getElementById("notify").style.display = "none";
                        } , 1000 )
                      })
                        anime({
                         targets: '.table',
                         opacity: 1,
                         duration: 500
                       })
                     })

                     document.getElementById("title").value = "";
                     document.getElementById("overview").value = "";

                 }

                   else{
                       window.alert(data.msg);
                   }

           })

       }



   function setuser(project){
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
        if( data.detail[i].email != email1 ){
         let op1 = document.createElement('option');
         op1.innerHTML+=`${data.detail[i].email}`;
         document.getElementById("user").appendChild(op1);
        }
       }
     })
   }

   function project_detail(){
     fetch('/project_detail',{
        method:'POST',
        enctype:'multipart/form-data',
        headers:{ 'Accept':'application/json , text/plain , text/html */*',
         'Content-type':'application/json'
       },
     })
     .then(res=>res.json())
     .then(data=>{

       for( let i=0 ; i<data.project.length ; i++ ){
         for( let j=0  ; j<data.project[i].users.length ; j++ ){
           if( data.project[i].users[j].email == email1 ){
             let op1 = document.createElement('option');
             op1.innerHTML+=`${data.project[i].title}`;
             document.getElementById("project").appendChild(op1);
           }
         }
       }

     })
   }

project_detail();
