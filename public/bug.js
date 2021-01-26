  let indice;
  let status = "Open";

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
       $("#bug_form").show( "slide", {direction: "right" }, 500 );
       anime({
        targets: '.table',
        opacity: 0.2,
        duration: 500
      })
     })

     $("#cancel").click(function(){
       $("#bug_form").hide( "slide", {direction: "left" }, 500 );
       anime({
        targets: '.table',
        opacity: 1,
        duration: 500
      })
    })

})


function milestone(){

   fetch('/milestone_detail',{
      method:'POST',
      enctype:'multipart/form-data',
      headers:{ 'Accept':'application/json , text/plain , text/html */*',
       'Content-type':'application/json'
     },
     body:JSON.stringify({project:project,email:email})
   })
   .then(res=>res.json())
   .then(data=>{

     for( let i=0 ; i<data.milestone.length ; i++ ){
       let op1 = document.createElement('option');
       op1.innerHTML+=`${data.milestone[i].title}`;
       let op2 = document.createElement('option');
       op2.innerHTML+=`${data.milestone[i].title}`;
       document.getElementById("release").appendChild(op1);
       document.getElementById("affect").appendChild(op2);
     }


   })

}

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
     if( data.detail[i].email != email ){
      let op1 = document.createElement('option');
      op1.innerHTML+=`${data.detail[i].email}`;
      let op2 = document.createElement('option');
      op2.innerHTML+=`${data.detail[i].email}`;
      document.getElementById("add_follower").appendChild(op2);
      document.getElementById("assign_to").appendChild(op1);
     }
    }


  })
}


  function display(x , y){

         indice = x;

          fetch('/update_bug' , {
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
           document.getElementById("assign_to").value = data.assign_to;
           document.getElementById("add_follower").value = data.add_follower;
           document.getElementById("date").value = data.date;
           document.getElementById("severity").value = data.severity ;
           document.getElementById("release").value = data.release;
           document.getElementById("affect").value = data.affect;
           document.getElementById("classify").value = data.classify;
           document.getElementById("reproducible").value = data.reproducible;
           document.getElementById("tag").value = data.tag;
           document.getElementById("overview").value = data.overview;
           if( y==0 ){
           document.getElementById("submit").style.display = "none";
           document.getElementById("submit1").style.display = "block";
           document.getElementById("cancel").style.float= "right";
           status = data.status;
           document.getElementById("new").click();
           }else{
           const id = indice;
           const state =  status;
           const title = document.getElementById("title").value;
           const assign_to = document.getElementById("assign_to").value;
           const add_follower = document.getElementById("add_follower").value ;
           const date = document.getElementById("date").value;
           const severity = document.getElementById("severity").value;
           const release = document.getElementById("release").value ;
           const affect = document.getElementById("affect").value ;
           const classify = document.getElementById("classify").value ;
           const reproducible  = document.getElementById("reproducible").value ;
           const tag = document.getElementById("tag").value ;
           const overview = document.getElementById("overview").value ;
                   fetch('/updatebug' , {
                     method:'POST',
                     enctype:'multipart/form-data',
                     headers:{
                         'Accept':'application/json , text/plain , text/html */*',
                         'Content-type':'application/json'
                     },
                     body:JSON.stringify({email:email,project:project,status:state,title:title,assign_to:assign_to , add_follower:add_follower , date:date , severity:severity , release:release , affect:affect , reproducible:reproducible , tag:tag , classify:classify , overview:overview,id:id})
                   })
                   .then(res =>{
                       return res.json();
                   })
                   .then( data=>{
                     if( data.success== true ){

                       document.getElementById("submit").display = "block";
                       document.getElementById("submit1").display = "none";
                       document.getElementById("cancel").left= "60px";
                       $(document).ready(function(){
                       $("#bug_form").hide( "slide", {direction: "right" }, 500 , function(){
                           document.getElementById('myTable').rows[parseInt(indice , 10)+1].cells[4].childNodes[1].childNodes[1].innerHTML = status;
                           document.getElementById("notify").style.display = "block";
                           setTimeout(function(){
                           document.getElementById("notify").style.display = "none";
                           } , 1000 );
                         //  window.location.reload();
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

        fetch('/remove_bug' , {
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
             window.alert("Trash Bug");
             window.location.reload();
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
          body:JSON.stringify({index:x , which:"bug_form"})
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

    fetch('/complete_bug' , {
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
        window.alert("Bug Completed");
        window.location.reload()
     }else{
       window.alert(data.msg);
     }
    })
    .catch(err=>{
     console.log(err);
    })

    }
  function change(x , value ){

    if( value == 1 ){
      status ="Open";
    }

    if(value == 2 ){
      status = "In Progress";
    }

    if(value == 3 ){
      status = "To Be Tested";
    }

    if(value == 4 ){
      status = "Closed";
    }

    display( x , 1);

  }

  document.getElementById("cancel").onclick = function(){
      document.getElementById("title").value = "";
      document.getElementById("date").value = "";
      document.getElementById("tag").value = "";
      document.getElementById("overview").value = "";
      document.getElementById("file").value = "";
      document.getElementById("submit").style.display = "block";
      document.getElementById("submit1").style.display = "none";
      document.getElementById("cancel").style.float= "right";
}


  document.getElementById("submit").onclick = submitform;
  document.getElementById("submit1").onclick = submitform1;


   function submitform(e){

           e.preventDefault();

           const state =  status;
           const title = document.getElementById("title").value
           const assign_to = document.getElementById("assign_to").value;
           const add_follower = document.getElementById("add_follower").value ;
           const date = document.getElementById("date").value;
           const severity = document.getElementById("severity").value;
           const release = document.getElementById("release").value;
           const affect = document.getElementById("affect").value;
           const classify = document.getElementById("classify").value;
           const reproducible  = document.getElementById("reproducible").value;
           const tag = document.getElementById("tag").value;
           const overview = document.getElementById("overview").value;


// special thing about form-data is that network methods such as fetch api  can accept formData object as a
//body , its encoded and sent out with contentType multipart-formdata


           let fd = new FormData(bug);
           fd.append("status" , state);
           fd.append("project",project);
           fd.append("email",email);


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
                      const tr = document.createElement('tr');

                      tr.classList.add('detail');
                      tr.innerHTML = `

                      <td  id="data">
                      <div class="dropdown">
                        <button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown" >&otimes;</button>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
                          <li role="presentation"><a  role="menuitem" tabindex="-1" id="a1" style="cursor:pointer" onclick="display(${data.id} , 0)">Update Project </a></li>
                          <li role="presentation"><a  role="menuitem" tabindex="-1" id="a2" style="cursor:pointer" onclick="remove(${data.id})">Trash Project</a></li>
                          <li role="presentation"><a  role="menuitem" tabindex="-1" id="a3"style="cursor:pointer" onclick="complete(${data.id})">Completed</a></li>                        </ul>
                      </div>
                      </td>
                      <td id="data"><a href="" style="color:blue">${title}</a></td>
                      <td id="data"></td>
                      <td id="data">${data.time}</td>
                      <td id="data">
                      <div class="dropdown">
                        <button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown" >${status}</button>
                         <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
                         <li role="presentation"><a role="menuitem" tabindex="-1" id="a1" onclick="change(${data.id} , 1)"> Open </a> </li>
                         <li role="presentation"><a role="menuitem" tabindex="-1" id="a2" onclick="change(${data.id} , 2)"> In Progress </a> </li>
                         <li role="presentation"><a role="menuitem" tabindex="-1" id="a3" onclick="change(${data.id} , 3)"> To Be Tested </a> </li>
                         <li role="presentation"><a role="menuitem" tabindex="-1" id="a4" onclick="change(${data.id} , 4)"> Closed </a> </li>
                        </ul>
                      </div>
                   </td>
                   <td id="data" >${tag}</td>
                   <td id="data">${assign_to}</td>
                   <td id="data">${date}</td>
                   <td id="data">${severity}</td>
                      `;
                      document.querySelector('#myTable').appendChild(tr);


                    $(document).ready(function(){
                     $("#bug_form").hide( "slide", {direction: "right" }, 500 , function(){
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
                     document.getElementById("date").value = "";
                     document.getElementById("tag").value = "";
                     document.getElementById("overview").value = "";
                     document.getElementById("file").value = "";



                 }

                   else{
                       window.alert(data.msg);
                   }

           })

       }

   function submitform1(e){
        e.preventDefault();

        const id = indice;
        const state =  status;
        const title = document.getElementById("title").value;
        const assign_to = document.getElementById("assign_to").value;
        const add_follower = document.getElementById("add_follower").value;
        const date = document.getElementById("date").value;
        const severity = document.getElementById("severity").value;
        const release = document.getElementById("release").value;
        const affect = document.getElementById("affect").value;
        const classify = document.getElementById("classify").value;
        const reproducible  = document.getElementById("reproducible").value;
        const tag = document.getElementById("tag").value;
        const overview = document.getElementById("overview").value;


        fetch('/updatebug' , {
          method:'POST',
          enctype:'multipart/form-data',
          headers:{
              'Accept':'application/json , text/plain , text/html */*',
              'Content-type':'application/json'
          },
          body:JSON.stringify({status:state,title:title,assign_to:assign_to,add_follower:add_follower,date:date,severity:severity,release:release,affect:affect,reproducible:reproducible,tag:tag,classify:classify,overview:overview,id:id,project:project,email:email})
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





milestone();
user();
