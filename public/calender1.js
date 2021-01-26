
function logout(){
  window.location.href ="/";
}

  let url = window.location.href;
  let query = url.split("?")[1];

  var p = query.split("&");
  var project = p[0].split("=")[1];
  var name = p[1].split("=")[1];
  var email = p[2].split("=")[1];
  var post = p[3].split("=")[1];


    var x, i;
    x = document.querySelectorAll(".link");
    for (i = 0; i < x.length; i++) {
      var u = x[i].href.split("?")[0];
      u+="?"+query;
      x[i].href = u;
    }
    document.getElementById("heading").innerHTML = project;
    document.getElementById("post").innerHTML = post;

  function back(){
    window.location.href = "/project?email="+email+"&name="+name;
  }

  $(function(){
     $(".profile").tooltip({html: true, placement: "left", trigger: "hover"});
    $(".profile1").tooltip({html: true, placement: "left", trigger: "hover"});
  })


$(document).ready(function(){

    $( "#hide-option" ).tooltip({
     hide: {
     effect: "explode",
     delay: 250
     }
    });
});

//set month on page
let date_ob = new Date();
let m = ("0" + (date_ob.getMonth() + 1)).slice(-2);

document.getElementById("month").selectedIndex = (parseInt(m)-1).toString();


let current_day;
let current_date;
//on clicking the any date from calender display function is executed
function display(x , y){

   $(document).ready(function(){
    $("#which").show( "slide", {direction: "left" }, 80 );
    $("which").css("position","relative");
   })


   current_date = y.toString();
   current_day = x;
   if( current_date.length < 2 ){
      current_date = "0"+current_date;
   }
   let m = month.toString();
   if( m.length < 2 ){
     m = "0"+m;
   }
   current = document.getElementById("year").innerHTML + "-" + m + "-" + current_date;
   document.getElementById("start_single2").value = current;
   document.getElementById("from2").value = current;
   document.getElementById("start_single2").disabled = true;
   document.getElementById("from2").disabled = true;

 }


function event1(){

  $(document).ready(function(){
   $("#event_form").show( "slide", {direction: "right" }, 500 );
  })
}

function bug(){
  $(document).ready(function(){
     $("#bug_form").show( "slide", {direction: "right" }, 500 );
  })
}

function milestone(){
  $(document).ready(function(){
   $("#milestone_form").show( "slide", {direction: "right" }, 500 );
  })
}

$(document).ready(function(){
   $("#cancel1").click(function(){
   $("#bug_form").hide( "slide", {direction: "right" }, 500 );
    $("#which").hide("slide" , {direction:"right"} , 20);
  })

  $("#cancel2").click(function(){
  $("#event_form").hide( "slide", {direction: "right" }, 500 );
  $("#which").hide("slide" , {direction:"right"} , 20);
  })

  $("#cancel3").click(function(){
  $("#milestone_form").hide( "slide", {direction: "right" }, 500 );
  $("#which").hide("slide" , {direction:"right"} , 20);
  })
})

give();


document.getElementById("b1").onclick = function(){
   let year = document.getElementById("year").innerHTML;
   year = parseInt(year , 10);
   year-=1;
   document.getElementById("year").innerHTML = year;
   give();
 }

document.getElementById("b2").onclick = function(){
   let year = document.getElementById("year").innerHTML;
   year = parseInt(year , 10);
   year+=1;
   document.getElementById("year").innerHTML = year;
   give();
 }

function dayofweek( d,  m, y){
    let array = [];
    array.push(0);
    array.push(3);
    array.push(2);
    array.push(5);
    array.push(0);
    array.push(3);
    array.push(5);
    array.push(1);
    array.push(4);
    array.push(6);
    array.push(2);
    array.push(4);

     y -= m < 3;
     return ( y + y / 4 - y / 100 +
              y / 400 + array[m - 1] + d) % 7;
 }

function give(){



if( document.querySelector("tbody").rows.length > 1  ){
  for( let k =document.querySelector("tbody").rows.length-1 ; k>=1 ; k-- ){
   document.querySelector("tbody").deleteRow(k);
  }
}


 let date = 1;

 let year = parseInt(document.getElementById("year").innerHTML , 10);
 let i;

 let curmonth = document.getElementById("month").value;

 if( curmonth == "January"){
   month = 1;
   i=31;
 }
 if( curmonth == "February"){
   month = 2;
   i=28;
 }
 if( curmonth == "March"){
   month = 3;
   i=31;
 }
 if( curmonth == "April"){
   month = 4;
   i=30;
 }
 if( curmonth == "May"){
   month = 5;
   i=31;
 }
 if( curmonth == "June"){
   month = 6;
   i=30;
 }
 if( curmonth == "July"){
   month = 7;
   i=31;
 }
 if( curmonth == "August"){
   month = 8;
   i=31;
 }
 if( curmonth == "September"){
   month = 9;
   i=30;
 }
 if( curmonth == "October"){
   month = 10;
   i=31;
 }
 if( curmonth == "November"){
   month = 11;
   i=30;
 }
 if( curmonth == "December"){
   month = 12;
   i=31;
 }

   let day = parseInt(Math.round(dayofweek( 1 , month , year)) , 10);


   if( day == 1){
   let tr = document.createElement('tr');
   tr.classList.add('detail');
   tr.innerHTML = `

   <td  id="data" onclick ="display( 1 , 1)"><p>1</p></td>
   <td  id="data" onclick ="display( 2 , 2)"><p>2</p></td>
   <td  id="data" onclick ="display( 3 , 3)"><p>3</p></td>
   <td  id="data" onclick ="display( 4 , 4)"><p>4</p></td>
   <td  id="data" onclick ="display( 5 , 5)"><p>5</p></td>
   <td  id="data" onclick ="display( 6 , 6)"><p>6</p></td>
   <td  id="data" onclick ="display( 7 , 7)"><p>7</p></td>

   `;
      document.querySelector("tbody").appendChild(tr);
         }

  if( day == 2 ){

    let tr = document.createElement('tr');
    tr.classList.add('detail');
    tr.innerHTML = `

    <td  id="data"><p></p></td>
    <td  id="data" onclick ="display( 2 , 1)"><p>1</p></td>
    <td  id="data" onclick ="display( 3 , 2)"><p>2</p></td>
    <td  id="data" onclick ="display( 4 , 3)"><p>3</p></td>
    <td  id="data" onclick ="display( 5 , 4)"><p>4</p></td>
    <td  id="data" onclick ="display( 6 , 5)"><p>5</p></td>
    <td  id="data" onclick ="display( 7 , 6)"><p>6</p></td>

    `;
  document.querySelector("tbody").appendChild(tr);
  }

  if( day == 3 ){
    let tr = document.createElement('tr');
    tr.classList.add('detail');
    tr.innerHTML = `

    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data" onclick ="display( 3 , 1)"><p>1</p></td>
    <td  id="data" onclick ="display( 4 , 2)"><p>2</p></td>
    <td  id="data" onclick ="display( 5 , 3)"><p>3</p></td>
    <td  id="data" onclick ="display( 6 , 4)"><p>4</p></td>
    <td  id="data" onclick ="display( 7 , 5)"><p>5</p></td>

    `;
    document.querySelector("tbody").appendChild(tr);
  }

  if( day == 4 ){
    let tr = document.createElement('tr');
    tr.classList.add('detail');
    tr.innerHTML = `

    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data" onclick ="display( 4 , 1)"><p>1</p></td>
    <td  id="data" onclick ="display( 5 , 2)"><p>2</p></td>
    <td  id="data" onclick ="display( 6 , 3)"><p>3</p></td>
    <td  id="data" onclick ="display( 7 , 4)"><p>4</p></td>

    `;
    document.querySelector("tbody").appendChild(tr);
  }

  if( day == 5 ){
    let tr = document.createElement('tr');
    tr.classList.add('detail');
    tr.innerHTML = `

    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data" onclick ="display( 5 , 1)"><p>1</p></td>
    <td  id="data" onclick ="display( 6 , 2)"><p>2</p></td>
    <td  id="data" onclick ="display( 7 , 3)"><p>3</p></td>

    `;
    document.querySelector("tbody").appendChild(tr);
       }

  if( day == 6 ){
    let tr = document.createElement('tr');
    tr.classList.add('detail');
    tr.innerHTML = `

    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td id="data" onclick ="display( 6 , 1)"><p>1</p></td>
    <td id="data" onclick ="display( 7 , 2)"><p>2</p></td>

    `;
  document.querySelector("tbody").appendChild(tr);
  }

  if( day == 7 || day == 0){
    let tr = document.createElement('tr');
    tr.classList.add('detail');
    tr.innerHTML = `

    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data"><p></p></td>
    <td  id="data" onclick ="display( 7 , 1)"><p>1</p></td>

    `;
      document.querySelector("tbody").appendChild(tr);
         }



  let last;
  if( day ==0 ){
    day = 7;
  }
  for( let j=9-parseInt(day , 10) ; j<=i ; j+=7 ){
    let tr = document.createElement('tr');
    tr.classList.add('detail');
    if( j+6 > i ){
      last = j;
      break;
    }

    tr.innerHTML = `
    <td  id="data" onclick ="display( 1 , ${j})"><p>${j}</p></td>
    <td  id="data" onclick ="display( 2 , ${j+1})"><p>${j+1}</p></td>
    <td  id="data" onclick ="display( 3 , ${j+2})"><p>${j+2}</p></td>
    <td  id="data" onclick ="display( 4 , ${j+3})"><p>${j+3}</p></td>
    <td  id="data" onclick ="display( 5 , ${j+4})"><p>${j+4}</p></td>
    <td  id="data" onclick ="display( 6 , ${j+5})"><p>${j+5}</p></td>
    <td  id="data" onclick ="display( 7 , ${j+6})"><p>${j+6}</p></td>

    `;

    document.querySelector("tbody").appendChild(tr);
  }

 let j = last;

  if( j == i ){
  let tr = document.createElement('tr');
  tr.classList.add('detail');
  tr.innerHTML = `

  <td id="data" onclick ="display( 1 , ${j})"><p>${j}</p></td>
  <td  id="data"><p></p></td>
  <td  id="data"><p></p></td>
  <td  id="data"><p></p></td>
  <td  id="data"><p></p></td>
  <td  id="data"><p></p></td>
  <td  id="data"><p></p></td>

  `;
     document.querySelector("tbody").appendChild(tr);
 }

 if( j+1 == i ){

   let tr = document.createElement('tr');
   tr.classList.add('detail');
   tr.innerHTML = `

   <td  id="data" onclick ="display( 1 , ${j})"><p>${j}</p></td>
   <td  id="data" onclick ="display( 2 , ${j+1})"><p>${j+1}</p></td>
   <td  id="data"><p></p></td>
   <td  id="data"><p></p></td>
   <td  id="data"><p></p></td>
   <td  id="data"><p></p></td>
   <td  id="data"><p></p></td>

   `;
 document.querySelector("tbody").appendChild(tr);
 }

 if( j+2 == i ){
   let tr = document.createElement('tr');
   tr.classList.add('detail');
   tr.innerHTML = `

   <td  id="data" onclick ="display( 1 , ${j})"><p>${j}</p></td>
   <td  id="data" onclick ="display( 2 , ${j+1})"><p>${j+1}</p></td>
   <td  id="data" onclick ="display( 3 , ${j+2})"><p>${j+2}</p></td>
   <td  id="data"><p></p></td>
   <td  id="data"><p></p></td>
   <td  id="data"><p></p></td>
   <td  id="data"><p></p></td>

   `;
   document.querySelector("tbody").appendChild(tr);
 }

 if( j+3 == i ){
   let tr = document.createElement('tr');
   tr.classList.add('detail');
   tr.innerHTML = `

   <td  id="data" onclick ="display( 1 , ${j})"><p>${j}</p></td>
   <td  id="data" onclick ="display( 2 , ${j+1})"><p>${j+1}</p></td>
   <td  id="data" onclick ="display( 3 , ${j+2})"><p>${j+2}</p></td>
   <td  id="data" onclick ="display( 4 , ${j+3})"><p>${j+3}</p></td>
   <td  id="data"><p></p></td>
   <td  id="data"><p></p></td>
   <td  id="data"><p></p></td>

   `;
   document.querySelector("tbody").appendChild(tr);
 }

 if( j+4 == i ){
   let tr = document.createElement('tr');
   tr.classList.add('detail');
   tr.innerHTML = `

   <td  id="data" onclick ="display( 1 , ${j})"><p>${j}</p></td>
   <td  id="data" onclick ="display( 2 , ${j+1})"><p>${j+1}</p></td>
   <td  id="data" onclick ="display( 3 , ${j+2})"><p>${j+2}</p></td>
   <td  id="data" onclick ="display( 4 , ${j+3})"><p>${j+3}</p></td>
   <td  id="data" onclick ="display( 5 , ${j+4})"><p>${j+4}</p></td>
   <td  id="data"><p></p></td>
   <td  id="data"><p></p></td>

   `;
   document.querySelector("tbody").appendChild(tr);
      }

 if( j+5 == i  ){
   let tr = document.createElement('tr');
   tr.classList.add('detail');
   tr.innerHTML = `
   <td  id="data" onclick ="display( 1 , ${j})"><p>${j}</p></td>
   <td  id="data" onclick ="display( 2 , ${j+1})"><p>${j+1}</p></td>
   <td  id="data" onclick ="display( 3 , ${j+2})"><p>${j+2}</p></td>
   <td  id="data" onclick ="display( 4 , ${j+3})"><p>${j+3}</p></td>
   <td  id="data" onclick ="display( 6 , ${j+4})"><p>${j+4}</p></td>
   <td  id="data" onclick ="display( 5 , ${j+5})"><p>${j+5}</p></td>
   <td  id="data"><p></p></td>

   `;
 document.querySelector("tbody").appendChild(tr);

 }

 if( j+6 == i ){
   let tr = document.createElement('tr');
   tr.classList.add('detail');
   tr.innerHTML = `

   <td  id="data" onclick ="display( 1 , ${j})"><p>${j}</p></td>
   <td  id="data" onclick ="display( 2 , ${j+1})"><p>${j+1}</p></td>
   <td  id="data" onclick ="display( 3 , ${j+2})"><p>${j+2}</p></td>
   <td  id="data" onclick ="display( 4 , ${j+3})"><p>${j+3}</p></td>
   <td  id="data" onclick ="display( 6 , ${j+4})"><p>${j+4}</p></td>
   <td  id="data" onclick ="display( 5 , ${j+5})"><p>${j+5}</p></td>
   <td  id="data" onclick ="display( 7 , ${j+6})"><p>${j+6}</p></td>

   `;
     document.querySelector("tbody").appendChild(tr);
  }




  for( let i=0 ; i<document.querySelectorAll("#data").length ; i++ ){
   document.querySelectorAll("#data")[i].childNodes[0].id="date_";
   var div = document.createElement('div');
   div.classList.add('message');
   document.querySelectorAll("#data")[i].appendChild(div);
  }


  const det = {
    year:document.getElementById("year").innerHTML,
    month:document.getElementById("month").value,
    email:email,
    project:project
  }


  fetch("/give_tag" , {
    method:'POST',
    enctype:'multipart/form-data',
    headers:{
        'Accept':'application/json , text/plain , text/html */*',
        'Content-type':'application/json'
    },
    body:JSON.stringify(det)
  })
  .then(res=>{
    return res.json();
  })
  .then( data=>{

       const arr = data.arr.filter(x=>x)
        for( let i=0 ; i<arr.length ; i++ ){
          for( let j=0 ; j<document.querySelectorAll("#data").length ; j++ ){
            if(  document.querySelectorAll("#data")[j].childNodes[0].innerHTML == parseInt(arr[i].date,10).toString() ){
              if( arr[i].which == "bug_form" ){
                var div = document.createElement('div');
                div.classList.add('msg_div')
                div.innerHTML=`<p  class="profile1" title="<div>${arr[i].title}</div>" data-toggle="tooltip"  style='width:100%;border:2px solid blue;' >${arr[i].title}</p>`;
                document.querySelectorAll("#data")[j].childNodes[1].appendChild(div);
                break;
              }else if( arr[i].which == "event_form" ){
                var div = document.createElement('div');
                div.classList.add('msg_div');
                div.innerHTML=`<p  class="profile1" title="<div>${arr[i].title}</div>" data-toggle="tooltip"  style='width:100%;border:2px solid green' >${arr[i].title}</p>`;
                document.querySelectorAll("#data")[j].childNodes[1].appendChild(div);
                break;
              }else if( arr[i].which == "milestone_form" ){
                var div = document.createElement('div');
                div.classList.add('msg_div');
                div.innerHTML=`<p  class="profile1" title="<div>${arr[i].title}</div>" data-toggle="tooltip"  style='width:100%;border:2px solid purple' >${arr[i].title}</p>`;
                document.querySelectorAll("#data")[j].childNodes[1].appendChild(div);
                break;
              }
            }
        }
      }

  })

}





let n = parseInt(date_ob.getDay(),10);
let d = ("0" + date_ob.getDate()).slice(-2);

for( let row = 1 ; row <=6 ; row++ ){

  if( document.getElementById("myTable").rows[row].cells[n-1].childNodes[0].innerHTML === parseInt(d,10).toString() ){
    document.getElementById("myTable").rows[row].cells[n-1].childNodes[0].style.color = "#FF334F";
    break;
  }

}

$(function(){
  // $(".profile").tooltip({html: true, placement: "left", trigger: "hover"});
  $(".profile1").tooltip({html: true, placement: "left", trigger: "hover"});
})


function milestone1(){

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
       document.getElementById("release1").appendChild(op1);
       document.getElementById("affect1").appendChild(op2);
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
      document.getElementById("add_follower1").appendChild(op2);
      document.getElementById("assign_to1").appendChild(op1);
     }
     let op3 = document.createElement('option');
     op3.innerHTML+=`${data.detail[i].email}`;
     let op4 = document.createElement('option');
     op4.innerHTML+=`${data.detail[i].email}`;
     document.getElementById("user2").appendChild(op3);
     document.getElementById("user3").appendChild(op4);
    }


  })
}

milestone1();
user();
