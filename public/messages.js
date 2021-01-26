
let url = window.location.href;
let query = url.split("?")[1];
var p = query.split("&");
var email = p[0].split("=")[1];
var new_ = p[2].split("=")[1];


fetch('/all_news', {
  method:'POST',
  enctype:'multipart/form-data',
  headers:{ 'Accept':'application/json , text/plain , text/html */*',
   'Content-type':'application/json'
 },
 body:JSON.stringify({email:email,new:new_})
 })
 .then(res=>res.json())
 .then(data=>{

  if( data.success ){

   if( data.new.length == 0 && data.old.length == 0 ){
     document.querySelector('.box').style.display="none";
   }else{
     document.getElementById('nonew').style.display = "none";
   }

   if( data.new.length == 0 ){
     window.alert("No New Notification");
   }

   for( let i=0 ;i<data.new.length ; i++ ){
    let div = document.createElement('div');
    div.className = "new";
    div.innerHTML = `
    <i class="fa fa-trash" style="cursor:pointer;position:absolute;top:0px;right:0px"  onclick=delete_("${data.new[i]}") ></i>
    <h5><span style="color:green;font-weight:bold">Title:</span>${data.new[i].title}</h5>
    <h6><span style="font-weight:bold;color:green">Project:</span>${data.new[i].project}</h6>
    <h6><span style="font-weight:bold;color:green">From:</span>${data.new[i].from}</h6>
    <h6><span style="font-weight:bold;color:green">Description:</span></h6>
    <p style='width:100%;height:100px;white-space:nowrap;border:1px solid green;color:lightgreen'>${data.new[i].overview}</p>
    `
    document.querySelector('.box').appendChild(div);
   }

   for( let i=0 ;i<data.old.length ; i++ ){
    let div = document.createElement('div');
    let del = data.old[i].title+","+data.old[i].project+","+data.old[i].from+","+data.old[i].overview;
    del = del.split(' ').join('_');
    div.className = "old";
    div.innerHTML = `
    <i class="fa fa-trash" style="cursor:pointer;position:absolute;top:0px;right:0px" onclick=delete_("${del}") ></i>
    <h5><span style="font-weight:bold;color:#9B870C">Title:</span>${data.old[i].title}</h5>
    <h6><span style="font-weight:bold;color:#9B870C">Project:</span>${data.old[i].project}</h6>
    <h6><span style="font-weight:bold;color:#9B870C">From:</span>${data.old[i].from}</h6>
    <h6><span style="font-weight:bold;color:#9B870C">Description:</span></h6>
    <p style='width:100%;height:120px;white-space:nowrap;border:1px solid #9B870C'>${data.old[i].overview}</p>
    `
    document.querySelector('.box').appendChild(div);
   }

   }else{
    window.alert(data.msg);
   }
})


function logout(){
  window.location.href ="/";
}


function delete_(query){

 query = query.split('_').join(' ');

 query = query.split(',');


 fetch('/delete_notify',{
   method:'POST',
   enctype:'multipart/form-data',
   headers:{ 'Accept':'application/json , text/plain , text/html */*',
    'Content-type':'application/json'
  },
  body:JSON.stringify({title:query[0],project:query[1],from:query[2],email:email,overview:query[3]})
 })
 .then(res=>res.json())
 .then(data=>{
   if( data.success){
     window.alert("Successfully delete");
     window.location.reload();
   }else{
     window.alert(data.msg);
   }
 })

}
