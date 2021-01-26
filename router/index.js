const express = require('express');
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};



var url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gourav';

mongoose.connect(url , options );
var db = mongoose.connection;
const projectdetail = db.collection("project");
const admin = db.collection("admin");
const tag = db.collection("tag");





router.get('/dashboard' , function(req , res){
  var project = req.query.project;
  var name = req.query.name;
  var email = req.query.email;

  projectdetail.find().toArray()
  .then( data=>{

    for( let i=0 ; i<data.length ; i++ ){
      for( let k=0 ; k<data[i].users.length ; k++ ){
        if( data[i].title == project && data[i].users[k].email == email ){
          res.render('dashboard' , {
            project:project,
            name:name,
            email:email,
            post:data[i].users[k].post
          });
        }
      }
    }

  })



})

router.get('/home' , function(req , res){
  res.render('home');
})

router.get('/event' , function(req , res){

  var project = req.query.project;
  var email = req.query.email;
  var name = req.query.name;

 let d1 = new Date();

 projectdetail.find().toArray()
 .then(data=>{

   for( let i=0 ; i<data.length ; i++ ){
     if( data[i].title == project){
      for( let k=0 ; k<data[i].users.length ; k++ ){
       if(data[i].users[k].email == email){


                 const a = data[i].events.filter(x=>{
                 if( x.single == true ){
                   let d2 = new Date(x.start_single);
                   if( d1 <= d2 ){
                     return x;
                   }
                 }else{
                   let d2 = new Date(x.to);
                   if( d1 <= d2 ){
                     return x;
                   }
                 }
               })


         res.render('events' , {
             event_detail:a,
             email:email,
             project:project,
             name:name
         })
       }
     }
    }
   }
 })


})

router.get('/calender' , function(req , res){

   let date_ob = new Date();

  // adjust 0 before single digit date
   let d = ("0" + date_ob.getDate()).slice(-2);

  // current month
   let m = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
   let y = date_ob.getFullYear();

   var name = req.query.name;
   var email = req.query.email;
     res.render('calender' , {
       year:y,
       month:m,
       name:name,
       email:email
     });

})

router.get('/calender1' , function(req , res){

  var project = req.query.project;
  var name = req.query.name;
  var email = req.query.email;


   let date_ob = new Date();

  // adjust 0 before single digit date
   let d = ("0" + date_ob.getDate()).slice(-2);

  // current month
   let m = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
   let y = date_ob.getFullYear();

     res.render('calender1' , {
       year:y,
       month:m,
       project:project,
       name:name,
       email:email
     });

})

router.get('/bug' , function(req , res){

  var project = req.query.project;
  var email = req.query.email;
  var name = req.query.name;

  projectdetail.find().toArray()
  .then(data=>{

    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].title == project){
       for( let k=0 ; k<data[i].users.length ; k++ ){
        if(data[i].users[k].email == email){
          res.render('bug' , {
              bug_detail:data[i].bugs,
              project:project,
              name:name,
              email:email
          })
        }
      }
     }
     }
  })


})

router.get('/milestone' , function(req , res){

  var project = req.query.project;
  var email = req.query.email;
  var name = req.query.name;

  projectdetail.find().toArray()
  .then(data=>{

    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].title == project){
       for( let k=0 ; k<data[i].users.length ; k++ ){
        if(data[i].users[k].email == email){
          res.render('milestone' , {
              milestone_detail:data[i].milestones,
              email:email,
              name:name,
              project:project
          })
        }
      }
    }
  }

  })
})

router.get('/user' , function(req , res){
  var project = req.query.project;
  var email = req.query.email;
  var name = req.query.name;

  projectdetail.find().toArray()
  .then(data=>{

    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].title == project){
       for( let k=0 ; k<data[i].users.length ; k++ ){
        if(data[i].users[k].email == email){
          res.render('adduser' , {
              project:project,
              name:name,
              email:email,
              success:""
          })
        }
      }
     }
     }
  })


})

router.get('/project' , function(req , res){

  var name = req.query.name;
  var email = req.query.email;

  projectdetail.find().toArray()
  .then(user=>{

   let data = [];
     for( let i=0 ; i<user.length ; i++ ){
      for( let j=0 ; j<user[i].users.length ; j++ ){
       if( user[i].users[j].email == email ){
         data.push(user[i]);
       }
      }
     }
    res.render('project' , {
          detail:data,
          name:name,
          email:email
    })

  })

})

router.get('/', function(req ,res){
  res.render('register',{
    msg:''
  });
})

router.get('/admin' , function(req , res){
  var email = req.query.email;

  admin.find().toArray()
  .then(data=>{
     for( let i=0 ; i<data.length ; i++ ){
       if( data[i].email == email ){
         var title = "<div><h6>"+data[i].name+"</h6><h6>"+data[i].email+"</h6><h6>"+data[i].mobile+"</h6></div>";
         res.render('admin',{
           name:data[i].name,
           email:data[i].email,
           mobile:data[i].mobile,
           title:title,
           notify:data[i].notify
         });


       }
     }
  })


})

router.get('/login' , function(req , res){

  let email = req.query.email;

  res.render('login' , {
    email:email,
    msg:''
  })

})


router.get('/chat',function(req , res){

  var name = req.query.name;
  var email = req.query.email;

  res.render('chat',{
    name:name,
    email:email
  });
})

router.get('/messages', function(req ,res){
  var name = req.query.name;
  var email = req.query.email;
  res.render('messages' , {
    name:name,
    email:email
  });
})

router.get('/forget' , function(req , res){
  res.render('forget' , {
    msg:''
  });
})

module.exports =  router;
