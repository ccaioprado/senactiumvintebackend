create database ti0120db;

use ti0120db;

create table tbcliente(
idcliente bigint auto_increment primary key,
nomecliente varchar (100) not null,
email varchar(100)  not null unique,
telefone varchar(20) not null,
usuario varchar(30) not null unique,
senha varchar (200) not null
) engine InnoDB character set ="utf8mb4";

insert into tbcliente set nomecliente="Pedro", email="pedro@terra.com.br", telefone="11999998888", usuario="pedro", senha="123";

select * from tbcliente;
