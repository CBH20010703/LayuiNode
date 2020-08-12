var mysql  = require('mysql');  
var expree=require("express")
var app=expree();
var fs=require("fs")
const path = require('path');
var cookie=require("cookie")
const session=require("express-session")
app.use(session({
  secret:"5645dsadashkfhds45sdfds5fsdf%sjkfhasf",
  resave:true,
  cookie:{maxAge: 600000},
  saveUninitialized:false
}))
var sever=app.listen("8081",()=>{
  console.log('服务器启动成功')
})
app.use(expree.static(path.join(__dirname, 'public')));

var connection = mysql.createConnection({     
  host     : '127.0.0.1',       
  user     : 'root',              
  password : '20010703',       
  port: '3306',    
  database:"stuData"               
}); 
 connection.connect((err)=>{
     if(err) throw err;
     console.log('连接成功')
 })

 //查询
//  var  sql = ' insert into userData(username,email,sex,city,sign,experience,ip,logins,jointime) values("岑+豪","47790293@qq.com","1","000","000","000","000","000","000")';
//  //插入
//  connection.query(sql,function (err, result) {
//     if(err){
//       console.log('[SELECT ERROR] - ',err.message);
//       return;
//     }

//    console.log('--------------------------SELECT----------------------------');
//    console.log(JSON.stringify(result));
   
//    console.log(result.length);
//    console.log('------------------------------------------------------------\n\n');  
// });
app.get("/",(req,res)=>{
  if(req.session.logged_in){
    fs.readFile("./static/index.html","utf-8",(err,data)=>{
      if(err){
        console.log(err)
        return 
      }
      res.send(data)
    })
  }else{
    fs.readFile("./static/logoin.html","utf8",(err,data)=>{
      if(err==null){
        console.log(err)
      }
      res.send(data)
    })
  }
})

app.get("/logo",(req,res)=>{
  fs.readFile("./static/logoin.html","utf8",(err,data)=>{
    if(err==null){
      console.log(err)
    }
    res.send(data)
  })
})
app.get("/name",(req,res)=>{
  console.log(req.session.userName)
  res.send(req.session.userName)
})
app.post("/logoin",(req,res)=>{ 
  var a="";
  req.on("data",function(d){
    a+=d;
  })
  req.on("end",()=>{
    console.log()
    var C=JSON.parse(a);
    if(C.userName=="20010703"&&C.nuse=="123456"){
      req.session.userName = C.userName;
     
      req.session.logged_in=true;
      res.send("0");
      return
    }else{
      res.send("1")  
    }
  })
})
app.get("/getData",(req,res)=>{
 var a=req.query.page;
 var b=req.query.limit;
 var c =(a-1)*b;
  var Selsql='SELECT * FROM userData  limit '+c+','+b+'';
  console.log(Selsql)
  connection.query(Selsql,function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - ',err.message);
      return;
    }
      var e='select count(*) from userData'
      connection.query(e,function(err,con){
        if(err){
          console.log(err);
          return
        }
        let onct=con[0]['count(*)']
        res.json({
          code:0,
          status: 200
          ,message:""
          ,total:onct
          ,rows:{
            item:result
          },
        })    
}) 
  });
})
app.get("/updata",(req,res)=>{
  console.log(req.query)
  var userupData = 'UPDATE userData SET '+req.query.event+' = ? WHERE id = ?'
  var userModSql_Params = [req.query.value,req.query.data]
  console.log(userupData)
  connection.query(userupData,userModSql_Params,function (err, result) {
    if(err){
          console.log('[UPDATE ERROR] - ',err.message);
          res.send("1")
          return;
    };
    res.send("0")
    console.log('UPDATE affectedRows',result.affectedRows);
 });
})
app.get("/deldetList",(req,res)=>{
  console.log(req.query)
  var list=[]
  list=req.query.arrs;
  console.log(list)
  for (var i = 0; i < list.length; i++) {
    var userDelSql = 'DELETE FROM userData WHERE id ='+list[i];
    console.log(userDelSql)
    connection.query(userDelSql,function(err,result){
      if(err){
        console.log('[DELETE ERROR] - ',err.message);
        return
      }     
    })
  }
   res.send("0") 
})
app.get("/delete",(req,res)=>{
  console.log(req.query)
  var  userDelSql = 'DELETE FROM userData WHERE id ='+req.query.id;
  connection.query(userDelSql,function (err, result) {
    if(err){
      console.log('[DELETE ERROR] - ',err.message);
      return;
    }       
    res.send("0")
   console.log('DELETE affectedRows',result.affectedRows);
});
})


app.post("/Search",(req,res)=>{
  let data=''
  req.on("data",(d)=>{
    data+=d;
  })
  req.on("end",()=>{
    var c=JSON.parse(data);

    var Selsql="SELECT * from userData where email like '%"+c.serviceCode+"%' limit "+(c.page-1)*c.limit+","+c.limit  
    // let p=['%'+'%',]
    console.log(Selsql)
    // let d=sql+p
    // console.log(d)
    connection.query(Selsql,function (err, result) {
      if(err){
        console.log('[DELETE ERROR] - ',err.message);
        return;
      }       
      var e='select count(*) from userData'
      connection.query(e,function(err,con){
        let onct=con[0]['count(*)']
      res.json({
          code:0,
          status:200
          ,message: ""
          ,total:onct
          ,rows:{
            item:result
          },
        })
      })
  
  });
  })
 
  
})