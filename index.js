const mysql = require('mysql');
const express = require('express');
const router = express.Router();
var cors = require('cors');

const multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../echri/src/assets/images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
  })

  var upload = multer({ storage: storage })


const app = express();
app.use(cors());

const cnx = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "echri"
});

cnx.connect((err)=>{
  if(err){
      return console.log(err);
  }
  return console.log("Mysql Connected...");
});



app.get('/Api/users',(req, res) =>{

  try {
    cnx.query('select * from user', (err, result, fields)=>{
      res.send(result);
    });      
  } catch (error) {
    res.send(error);
  }

  res.end; 
    
});

app.get('/Api/commande',(req, res) =>{

  try {
    cnx.query('select * from commande', (err, result, fields)=>{
  
      res.send(result);
  
    });
  } catch (error) {
    res.send(error);  
  } 
  
  res.end; 
    
});


app.get('/Api/cmd/:id_user',(req, res) =>{

  var id_user = req.params.id_user;
  
  var sql = 'select * from commande where id_user = ?';

  try {
    cnx.query(sql, id_user, (err, result, fields)=>{
  
      res.send(result);
  
    });
  } catch (error) {
    res.send(error);  
  } 
  
  res.end; 
    
});

app.post('/Api/cmd/:id/:etat',(req, res) =>{

  var id = req.params.id;
  var etat = req.params.etat;
  
  var sql = 'update commande set etat = ? where id_order = ?';
  try {
    cnx.query(sql, [etat, id], function (err, result) {
      res.send(result);
    });  
  } catch (error) {
    res.send(error)
  }
    res.end;

});

app.post('/Api/add/cmd/:user/:nom_p/:prix/:quant/:img_dir/:id_u/:id_p/:id',(req, res) =>{

  var id = req.params.id;
  var nom_p = req.params.nom_p;
  var id_p = req.params.id_p;
  var quant = req.params.quant;
  var prix = req.params.prix;
  var user = req.params.user;
  var id_u = req.params.id_u;
  var img_dir = "assets/images/" + req.params.img_dir;
  var pay = "paid";
  var etat = "en attente";
  
  
  var values = [user, nom_p, prix, quant, pay, etat, img_dir, id_u, id_p];  
    
  var sql2 = 'INSERT INTO commande(client, nom_prod, total, quantite, payment_status, etat, img_dir, id_user, id_prod) VALUES (?)';
  cnx.query(sql2, [values], function (err, result) {
    
    var val =[id,id_p,quant];
    
    var sql = 'INSERT INTO ligne_cmd() VALUES(?)';
    cnx.query(sql,[val], function(err, resultat){});
    
    res.send(result);
  });

  res.end;

});


app.get('/Api/produit',(req, res) =>{


  try {
    cnx.query('select * from produit', (err, result, fields)=>{        
      res.send(result);
    });  
  } catch (error) {
    res.send(error);
  }

  res.end; 
    
});



app.post('/Api/update/produit/:nom/:ref/:disc/:quant/:prix/:img_dir',(req, res) =>{

  var nom = req.params.nom;
  var ref = req.params.ref;
  var disc = req.params.disc;
  var quant = req.params.quant;
  var prix = req.params.prix;
  var dir = "assets/images/" + req.params.img_dir;
  
  var sql = 'update produit set nom = ?, disc = ?, quant= ?, prix= ?, img_dir= ? where ref = ?';
  
  try {
    cnx.query(sql, [nom, disc, quant, prix, dir, ref], function (err, result) {
      
    });  
  } catch (error) {
    res.send(error);
  }
    res.end;

});

app.post('/Api/update/produit/:nom/:ref/:disc/:quant/:prix',(req, res) =>{

  var nom = req.params.nom;
  var ref = req.params.ref;
  var disc = req.params.disc;
  var quant = req.params.quant;
  var prix = req.params.prix;

  var sql = 'update produit set nom = ?, disc = ?, quant= ?, prix= ? where ref = ?';

  try {
    cnx.query(sql, [nom, disc, quant, prix, ref], function (err, result) {
    
    });  
  } catch (error) {
    res.send(error)
  }
    res.end;

});

app.post('/Api/new/user/:nom/:email/:psw',(req, res) =>{

  var nom = req.params.nom;
  var email = req.params.email;
  var psw = req.params.psw;
  var values = [nom, email, psw];

  var sql = 'INSERT INTO user (name, email, psw) VALUES (?)';
  try {
    cnx.query(sql, [values], function (err, result) {
      res.send(result);
    }); 
  } catch (error) {
    res.send(error);
  }
  
  res.end;

});

app.post('/Api/new/produit/:nom/:ref/:disc/:quant/:prix/:img_dir',(req, res) =>{

  var nom = req.params.nom;
  var ref = req.params.ref;
  var disc = req.params.disc;
  var quant = req.params.quant;
  var prix = req.params.prix;
  var dir = "assets/images/" + req.params.img_dir;
  var values = [nom, ref, disc, quant, prix, dir];

  var sql = 'INSERT INTO produit (nom, ref, disc, quant, prix, img_dir) VALUES (?)';
  cnx.query(sql, [values], function (err, result) {
    res.send(result);
  });  
    res.end;

});



app.post('/Api/upload', upload.single('image'), function (req, res) {
  res.end;
});


app.delete('/Api/delete/produit/:id',(req, res) =>{

  var id = req.params.id;
  var sql = 'delete from produit where id = ?';

  try {
    cnx.query(sql, id, function (err, result) {
     res.send(result);
    });  
  } catch (error) {
    res.send(error);
  }
  

});


app.listen(3000, (req, res) =>{
  console.log("Express API is running at post 3000");
});


module.exports = router;