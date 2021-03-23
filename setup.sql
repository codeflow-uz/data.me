CREATE DATABASE datame;

\c datame;

CREATE TABLE shaxs (
    id bigserial not null, 
    fullname varchar(128) not null,
    birthday varchar(24) not null,
    passport varchar(24) not null,
    nationality varchar(36) not null,
    primary key(id)
);

CREATE TABLE companies (
    id bigserial not null,
    name varchar(128) not null,
    date varchar(24) not null,
    about varchar(36) not null,
    county varchar(36) not null,
    primary key(id)
);

CREATE TABLE user_file (
    id bigserial not null,
    filename varchar(128) not null,
    filesrc varchar(128) not null,
    primary key(id)
);

CREATE TABLE company_file (
    id bigserial not null,
    filename varchar(128) not null,
    filesrc varchar(128) not null,
    primary key(id)
);
