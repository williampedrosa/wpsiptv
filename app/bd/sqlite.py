# -*- coding: utf-8 -*-
import sqlite3
import pyodbc
import json
import os

class ConnSqlite():

    conn = None
    cursor = None

    def __init__(self):
        self.conn = None
        self.cursor = None
        self.Operadores()

    def Operadores(self):
        conn = None
        cursor = None
        dataBase = 'bd/DataBase.db'
        if os.path.isfile(r''+dataBase):
            conn = sqlite3.connect(dataBase)
            cursor = conn.cursor() 
        else:
            conn = sqlite3.connect(dataBase)
            cursor = conn.cursor()

            # TIPO USUARIO
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tipousuario (
                        id              INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                        nome            VARCHAR(50) NOT NULL UNIQUE
                );
                """)

            cursor.execute("""
                INSERT INTO tipousuario (nome)
                VALUES ('Master'),('Gestor')
                """)

            conn.commit()

            # USUARIOS
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS usuario (
                    id              INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    nome            VARCHAR(50) NOT NULL,
                    login           VARCHAR(50) NOT NULL UNIQUE,
                    departamento    VARCHAR(50) NOT NULL,
                    tipousuario_id  INTEGER NOT NULL,
                    cadastrar       BOOLEAN NOT NULL,
                    FOREIGN KEY (tipousuario_id) REFERENCES tipousuario (id)
                );
                """)

            registros = [
                ('William Pedrosa dos Santos','DEINF.WILPS','DEINF',1,1),
                ('Ricardo Rerison Ribeiro Pereira','DEINF.RERISON','DEINF',1,0),
                ('Rodrigo Eustaquio Fernandes Jorge','DESEG.RODRIGOEFJ','DESEG',2,0),
                ('Tiago Santos Diniz','DEINF.TDINIZ','DEINF',2,1),
            ]

            cursor.executemany("""
                INSERT INTO usuario (nome, login, departamento, tipousuario_id, cadastrar)
                VALUES (?,?,?,?,?)
                """, 
            registros)

            conn.commit()


            print('Dados inseridos com sucesso.')

        self.conn = conn
        self.cursor = cursor

        return self.cursor

    def execReturnJSON(self, sql):
        JSON = []

        resultSqlite = self.cursor.execute(sql)

        columns = [column[0] for column in resultSqlite.description] 
        for row in resultSqlite.fetchall():
            JSON.append(dict(zip(columns, row)))

        return JSON

    def execute(self, sql):
        self.cursor.execute(sql)

        return self.cursor

        return JSON

    def insertOperador(self, key, value):
        try:
            # inserindo dados na tabela
            self.cursor.executemany("""
                    INSERT INTO operadores (""" + key + """)
                    VALUES (?,?,?,?,?)
                    """, 
                value)

            self.conn.commit()

            #return self.cursor
            return 'result:Inclusão realizada com sucesso.'
        except Exception as err:
            return 'error:' + str(err)

    def updateOperador(self, id, ramal, operador, login, departamento, relatorio):
        try:
            # inserindo dados na tabela
            self.cursor.execute("""
                    UPDATE operadores
                    SET ramal = ?, operador = ?, login = ?, departamento = ?, relatorio = ?
                    WHERE id = ?
                    """, 
                (ramal, operador, login, departamento, relatorio, id))

            self.conn.commit()

            #return self.cursor
            return 'result:Atualização realizada com sucesso.'
        except Exception as err:
            return 'error:' + str(err)

    def deleteOperador(self, id):
        try:
            # inserindo dados na tabela
            self.cursor.execute("""
                    DELETE FROM operadores
                    WHERE id = ?
                    """, (id,))

            self.conn.commit()

            #return self.cursor
            return 'result:Exclusão realizada com sucesso.'
        except Exception as err:
            return 'error:' + str(err)

    def insertUsuario(self, key, value):
        try:
            # inserindo dados na tabela
            self.cursor.executemany("""
                INSERT INTO usuario (""" + key + """)
                VALUES (?,?,?,?,?)
                """, 
                value)

            self.conn.commit()

            #return self.cursor
            return 'result:Inclusão realizada com sucesso.'
        except Exception as err:
            return 'error:' + str(err)

    def updateUsuario(self, id, nome, login, departamento, tipousuario_id, cadastrar):
        try:
            # inserindo dados na tabela
            self.cursor.execute("""
                    UPDATE usuario
                    SET nome = ?, login = ?, departamento = ?, tipousuario_id = ?, cadastrar = ?
                    WHERE id = ?
                    """, 
                (nome, login, departamento, tipousuario_id, cadastrar, id))

            self.conn.commit()

            #return self.cursor
            return 'result:Atualização realizada com sucesso.'
        except Exception as err:
            return 'Error: ' + str(err)

    def deleteUsuario(self, id):
        try:
            # inserindo dados na tabela
            self.cursor.execute("""
                    DELETE FROM usuario
                    WHERE id = ?
                    """, (id,))

            self.conn.commit()

            #return self.cursor
            return 'result:Exclusão realizada com sucesso.'
        except Exception as err:
            return 'error:' + str(err)