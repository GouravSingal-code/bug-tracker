function logout(){
  window.location.href ="/";
}

$(function () {
  $(".profile").tooltip({html: true, placement: "left", trigger: "hover"});
})


          let indice;
          let status = "Active";

          $(document).ready(function(){

           $("#new").click(function(){

             $("#project_form").show( "slide", {direction: "right" }, 500 );
             anime({
              targets: '.table',
              opacity: 0.2,
              duration: 500
            })
           })

           $("#cancel").click(function(){
             $("#project_form").hide( "slide", {direction: "left" }, 500 );
             anime({
              targets: '.table',
              opacity: 1,
              duration: 500
            })
          })
          })



      function display(x , y){

         indice = x;
         fetch('/update_project' , {
             method:'POST',
             enctype:'multipart/form-data',
             headers:{
                 'Accept':'application/json , text/plain , text/html */*',
                 'Content-type':'application/json'
             },
             body:JSON.stringify({index:x})
          })
         .then(res => res.json())
         .then( data=>{
           document.getElementById("title").value = data.name;
           document.getElementById("owner").value = data.owner;
           document.getElementById("start").value = data.start;
           document.getElementById("end").value = data.end;
           document.getElementById("overview").value = data.detail;
           document.getElementById("group").value = data.group;

           if( y==0 ){
             document.getElementById("submit").style.display = "none";
             document.getElementById("submit1").style.display = "block";
             document.getElementById("cancel").style.left= "110px";
           status = data.status;
           document.getElementById("new").click();
           }

           if( y==1 ){

           const title = document.getElementById("title").value;
           const owner = document.getElementById("owner").value;
           const template = document.getElementById("template").value;
           const start = document.getElementById("start").value;
           const end = document.getElementById("end").value;
           const overview = document.getElementById("overview").value;
           const group = document.getElementById("group").value;
           const id = indice;
           const state = status;



           fetch('/updateproject' , {
               method:'POST',
               enctype:'multipart/form-data',
               headers:{
                   'Accept':'application/json , text/plain , text/html',
                   'Content-type':'application/json'
               },
               body:JSON.stringify({status:state,title:title,owner:owner,template:template,start:start,end:end,overview:overview,group:group ,id:id})
           })
           .then(res =>{
               return res.json();
           })
           .then( data=>{
                   if( data.success== true ){
                     document.getElementById("submit").display = "block";
                     document.getElementById("submit1").display = "none";
                     document.getElementById("cancel").left= "80px";
                     $(document).ready(function(){
                       $("#project_form").hide( "slide", {direction: "right" }, 500 , function(){
                         document.getElementById('myTable').rows[indice+1].cells[4].childNodes[1].childNodes[1].innerHTML = status;
                         document.getElementById("notify").style.display = "block";
                         setTimeout(function(){
                         document.getElementById("notify").style.display = "none";
                       } , 1000 );
                      });
                       anime({
                        targets: '.table',
                        opacity: 1,
                        duration: 500
                      })
                     })
                   }else{
                       window.alert("Something Went Wrong");
                   }

           })
         }

      })



      }



 function remove(x){
    fetch('/remove_project' , {
        method:'POST',
        enctype:'multipart/form-data',
        headers:{
            'Accept':'application/json , text/plain , text/html */*',
            'Content-type':'application/json'
        },
        body:JSON.stringify({index:x})
     })
    .then(res => res.json())
    .then( data=>{
        if( data.success ){
         window.alert("Trash Project");
         window.location.reload();
       }else{
         window.alert(data.msg);
       }
    })
    .catch(err=>{
      console.log(err);
    })
  }

  function complete(x){

     fetch('/complete_project' , {
         method:'POST',
         enctype:'multipart/form-data',
         headers:{
             'Accept':'application/json , text/plain , text/html */*',
             'Content-type':'application/json'
         },
         body:JSON.stringify({index:x})
      })
     .then(res => res.json())
     .then( data=>{
       if( data.success ){
          window.alert("Project Completed");
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
   document.getElementById("owner").value = "";
   document.getElementById("template").value = "";
   document.getElementById("start").value = "";
   document.getElementById("end").value = "";
   document.getElementById("overview").value = "";
   document.getElementById("group").value = "";
 }



      document.getElementById("submit").onclick = submitform;
      document.getElementById("submit1").onclick = submitform1;

      function change(x , value ){
        indice = x;

        if( value == 1){
           status ="Active";
         }

          if(value == 2){
            status = "In Progress";
          }

          if(value == 3){
            status = "On Track";
          }

          if(value == 4){
            status = "Delayed";
          }
          if(value == 5){
            status = "In Testing";
          }
          if(value == 6){
            status = "On Hold";
          }
          if(value == 7){
            status = "Approved";
          }

          if(value == 8){
            status = "Cancelled";
          }

          if(value == 9){
             status = "Planning";
          }

          if(value == 10){
            status = "Completed";
          }

          if(value ==11 ){
            status = "Invoiced";
          }

          display(x , 1);

      //  document.getElementById("submit1").click();

    }


      let url = window.location.href;
      url = url.split("project?")[1];
      var object = url.split("&");
      var email = object[0].split("=")[1];
      var name = object[1].split("=")[1];

      console.log(document.querySelectorAll(".link"));
      var u = document.querySelector(".link").href;
      u+=`&name=${name}`;
      u+=`&email=${email}`;


      var x, i;

      x = document.querySelectorAll(".link");
      for (i = 0; i < x.length; i++){
        x[i].href = u;
      }



      function submitform(e){

           e.preventDefault();
           const title = document.getElementById("title").value;
           const owner = document.getElementById("owner").value;
           const template = document.getElementById("template").value;
           const start = document.getElementById("start").value;
           const end = document.getElementById("end").value;
           const overview = document.getElementById("overview").value;
           const group = document.getElementById("group").value;
           const id = document.getElementById("myTable").rows.length-1;
           const state = status;


           let url = window.location.href;
           url = url.split("project?")[1];
           var object = url.split("&");
           email = object[0].split("=")[1];

           fetch('/project' , {

               method:'POST',
               enctype:'multipart/form-data',
               headers:{
                   'Accept':'application/json , text/plain , text/html */*',
                   'Content-type':'application/json'
               },
               body:JSON.stringify({email:email,title:title,owner:owner,template:template,start:start,end:end,overview:overview,group:group,status:state ,id:id})
           })
           .then(res =>{
               return res.json();
           })
           .then( data=>{

                  if( data.success==true ){
                     window.alert("Your project is succesfully submitted!");
                      const tr = document.createElement('tr');

                      tr.classList.add('detail');
                      tr.innerHTML = `
                      <td id="data">
                      <div class="dropdown">
                        <button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown" >&otimes;</button>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
                          <li role="presentation"><a  role="menuitem" tabindex="-1" id="a1" style="cursor:pointer" onclick="display(${id} , 0)">Update Project </a></li>
                          <li role="presentation"><a  role="menuitem" tabindex="-1" id="a2" style="cursor:pointer" onclick="remove(${id})">Trash Project</a></li>
                          <li role="presentation"><a  role="menuitem" tabindex="-1" id="a3"style="cursor:pointer" onclick="complete(${id})">Completed</a></li>
                        </ul>
                      </div>
                      </td>
                      <td id="data"><a class="link" style="color:blue" href=dashboard?project=${title}&name=${name}&email=${email} >${title}</a></td>
                      <td id="data"></td>
                      <td id="data">${owner}</td>
                      <td id="data">
                      <div class="dropdown">
                        <button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown" >${state}</button>
                         <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
                         <li role="presentation"> <a role="menuitem" tabindex="-1" id="a1" onclick="change(${id} , 1 )">Active</a></li>
                         <li role="presentation"><a role="menuitem" tabindex="-1" id="a2" onclick="change(${id} , 2)">In Progress</a></li>
                         <li role="presentation"><a role="menuitem" tabindex="-1" id="a3" onclick="change(${id} , 3)">On Track</a></li>
                         <li role="presentation"><a role="menuitem" tabindex="-1"id="a4" onclick="change(${id} ,  4)">Delayed</a></li>
                         <li role="presentation"><a role="menuitem" tabindex="-1"id="a5" onclick="change(${id}, 5)">In Testing</a></li>
                         <li role="presentation"><a role="menuitem" tabindex="-1"id="a6" onclick="change(${id} , 6)">On Hold</a></li>
                         <li role="presentation"><a role="menuitem" tabindex="-1"id="a7" onclick="change(${id} , 7)">Approved</a></li>
                         <li role="presentation"><a role="menuitem" tabindex="-1"id="a8" onclick="change(${id}, 8)">Cancelled</a></li>
                         <li role="presentation"><a role="menuitem" tabindex="-1" id="a9" onclick="change(${id} , 9)">Planning</a></li>
                         <li role="presentation"><a role="menuitem" tabindex="-1" id="a10"onclick="change(${id} , 10)">Completed</a></li>
                         <li role="presentation"><a role="menuitem" tabindex="-1" id="a11" onclick="change(${id} , 11)">Invoiced</a></li>
                        </ul>
                      </div>
                      </td>
                      <td id="data"><div style="margin-left:auto;margin-right:auto;width:90px;text-align:center;background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);font-size:0.8em">No Milestones</div></td>
                      <td id="data"><div style="margin-left:auto;margin-right:auto;width:90px;text-align:center;padding-right:auto;background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);font-size:0.8em">No Bugs</div></td>
                      <td id="data" >${start}</td>
                      <td id="data">${end}</td>
                      <td id="data"></td>
                      <td id="data"></td>
                      `;
                      document.querySelector('#myTable').appendChild(tr);

                      $(document).ready(function(){
                        $("#project_form").hide( "slide", {direction: "right" }, 500 , function(){

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
                     document.getElementById("owner").value = "";
                     document.getElementById("template").value = "";
                     document.getElementById("start").value = "";
                     document.getElementById("end").value = "";
                     document.getElementById("overview").value = "";
                     document.getElementById("group").value = "";


                 }

                   else{
                       window.alert(data.msg);
                   }

           })

       }

      function submitform1(e){
        e.preventDefault();
        const title = document.getElementById("title").value;
        const owner = document.getElementById("owner").value;
        const template = document.getElementById("template").value;
        const start = document.getElementById("start").value;
        const end = document.getElementById("end").value;
        const overview = document.getElementById("overview").value;
        const group = document.getElementById("group").value;
        const id = indice;
        const state = status;

        console.log(title);

        fetch('/updateproject' , {
            method:'POST',
            enctype:'multipart/form-data',
            headers:{
                'Accept':'application/json , text/plain , text/html',
                'Content-type':'application/json'
            },
            body:JSON.stringify({status:state,title:title,owner:owner,template:template,start:start,end:end,overview:overview,group:group ,id:id})
        })
        .then(res =>{
            return res.json();
        })
        .then( data=>{

                if( data.success== true ){

                  document.getElementById("submit").display = "block";
                  document.getElementById("submit1").display = "none";
                  document.getElementById("cancel").left= "80px";
                  $(document).ready(function(){
                    $("#project_form").hide( "slide", {direction: "right" }, 500 , function(){
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
