const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const path = require('path');
const bodyparser = require('body-parser');
const moment = require('moment');
const request = require('request');
const crypto = require('crypto');
const methodoverride = require('method-override');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const grid = require('gridfs-stream');
const https = require('https');
const bcrypt = require('bcryptjs');
var CryptoJS = require("crypto-js");
const nodemailer = require('nodemailer');


const app = express();

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

var url ='mongodb://localhost:27017/gourav';
//var mongoURI = process.env.CONNECTION_STRING || 'mongodb://localhost:27017/gourav';

mongoose.connect(url , options );

var db = mongoose.connection;
const project = db.collection("project");
const admin = db.collection("admin");
const tag = db.collection("tag");
const notify = db.collection("notify");

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection Successful!");
});







//----------------------------------------UPLOADING FILES-----------------------------------//

//init gfs
let gfs;
//gfs is is used to store the file of more then size of 16 mb
db.once('open' , ()=>{
    gfs = grid(db.db , mongoose.mongo );
    gfs.collection('upload');
})
//create storage engine
const storage = new GridFsStorage({
  url:url,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'upload'
        //bucketname shouldmatch collection name
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({storage:storage});
// get /files:/filename
app.get('/files/:filename' , (req , res)=>{
 gfs.files.findOne({filename:req.params.filename} , (err , file)=>{

     if( !file || file.length==0 ){
         return res.status(404).json({
             err:'No file exist '
         })
     }

     //file exist
     const readstream = gfs.createReadStream({filename:file.filename});
     readstream.pipe(res);

  })
 })
// output the actual image
// get /imgae:/filename
app.get('/image/:filename' , (req , res)=>{

 gfs.files.findOne({filename:req.params.filename} , (err , file) =>{
     if( !file || file.length==0 ){
         return res.status(404).json({
             err:'No file exist'
         })
     }

     //file is an image
     if( file.contentType==='image/jpeg' || file.contentType ==='image/png' ){
         const readstream = gfs.createReadStream({filename:file.filename});
         readstream.pipe(res);
     }else{
         res.status(404).json({
             err:"fie is not an image"
         })
     }

 })
 })





const port = process.env.PORT||8000;
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));



//setup view engine
app.use(expressLayouts);
app.set("view layout" , "ejs" );
app.set( 'view engine' , 'ejs' );

// to use static files
app.use(express.static('public'))

// connect to router to unable strcutured code
app.use('/' , require('./router/index.js'));



//---------------------------------------------------user-----------------------------------------------//
app.post('/register' , (req ,res)=>{


   if( req.body.name == "" ){
     res.redirect('/?query=!!Name!!');
   }

   if( req.body.email == "" ){
     res.redirect('/?query=!!Email!!');
   }

   if( req.body.number == "" ){
     res.redirect('/?query=!!Number!!');
   }


   if( req.body.password == "" || req.body.rpassword == "" ){
    res.redirect('/?query=!!Password!!');
   }


   if( req.body.password != req.body.rpassword ){
      res.redirect("/?query=!!Passwords Doesn't Match!!");
   }

   let p = req.body.password;

   if( p.length < 8 ){
       res.redirect("/?query=!!Password length should be greater then 8 !!");
   }


   admin.findOne({email:req.body.email})
   .then(user=>{
     if( user ){
       res.redirect("/?query=Email Already Exist");
     }
   })
   .catch(err=>
    console.log(err)
   );


   var newUser= {
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    mobile:req.body.number,
    notify:0
   };

    function convert(){
     var ciphertext = CryptoJS.AES.encrypt(req.body.password, 'secret key 123').toString();
     newUser.password = ciphertext;
    }

    convert();

    admin.insertOne(newUser , function(err ){
        if(err){
         res.redirect('/?'+err);
       }
       res.redirect("/");
    });


})

app.post('/admin' , (req ,res)=>{

  if( req.body.email == "" ){
    res.redirect('/?query=!!Email!!');
  }


  if( req.body.password == "" ){
   res.redirect('/?query=!!Password!!');
  }


  admin.findOne({email:req.body.email})
  .then(user=>{
    if( user ){
      var bytes  = CryptoJS.AES.decrypt(user.password, 'secret key 123');
      var password = bytes.toString(CryptoJS.enc.Utf8);

      if( password != req.body.password ){
       res.redirect("/?query=!!Passwords Doesn't Match!!");
      }

     var title = "<div><h6>"+user.name+"</h6><h6>"+user.email+"</h6><h6>"+user.mobile+"</h6></div>";
     res.render('admin',{
       name:user.name,
       email:user.email,
       mobile:user.mobile,
       title:title,
       notify:user.notify
     });


    }else{
      res.redirect("/?query=!!No User Found!!");
    }
  })



})

app.post('/forget' , function(req , res){

   if( req.body.email == '' || req.body.null ){
     res.render('forget',{
       msg:"!! Email !!"
     })
   }


  if( req.body.password == "" || req.body.rpassword == "" ){
    res.render('forget' , {
      msg:" !! Password !! "
    })
  }

  if( req.body.password != req.body.rpassword ){
    res.render('forget' , {
      msg:" !!Password DoesN't Match!! "
    })
  }

   var ciphertext = CryptoJS.AES.encrypt(req.body.password, 'secret key 123').toString();

   admin.findOneAndUpdate({"email":req.body.email}, {$set:{"password":ciphertext}} , (err , doc)=>{
     if( err ){
      res.render('forget',{
        msg:"User not found"
      })
     }else{
       res.redirect('/');
     }
   })

})


//--------------------------------------------------- insertion-----------------------------------------//
app.post('/project' , function(req , res){

    if(req.body.title==''){
      return res.json({"success":false , "msg":"Project Title is mandatory"});
    }

    if(req.body.overview==''){
      return res.json({"success":false , "msg":"Overview is mandatory"});
    }

    const detail = {
      title:req.body.title,
      owner:req.body.owner,
      start:req.body.start,
      end:req.body.end,
      overview:req.body.overview,
      group:req.body.group,
      status:"Active",
      time:moment().format(),
      id:req.body.id,
      bugs:[],
      cbugs:[],
      milestones:[],
      cmilestones:[],
      events:[],
      cevents:[],
      users:[]
    };

    detail.users.push({post:"Admin",email:req.body.email});


    project.insertOne(detail , (err , docs)=>{
      if( err ){
        console.log(error);
        return res.json({"success":false , "msg":"Something get wrong"});
      }
        return res.json({"success":true , "msg":"correct"});
    })

});

app.post('/bug' , upload.single('file') , (req , res)=>{

      if(req.body.title==''){
       return res.json({"success":false , "msg":"Project Title is mandatory"});
      }


      project.find().toArray()
      .then(data=>{

        for( let i=0 ; i<data.length ; i++ ){
         if( data[i].title == req.body.project){
           for( let k=0 ; k<data[i].users.length ; k++ ){
             if(data[i].users[k].email == req.body.email){
              const count = data[i].bugs.length;

              const detail = {
                title:req.body.title,
                file:req.file,
                assign_to:req.body.assign_to,
                add_follower:req.body.add_follower,
                date:req.body.date,
                severity:req.body.severity,
                tag:req.body.tag,
                overview:req.body.overview,
                classify:req.body.classify,
                reproducible:req.body.reproducible,
                release:req.body.release,
                affect:req.body.affect,
                status:req.body.status,
                time:moment().format(),
                id:count
              };

              project.updateOne( {"title":req.body.project} , {$push:{bugs:detail}} , (err , docs)=>{
                if( err ){
                return res.json({"success":false,"msg":err})
                }

                 return res.json({"success":true , "msg":"correct" , "time":detail.time,"id":count});
              })

            }
          }
        }
      }


      })
      .catch(err=>{
        console.log(err);
      });

})

app.post('/event' ,  function(req , res){


    if(req.body.title==''){
      return res.json({"success":"false" , "msg":"Event Title is mandatory"});
    }

    if( req.body.start_single == '' && req.body.single == true ){
      return res.json({"success":"false" , "msg":"Event Date is mandatory"})
    }

    if( (req.body.from == '' || req.body.to == '') && req.body.single == false ){
      return res.json({"success":"false" , "msg":"Event Date is mandatory"})
    }

    if( req.body.single == true ){
      let d1 = new Date();
      let d2 = new Date(req.body.start_single);
      if( d1 > d2 ){
        return res.json({"success":"false" ,"msg":"Event data should more or equal to current date"})
      }
    }else{
      let d1 = new Date();
      let d2 = new Date(req.body.from);
      if( d1 > d2 ){
        return res.json({"success":"false" ,"msg":"Event data should more or equal to current date"})
      }
    }

   project.find().toArray()
   .then(data=>{

    for( let i=0 ; i<data.length ; i++ ){
     if( data[i].title == req.body.project){
       for( let k=0 ; k<data[i].users.length ; k++ ){
         if(data[i].users[k].email == req.body.email){
            const count = data[i].events.length;

            const detail = {
              id:count,
              title:req.body.title,
              start_single:req.body.start_single,
              start_time_single:req.body.start_time_single,
              start_time_multi:req.body.start_time_multi,
              end_time_single:req.body.end_time_single,
              end_time_multi:req.body.end_time_multi,
              from:req.body.from,
              to:req.body.to,
              user:req.body.user,
              location:req.body.location,
              begin:req.body.begin,
              end:req.body.end,
              duration:req.body.duration,
              repeat:req.body.repeat,
              overview:req.body.overview,
              single:req.body.single
            };


            project.updateOne({"title":req.body.project} , {$push:{events:detail}} , (err , docs)=>{

              if( err ){
              return res.json({"success":false,"msg":err})
              }

              return res.json({"success":true , "msg":"correct" , "time":detail.time,"id":count});
            })
          }
        }
       }
      }

    })
    .catch(err=>{
          return res.json({"success":false,"msg":err})
    })


})

app.post('/milestone' ,  function(req , res){


    if(req.body.title==''){
      return res.json({"success":"false" , "msg":"Title is mandatory"});
    }

    if( req.body.start == '' ){
      return res.json({"success":"false" , "msg":"Start Date is mandatory"})
    }

    if( req.body.end == '' ){
      return res.json({"success":"false" , "msg":"End Date is mandatory"})
    }

    if( req.body.user == '' ){
      return res.json({"success":"false" , "msg":"User is mandatory"})
    }



         project.find().toArray()
         .then(data=>{

          for( let i=0 ; i<data.length ; i++ ){
           if( data[i].title == req.body.project){
            for( let k=0 ; k<data[i].users.length ; k++ ){
             if(data[i].users[k].email == req.body.email){
              const count = data[i].milestones.length;

              const detail = {
                id:count,
                title:req.body.title,
                start:req.body.start,
                end:req.body.end,
                flag:req.body.flag,
                user:req.body.user,
                tag:req.body.tag
              };



            project.updateOne({"title":req.body.project} , {$push:{milestones:detail}} , (err , docs)=>{
              if( err ){
                return res.json({"success":false,"msg":err})
              }

              return res.json({"success":true , "msg":"correct" , "time":detail.time,"id":count});
            })
          }
        }
      }
    }

    })
    .catch(err=>{
          return res.json({"success":false,"msg":err})
    })


})




//----------------------------------------------- retreive data for updation----------------------------//
app.post('/update_project' , function(req ,res){

  project.find().toArray()
  .then(data=>{
      const object = data[req.body.index];
       return res.json({
         "detail":object.overview,
         "name":object.title,
         "start":object.start,
         "end":object.end,
         "status":object.status,
         "group":object.group,
         "owner":object.owner,
       })
  })


})

app.post('/update_event' , function(req ,res){

  project.find().toArray()
  .then(data=>{

    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].title == req.body.project){
        for( let k=0 ; k<data[i].users.length ; k++ ){
          if(data[i].users[k].email == req.body.email){
              let a = [];
              a = data[i].events;

              for( let j=0 ; j<a.length ; j++ ){
                if( a[j].id == req.body.index ){
                  const object = a[j];
                  return res.json({
                    "title":object.title,
                    "start_time_single":object.start_time_single,
                    "start_single":object.start_single,
                    "end_time_single":object.end_time_single,
                    "from":object.from,
                    "to":object.to,
                    "start_time_multi":object.start_time_multi,
                    "end_time_multi":object.end_time_multi,
                    "overview":object.overview,
                    "duration":object.duration,
                    "begin":object.begin,
                    "end":object.end,
                    "location":object.location,
                    "repeat":object.repeat,
                    "user":object.user,
                    "single":object.single
                  })
                }
              }

            }
          }
        }


      }
 })
 .catch(err=>{
       return res.json({"success":false,"msg":err})
 })


})

app.post('/update_milestone' , function(req ,res){


    project.find().toArray()
    .then(data=>{

      for( let i=0 ; i<data.length ; i++ ){
        if( data[i].title == req.body.project){
          for( let k=0 ; k<data[i].users.length ; k++ ){
           if(data[i].users[k].email == req.body.email){
            let a = [];
            a = data[i].milestones;

            for( let j=0 ; j<a.length ; j++ ){
              if( a[j].id == req.body.index ){
                const object = a[j];

                 return res.json({
                   "title":object.title,
                   "start":object.start,
                   "end":object.end,
                   "tag":object.tag,
                   "flag":object.flag,
                   "user":object.user,
                 })
              }
            }
        }
      }
     }
    }
  })
  .catch(err=>{
        return res.json({"success":false,"msg":err})
  })
})

app.post('/update_bug' , function(req ,res){


  project.find().toArray()
  .then(data=>{

    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].title == req.body.project){
       for( let k=0 ; k<data[i].users.length ; k++ ){
        if(data[i].users[k].email == req.body.email){

          let a = [];
          a = data[i].bugs;

          for( let j=0 ; j<a.length ; j++ ){
            if( a[j].id == req.body.index ){
              const object = a[j];
              return res.json({
                "title": object.title,
                "assign_to" :object.assign_to,
                "add_follower" : object.add_follower,
                "date" : object.date,
                "severity" : object.severity ,
                "release" : object.release,
                "affect" : object.affect,
                "classify" : object.classify,
                "reproducible" : object.reproducible,
                "tag" : object.tag,
                "overview" : object.overview,
                "status" : object.status
              })
            }
          }
        }
      }
    }
  }

  })
  .catch(err=>{
        return res.json({"success":false,"msg":err})
  })
})



//------------------------------------------------update-------------------------------------------//
app.post('/updateproject' ,function(req , res){


  project.updateMany(
     { id: req.body.id },
     { $set:
        {
          title:req.body.title,
          owner:req.body.owner,
          start:req.body.start,
          end:req.body.end,
          overview:req.body.overview,
          group:req.body.group,
          status:req.body.status,
          time:moment().format(),
          id:req.body.id
        }
     }
  )
  return  res.json({"success":true});
})

app.post('/updateevent' ,function(req , res){


  project.find().toArray()
  .then(data=>{

    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].title == req.body.project){
       for( let k=0 ; k<data[i].users.length ; k++ ){
        if(data[i].users[k].email == req.body.email){
         let a = data[i].events;
         for( let j=0 ; j<a.length ; j++ ){
           if( a[j].id == req.body.id ){
             a[j].title=req.body.title,
             a[j].start_single=req.body.start_single,
             a[j].start_time_single=req.body.start_time_single,
             a[j].start_time_multi=req.body.start_time_multi,
             a[j].end_time_single=req.body.end_time_single,
             a[j].end_time_multi=req.body.end_time_multi,
             a[j].from=req.body.from,
             a[j].to=req.body.to,
             a[j].user=req.body.user,
             a[j].id=req.body.id,
             a[j].location=req.body.location,
             a[j].begin=req.body.begin,
             a[j].end=req.body.end,
             a[j].duration=req.body.duration,
             a[j].repeat=req.body.repeat,
             a[j].overview=req.body.overview,
             a[j].single=req.body.single

             project.findOneAndUpdate({"title":req.body.project} , {$set:{"events":a}} , (err , doc)=>{
               if( err ){
                return res.json({"success":false,"msg":err})
               }else{
                 return  res.json({"success":true});
               }
             })
             break;
           }
         }
         break;
      }
     }
    }
   }

  })
  .catch(err=>{
    return res.json({"success":false,"msg":err})
  })

})

app.post('/updatemilestone' ,function(req , res){


    project.find().toArray()
    .then(data=>{

      for( let i=0 ; i<data.length ; i++ ){
        if( data[i].title == req.body.project){
         for( let k=0 ; k<data[i].users.length ; k++ ){
          if(data[i].users[k].email == req.body.email){
           let a = data[i].milestones;
           for( let j=0 ; j<a.length ; j++ ){
             if( a[j].id == req.body.id ){
               a[j].title=req.body.title,
               a[j].start=req.body.start,
               a[j].end=req.body.end,
               a[j].user=req.body.user,
               a[j].id=req.body.id,
               a[j].tag=req.body.tag,
               a[j].flag=req.body.flag

               project.findOneAndUpdate({"title":req.body.project}, {$set:{"milestones":a}} , (err , doc)=>{
                 if( err ){
                  return res.json({"success":false,"msg":err})
                 }else{
                   return  res.json({"success":true});
                 }
               })


               break;
             }
           }
           break;
        }
       }
      }
     }
    })
    .catch(err=>{
      return res.json({"success":false,"msg":err})
    })

})

app.post('/updatebug', (req , res)=>{


      project.find().toArray()
      .then(data=>{

        for( let i=0 ; i<data.length ; i++ ){
          if( data[i].title == req.body.project){
           for( let k=0 ; k<data[i].users.length ; k++ ){
            if(data[i].users[k].email == req.body.email){
             let a = data[i].bugs;
             for( let j=0 ; j<a.length ; j++ ){
               if( a[j].id == req.body.id ){
                 a[j].title=req.body.title,
                 a[j].file=req.file,
                 a[j].assign_to=req.body.assign_to,
                 a[j].add_follower=req.body.add_follower,
                 a[j].date=req.body.date,
                 a[j].severity=req.body.severity,
                 a[j].overview=req.body.overview,
                 a[j].tag=req.body.tag,
                 a[j].reproducible=req.body.reproducible,
                 a[j].classify=req.body.classify,
                 a[j].release=req.body.release,
                 a[j].affect=req.body.affect,
                 a[j].time=moment().format(),
                 a[j].status=req.body.status,
                 a[j].id=req.body.id


                 project.findOneAndUpdate({"title":req.body.project}, {$set:{"bugs":a}} , (err , doc)=>{
                   if( err ){
                      return res.json({"success":false,"msg":err})
                   }else{
                     return  res.json({"success":true});
                   }
                 })


                 break;
               }
             }
             break;
           }
          }
         }
        }

      })
      .catch(err=>{
            return res.json({"success":false,"msg":err})
      })




})



//-------------------------------------------------delete---------------------------------------------//
app.post('/remove_project' , function(req , res){


    project.find().toArray()
    .then(content=>{
        let project = content[req.body.index].title;
        for( let i=req.body.index+1 ; i<content.length ; i++ ){
          project.updateMany(
             { id: i },
             { $set:
                {
                  id:i-1
                }
             }
          )

        }
        tag.deleteMany({project:project});
    })

   project.deleteOne({id:req.body.index});

   return  res.json({"success":true});

})

app.post('/remove_bug' , function(req , res){



        project.find().toArray()
        .then(data=>{

          for( let i=0 ; i<data.length ; i++ ){
            if( data[i].title == req.body.project){
             for( let k=0 ; k<data[i].users.length ; k++ ){
              if(data[i].users[k].email == req.body.email){
               let a = data[i].bugs;
               for( let j=req.body.id+1 ; j<a.length ; j++ ){
                  a[j].id--;
               }

               a.splice(req.body.id, 1);
               tag.deleteMany({which:"bug_form",project:req.body.project,email:req.body.email});
               project.findOneAndUpdate({"title":req.body.project}, {$set:{"bugs":a}} , (err , doc)=>{
                 if( err ){
                  return res.json({"success":false,"msg":err});
                 }else{
                   return  res.json({"success":true});
                 }
               })
               break;
            }
          }
        }
      }

    })
    .catch(err=>{
      return res.json({"success":false,"msg":err});
    })



})

app.post('/remove_event' , function(req , res){

  project.find().toArray()
  .then(data=>{

    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].title == req.body.project){
       for( let k=0 ; k<data[i].users.length ; k++ ){
        if(data[i].users[k].email == req.body.email){
         let a = data[i].events;
         for( let j=req.body.id+1 ; j<a.length ; j++ ){
            a[j].id--;
         }
         a.splice(req.body.id, 1);
           tag.deleteMany({which:"event_form",project:req.body.project,email:req.body.email});
         project.findOneAndUpdate({"title":req.body.project} , {$set:{"events":a}} , (err , doc)=>{
           if( err ){
            return res.json({"success":false,"msg":err})
           }else{
             return  res.json({"success":true});
           }
         })
         break;
       }
      }
     }
    }

  })
  .catch(err=>{
        return res.json({"success":false,"msg":err})
  })





})

app.post('/remove_milestone' , function(req , res){

  project.find().toArray()
  .then(data=>{

    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].title == req.body.project){
       for( let k=0 ; k<data[i].users.length ; k++ ){
        if(data[i].users[k].email == req.body.email){
         let a = data[i].milestones;
         for( let j=req.body.id+1 ; j<a.length ; j++ ){
            a[j].id--;
         }
         a.splice(req.body.id, 1);
         tag.deleteMany({which:"milestone_form",project:req.body.project,email:req.body.email});

         project.findOneAndUpdate({"title":req.body.project} , {$set:{"milestones":a}} , (err , doc)=>{
           if( err ){
                 return res.json({"success":false,"msg":err})
           }else{
             return  res.json({"success":true});
           }
         })
         break;
       }
      }
     }
    }
  })
  .catch(err=>{
    return res.json({"success":false,"msg":err})
  })


})

//-------------------------------------------------complete--------------------------------------------//
app.post('/complete_project' , function(req , res){


    project.find().toArray()
    .then(content=>{
        let project = content[req.body.index].title;
        for( let i=req.body.index+1 ; i<content.length ; i++ ){
          project.updateMany(
             { id: i },
             { $set:
                {
                  id:i-1
                }
             }
          )

        }
        tag.deleteMany({project:project});
    })

   project.deleteOne({id:req.body.index});
   return  res.json({"success":true});

})

app.post('/complete_bug' , function(req , res){


        project.find().toArray()
        .then(data=>{

          for( let i=0 ; i<data.length ; i++ ){
            if( data[i].title == req.body.project){
             for( let k=0 ; k<data[i].users.length ; k++ ){
              if(data[i].users[k].email == req.body.email){
               let a = data[i].bugs;
               for( let j=req.body.id+1 ; j<a.length ; j++ ){
                  a[j].id--;
               }

               let cbug = {
                 bug:a[req.body.id],
                 email:req.body.email,
               }




               project.updateOne( {"title":req.body.project} , {$push:{cbugs:cbug}} , (err , docs)=>{
                 if( err ){
                      return res.json({"success":false,"msg":err})
                 }
               })


               a.splice(req.body.id, 1);
              tag.deleteMany({which:"bug_form",project:req.body.project,email:req.body.email});
               project.findOneAndUpdate({"title":req.body.project}, {$set:{"bugs":a}} , (err , doc)=>{
                 if( err ){
                return res.json({"success":false,"msg":err})
                 }else{
                   return  res.json({"success":true});
                 }
               })
               break;
            }
          }
        }
      }

    })
    .catch(err=>{
          return res.json({"success":false,"msg":err})
    })



})

app.post('/complete_event' , function(req , res){

  project.find().toArray()
  .then(data=>{

    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].title == req.body.project){
       for( let k=0 ; k<data[i].users.length ; k++ ){
        if(data[i].users[k].email == req.body.email){
         let a = data[i].events;
         for( let j=req.body.id+1 ; j<a.length ; j++ ){
            a[j].id--;
         }
         a.splice(req.body.id, 1);

         let cevent = {
           event:a[req.body.id],
           email:req.body.email
         }

         project.updateOne( {"title":req.body.project} , {$push:{cevents:cevent}} , (err , docs)=>{
           if( err ){
            return res.json({"success":false,"msg":err})
           }
         })

         tag.deleteMany({which:"event_form",project:req.body.project,email:req.body.email});

         project.findOneAndUpdate({"title":req.body.project} , {$set:{"events":a}} , (err , doc)=>{
           if( err ){
                return res.json({"success":false,"msg":err})
           }else{
             return  res.json({"success":true});
           }
         })
         break;
       }
      }
     }
    }

  })
  .catch(err=>{
    return res.json({"success":false,"msg":err})
  })




})

app.post('/complete_milestone' , function(req , res){

  project.find().toArray()
  .then(data=>{

    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].title == req.body.project){
       for( let k=0 ; k<data[i].users.length ; k++ ){
        if(data[i].users[k].email == req.body.email){
         let a = data[i].milestones;
         for( let j=req.body.id+1 ; j<a.length ; j++ ){
            a[j].id--;
         }
         a.splice(req.body.id, 1);

         let cmilestone = {
           milestone:a[req.body.id],
           email:req.body.email
         }

         project.updateOne( {"title":req.body.project} , {$push:{cmilestones:cmilestone}} , (err , docs)=>{
           if( err ){
             return res.json({"success":false , "msg":err});
           }
         })


         tag.deleteMany({which:"milestone_form",project:req.body.project,email:req.body.email});

         project.findOneAndUpdate({"title":req.body.project} , {$set:{"milestones":a}} , (err , doc)=>{
           if( err ){
                 return res.json({"success":false,"msg":err})
           }else{
             return  res.json({"success":true});
           }
         })
         break;
       }
      }
     }
    }
  })
  .catch(err=>{
    return res.json({"success":false,"msg":err})
  })




})


//-----------------------------------------------tags for calender--------------------------------------//
app.post("/tag" , function(req , res){

   if( req.body.which === "event_form" ){
     project.find().toArray()
     .then(data=>{

       for( let i=0 ; i<data.length ; i++ ){
        if( data[i].title == req.body.project){
          for( let k=0 ; k<data[i].users.length ; k++ ){
            if(data[i].users[k].email == req.body.email){
             const result = data[i].events.length;

              const detail = {
                which:req.body.which,
                year:req.body.year,
                month:req.body.month,
                day:req.body.day,
                id:result,
                title:req.body.title,
                date:req.body.date,
                email:req.body.email,
                project:req.body.project
              }

              tag.insertOne(detail , (err , docs)=>{
                if( err ){
                  console.log(error);
                  return res.json({"success":"false" , "msg":"Something get wrong"});
                }
                return res.json({"success":"true" , "msg":"correct" , "id":result});
              })
             }
            }
           }
          }
        })
  }else if( req.body.which === "bug_form" ){

project.find().toArray()
.then(data=>{

  for( let i=0 ; i<data.length ; i++ ){
   if( data[i].title == req.body.project){
     for( let k=0 ; k<data[i].users.length ; k++ ){
       if(data[i].users[k].email == req.body.email){
        const result = data[i].bugs.length;

         const detail = {
           which:req.body.which,
           year:req.body.year,
           month:req.body.month,
           day:req.body.day,
           id:result,
           title:req.body.title,
           date:req.body.date,
           email:req.body.email,
           project:req.body.project
         }

         tag.insertOne(detail , (err , docs)=>{
           if( err ){
             console.log(error);
             return res.json({"success":"false" , "msg":"Something get wrong"});
           }
           return res.json({"success":"true" , "msg":"correct" , "id":result});
         })
        }
       }
      }
     }
    })
  }else if( req.body.which === "milestone_form" ){
    project.find().toArray()
    .then(data=>{

      for( let i=0 ; i<data.length ; i++ ){
       if( data[i].title == req.body.project){
         for( let k=0 ; k<data[i].users.length ; k++ ){
           if(data[i].users[k].email == req.body.email){
            const result = data[i].milestones.length;

             const detail = {
               which:req.body.which,
               year:req.body.year,
               month:req.body.month,
               day:req.body.day,
               id:result,
               title:req.body.title,
               date:req.body.date,
               email:req.body.email,
               project:req.body.project
             }

             tag.insertOne(detail , (err , docs)=>{
               if( err ){
                 console.log(error);
                 return res.json({"success":"false" , "msg":"Something get wrong"});
               }
               return res.json({"success":"true" , "msg":"correct" , "id":result});
             })
            }
           }
          }
         }
        })
  }

})

app.post("/give_tag" , function(req ,res){

    let year = req.body.year;
    let month = req.body.month;
    let d1 = new Date();

    tag.find().toArray()
    .then( x=>{

     const a = x.filter(y=>{
      if( y.email == req.body.email && req.body.project == "" ){
       if( y.which == "event_form" ){

          let m_ = new Date(Date.parse(y.month +" 1, 2012")).getMonth()+1
          m_=m_.toString();

          let c = y.year+"-"+m_+"-"+y.date;
          let d2 = new Date(c);

          if( d1 <= d2 && y.year == year && y.month == month ){
             return y;
          }
       }else{
         if( y.year == year && y.month == month ){
          return y;
         }
       }
      }

      if( y.email == req.body.email && req.body.project == y.project && req.body.project !="" ){
       if( y.which == "event_form" ){

          let m_ = new Date(Date.parse(y.month +" 1, 2012")).getMonth()+1
          m_=m_.toString();

          let c = y.year+"-"+m_+"-"+y.date;
          let d2 = new Date(c);

          if( d1 <= d2 && y.year == year && y.month == month ){
             return y;
          }
       }else{
         if( y.year == year && y.month == month ){
          return y;
         }
       }
      }

     })

     return res.json({"arr":a});
    })

})

app.post("/remove_tag" , function(req ,res){
   tag.deleteOne({project:req.body.project,email:req.body.email,which:req.body.which});
   return res.json({"success":true});
})




//----------------------------------------------------graph-----------------------------------------------//
app.post('/detail_info' , function(req , res){

  project.find().toArray()
  .then(data=>{
    for( let j=0 ; j<data.length ; j++ ){
      if( data[j].title == req.body.project){
       for( let k=0 ; k<data[j].users.length ; k++ ){
        if(data[j].users[k].email == req.body.email){

          let bug = [];
          bug = data[j].bugs;
          let cbug = [];
          cbug = data[j].cbugs;

          let milestone = [];
          milestone = data[j].milestones;

          return res.json({"bug":bug,"milestone":milestone,"cbug":cbug});

       }
      }
     }
    }

  })
  .catch(err=>{
    return res.json({"success":false,"msg":err})
  })

})

app.post('/project_detail' , function(req , res){

  project.find().toArray()
  .then(data=>{
      return res.json({"success":true,"project":data})
  })
  .catch(err=>{
    return res.json({"success":false,"msg":err})
  })

})

app.post('/milestone_detail', function(req , res){

  project.find().toArray()
  .then(data=>{
    for( let j=0 ; j<data.length ; j++ ){
      if( data[j].title == req.body.project){
       for( let k=0 ; k<data[j].users.length ; k++ ){
        if(data[j].users[k].email == req.body.email){

          let milestone = [];
          milestone = data[j].milestones;

          return res.json({"milestone":milestone});

       }
      }
     }
    }

  })
  .catch(err=>{
    return res.json({"success":false,"msg":err})
  })

})



//----------------------------------------------------position--------------------------------------------//
app.post('/position' , function(req , res){

  project.find().toArray()
  .then( data=>{

    for( let i=0 ; i<data.length ; i++ ){
      for( let k=0 ; k<data[i].users.length ; k++ ){
        if( data[i].title == req.body.project && data[i].users[k].email == req.body.email ){
          return res.json({"success":true , "post":data[i].users[k].post});
        }
      }
    }


  })

})


//----------------------------------------------------user------------------------------------------------//
app.post('/user' , function(req , res){

   project.find().toArray()
   .then(data=>{

    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].title == req.body.project ){

        for( let j=0 ; j<data[i].users.length ; j++ ){
          if( data[i].users[j].email == req.body.email ){
            return res.json({"success":false,"msg":"Already A Collaborator !"})
          }
        }

        let a = [];
        a = data[i].users;

        a.push({post:req.body.post,email:req.body.email});


        project.findOneAndUpdate({"title":req.body.project}, {$set:{"users":a}} , (err , doc)=>{
          if( err ){
            return res.json({"success":false,"msg":err})
          }else{


          admin.findOne({"email":req.body.email})
          .then(data=>{
            if( data ){

            var object = {
              title:"Invitation",
              overview:`You role is of ${req.body.post} in this project`,
              project:req.body.project,
              email:req.body.email,
              from:req.body.from
            }

            notify.insertOne(object , function(err , docs){
              if( err ){
                return res.json({"success":false,"msg":"Something Went Wrong"})
              }

              return res.json({"success":true})
            })

           }else{
            let transport = nodemailer.createTransport({
               host:'smtp.aol.com',
               secure:false,
               path:587,
               auth:{
                   service:'aol',
                   user: 'gouravsingal1234',
                   pass: 'wzqedsmgrjhedltc'
               },
               tls:{
                   rejectUnauthorized:false
               }
           })

           let HelperOptions = {
               from:'" GOURAV SINGAL" <gouravsingal1234@aol.com>',
               to:req.body.email,
               subject:'Login Link',
               html: `<p><a href="http://localhost:8000/login?email=${req.body.email}">this is the link</a></p>`
           };

           transport.sendMail( HelperOptions , (err , info) =>{
               if( err ){
                 return res.json({"success":false,"msg":"Unable to Send !"});
               }
               else{
                  return  res.json({"success":true});
               }
             })
          }

          })

         }
        })
       }
      }
    })

})

app.post('/user_detail' , function(req , res){

  project.find().toArray()
  .then(data=>{

    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].title == req.body.project ){
        return res.json({"success":true,detail:data[i].users});
      }
    }

  })
  .catch(err=>{
      return res.json({"success":false,"msg":err})
  })



})

app.post('/user_delete' , function(req ,res){

  project.find().toArray()
  .then(data=>{
    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].title == req.body.project ){
        for( let j=0 ; j<data[i].users.length; j++ ){
          if( data[i].users[j].email == req.body.email ){
            let a = data[i].users;
            a.splice(j, 1);
            project.findOneAndUpdate({"title":req.body.project}, {$set:{"users":a}} , (err , doc)=>{
              if( err ){
                return res.json({"success":false,"msg":"err"})
              }
              return  res.json({"success":true});
            })

            break;
          }
        }
        break;
      }
    }
  })
  .catch(err=>{
        return res.json({"success":false,"msg":err})
  })

})


//---------------------------------------------------admin_page--------------------------------------------//
app.post('/data' , function(req , res){

let a = {
  bug:[],
  cbug:[],
  event:[],
  cevent:[],
  milestone:[],
  cmilestone:[],
  project:[],
}

  project.find().toArray()
  .then(data=>{

     for( let i=0 ; i<data.length ; i++ ){
       for( let j=0 ; j<data[i].users.length ; j++ ){
         if( data[i].users[j].email == req.body.email ){
           a.bug.push(data[i].bugs.length);
           a.cbug.push(data[i].cbugs.length);
           a.event.push(data[i].events.length);
           a.cevent.push(data[i].cevents.length);
           a.milestone.push(data[i].milestones.length);
           a.cmilestone.push(data[i].cmilestones.length);
           a.project.push(data[i].title);
           break;
         }
       }
     }

    return res.json({"success":true,detail:a});

  })
  .catch(err=>{
    return res.json({"success":false,"msg":"Something Went Wrong"})
  })

})


//--------------------------------------------------notfication----------------------------------------------//
app.post('/chat' , function(req , res){
    if( req.body.title == "" || req.body.title == null ){
      return res.json({"success":false,"msg":"Title is Mandatory"})
    }

    if( req.body.overview == "" || req.body.overview == null ){
      return res.json({"success":false,"msg":"Overview is Mandatory"})
    }

    if( req.body.project == "" || req.body.project == null ){
      return res.json({"success":false,"msg":"Project Name is Mandatory"})
    }

    if( req.body.email == "" || req.body.email == null ){
      return res.json({"success":false,"msg":"No User is Selected"})
    }

    if( req.body.overview.length > 200 ){
      return res.json({"success":false,"msg":"Word limit reached"});
    }

    let object = {
      title:req.body.title,
      overview:req.body.overview,
      project:req.body.project,
      email:req.body.email,
      from:req.body.from_
    }

    notify.insertOne(object , function(err , docs){
      if( err ){
        return res.json({"success":false,"msg":"Something Went Wrong"})
      }
        return res.json({"success":true,"msg":"Successfully Sent"})
    })
})

app.post('/setnotify' ,  function(req , res){

   admin.findOneAndUpdate({"email":req.body.email} , {$set:{"notify":req.body.no}} , (err , doc)=>{
    if( err ){
    return res.json({"success":false,"msg":err})
    }else{
     return  res.json({"success":true});
    }
   })

})

app.post('/newnotify' , function(req , res){

  notify.find().toArray()
  .then(data=>{
    let new_ = 0;
    for( let i=0 ; i<data.length ; i++ ){
      if( data[i].email == req.body.email){
      new_++;
      }
    }
    new_-=parseInt(req.body.no,10);
    return res.json({"success":true,"length":new_});
  })
  .catch(err=>{
    return res.json({"success":false,"msg":"Something Went Wrong"});
  })

})

app.post('/notify' , function(req , res){
    admin.find().toArray()
    .then(data=>{
      for( let i=0 ; i<data.length ; i++ ){
        if( data[i].email == req.body.email ){
          return res.json({"success":true,"no":data[i].notify});
        }
      }
    })
    .catch(err=>{
        return res.json({"success":true,"msg":err});
    })
})

app.post('/all_news' , function(req , res){
  notify.find().toArray()
  .then(data=>{
    let new_ = [];
    let old_ = [];
    let a = parseInt(req.body.new,10);
    for( let i=data.length-1 ; i>=0 ; i-- ){
      if( data[i].email == req.body.email && a > 0 ){
        new_.push(data[i]);
        a--;
      }else if(  data[i].email == req.body.email && a== 0  ){
        old_.push(data[i]);
      }
    }
    return res.json({"success":true,"new":new_,"old":old_});
  })
  .catch(err=>{
    return res.json({"success":false,"msg":"Something Went Wrong"});
  })
})

app.post('/delete_notify' , function(req , res){
    notify.deleteOne({title:req.body.title,project:req.body.project,from:req.body.from,email:req.body.email,overview:req.body.overview});
    return res.json({"success":true});
})


app.listen( port , console.log(`listening to the port ${port}`));
