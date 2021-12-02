// importação do modulo express para gerenciar o servidor da aplicação node 
const express = require("express");
//importação do modulo cors para nos ajudar no trato com protocolos de requisição diferentes, tais como http, https, file, ftp
const cors = require("cors");
//importação do modulo do mysql
const mysql = require("mysql");
//importação do modulo do jsonwebtoken para nos ajudar a trabalhar com a secção segura
const jwt = require("jsonwebtoken");
//para criptografar as senhas será utilizado o bcrypt; vamos importar o modulo 
const bcrypt = require("bcrypt");

//Criando uma instancia do servidor para carrega-lo. Faremos isso usando a constante app 
const app = express();

//Configurar o servidor express para aceitar dados em formato json.
app.use(express.json());

//Configurar o servidor para lidar com as requisições de varias origens. Para isso iremos utilizar o cors
app.use(cors());


//Configuração do banco de dados 
const con = mysql.createConnection({
    host:"localhost",
    user:"Caio",
    password:"senac@123",
    database:"ti0120db",
    port:"3306",
})
// executar a conexão com o banco de dados
con.connect((erro)=>{
    if(erro){
        console.error(`Erro ao tentar carregar o servidor de banco de dados ->${erro}`);
    }
    console.log("Servidor de banco de dados conectado =>${con.threadId}")
});

// Vamos criar as rotas com os endpoints para realizar o gerenciamento dos dados dos clientes
app.get("/api/cliente/listar",(req,res)=>{
    // vamos consultar os clientes cadastrados e retornar os dados
    const result = con.query("Select * from tbcliente",(erro,result)=>{
        if(erro){
            return res.status(400).send({output:`Erro ao tentar carregar os dados ->${erro}`});
        }
        res.status(200).send({output:result});
    });
});

app.get("/api/cliente/listar/:id",(req,res)=>{
    con.query("Select * from tbcliente where idcliente=?",[req.params.id],(erro,result)=>{
        if(erro){
            return res.status(400).send({output:`Erro ao tentar localizar o cliente ->${erro}`});
        }
        res.status(200).send({output:result});
    });
});

app.post("/api/cliente/cadastro",(req,res)=>{


    bcrypt.hash(req.body.senha,10,(erro,result)=>{
        if(erro){
            return res.status(503).send({output:`Erro interno ao gerar a senha ->${erro}`});
        }
        req.body.senha = result;
        
        
        con.query("insert into tbcliente set ?", [req.body],(erro,result)=>{
            if(erro){
                return res.status(400).send({output:`Erro ao tentar cadastrar cliente -> ${erro}`});
            }
            res.status(201).send({output:`Cadastro Finalizado`,payload:result});
        });
    });
});

app.post("/api/cliente/login",(req,res)=>{
    const us = req.body.usuario;
    const sh = req.body.senha;






    con.query("Select * from tbcliente where usuario=?",[us],(erro,result)=>{
        if(erro){
            return res.status(400).send({output:`Erro ao tentar logar ->${erro}`});
        }
        if(!result){
            return res.status(404).send({output:"Usuario não localizado"});
        }
    
        bcrypt.compare(sh,result[0].senha,(erro,igual)=>{
            if(erro){
                return res.status(503).send({output:`Erro interno ->${erro}`});
            }
            if(!igual){
                return res.status(400).send({output:`Senha incorreta`});
            }
            res.status(200).send({output:`Logado`,payload:result});
        })



    });
});

app.put("/api/cliente/atualizar/:id",(req,res)=>{
    con.query("Update tbcliente set ? where idcliente=?",[req.body,req.params.id],(erro,result)=>{
        if(erro){
            return res.status(400).send({output:`Erro ao tentar atualizar -> ${erro}`});
        }
        res.status(200).send({output:`Dados atualizados`,payload:result});
    });
});

app.delete("/api/cliente/apagar/:id",(req,res)=>{
    con.query("Delete from tbcliente where idcliente=?",[req.params.id],(erro,result)=>{
        if(erro){
            return res.status(400).send({output:`Erro ao tentar apagar ->${erro}`})
        }
        res.status(204).send({});
    });
});

app.listen(3000,()=>console.log(`Servidor online em http://localhost:3000`))






