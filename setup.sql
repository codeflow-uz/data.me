CREATE DATABASE datame;

\c datame;

CREATE TABLE shaxs (
    id bigserial not null, 
    f_name varchar(64) not null,
    l_name varchar(64) not null,
    m_name varchar(64) not null,
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
    u_id varchar(64) not null,
    primary key(id)
);

CREATE TABLE company_file (
    id bigserial not null,
    filename varchar(128) not null,
    filesrc varchar(128) not null,
    u_id varchar(64) not null,
    primary key(id)
);
