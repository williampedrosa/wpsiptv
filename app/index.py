# -*- coding: utf-8 -*-
from tornado.options import options, define
from requests.auth import HTTPBasicAuth
import tornado.ioloop
import tornado.httpserver
import tornado.web
#import asyncio
from datetime import datetime
from bd.sqlite import *
import json
import os

class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "*")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS')

    def options(self):
        # no body
        self.set_status(204)
        self.finish()

    def put(self):
        self.write('some put')

    def post(self):
        self.write('some post')

    def get(self):
        self.write('some get')


class MainHandler(BaseHandler):
    def get(self):
        variaveis = inicializePage(self, "Home", "/")
        if variaveis != None:
            self.render("html/index.html", variaveis = variaveis)


class LoginHandler(BaseHandler):
    def get(self):
        variaveis = inicializePage(self, "Login", "/login")
        if variaveis != None:
            self.render("html/login.html", variaveis = variaveis)

    def post(self):

        Error = {}
        if self.get_argument("email") != "" and self.get_argument("password") != "":
            # perform the Bind operation
            if True:
                if True:
					
                    self.set_secure_cookie("user", self.get_argument("email"), expires_days=0.4) # 9 hrs
                    user = self.get_argument("email")

                    self.redirect("/")
                else:
                    if c.result['description'] == "invalidCredentials":
                        Error = {
                                    "email" : self.get_argument("email"),
                                    "inputPass" : True,
                                    "message" : "Senha incorreta.",
                                }
                    else:
                        Error = {
                                    "message" : c.result,
                                }
            else:
                Error = {
                            "message" : "Usuário '" + (self.get_argument("email")).upper() + "' sem permissão para acessar o portal. Favor entrar em contato com o gestor.",
                        }
        else:
            Error["email"] = self.get_argument("email")
            Error["message"] = "Preencher usuário e senha."
            if self.get_argument("email") == "":
                Error["inputEmail"] = True
            if self.get_argument("password") == "":
                Error["inputPass"] = True

        if Error != {}:
            variaveis = inicializePage(self, "Login", "/login")
            if variaveis != None:
                self.render("html/login.html", variaveis = variaveis, Error = Error)
            

class LogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookie("user")
        self.redirect(self.get_argument("next", "/"))

def inicializePage(self, title, currentPage):
    user = self.get_secure_cookie("user")
    if (not self.current_user and currentPage != "/login"):
        self.clear_cookie("user")
        self.redirect("/login")
        return None

    
    variaveis = {
        "title" : title,
        "currentPage" : currentPage,
        "sidebar" : [
            {
                "icone":"fas fa-th",
                "nameGroup":"Início",
                "href":"/",
                "submenu":[]
            },
            {
                "icone":"fas fa-tachometer-alt",
                "nameGroup":"Relatórios",
                "href":"",
                "submenu":[
                    {
                        "name":"Lista de ligações",
                        "href":"/lista_ligacoes"
                    },
                    {
                        "name":"Atendimento corrente",
                        "href":"/atendimento_corrente"
                    },
                    {
                        "name":"Quantidade Atendimentos",
                        "href":"/qtd_atendimentos"
                    },
                    {
                        #"icone":"fas fa-phone-volume",
                        "name":"Ligação/Gravação corrente",
                        "href":"/ligacao_gravacao"
                    }
                ]
            }
        ]
    }

    

    if user != None:
        user = user.decode("utf-8")
        variaveis['usuarioNome'] = "William Santos"

    return variaveis

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/login", LoginHandler),
        (r"/logout", LogoutHandler),
        (r"/plugins/(.*)", tornado.web.StaticFileHandler, {"path": os.path.dirname(os.path.abspath(__file__)) + '/html/plugins'}),
        (r"/dist/(.*)", tornado.web.StaticFileHandler, {"path": os.path.dirname(os.path.abspath(__file__)) + '/html/dist'}),
        (r"/img/(.*)", tornado.web.StaticFileHandler, {"path": os.path.dirname(os.path.abspath(__file__)) + '/html/img'}),
        (r"/js/(.*)", tornado.web.StaticFileHandler, {"path": os.path.dirname(os.path.abspath(__file__)) + '/html/js'}),
        (r"/css/(.*)", tornado.web.StaticFileHandler, {"path": os.path.dirname(os.path.abspath(__file__)) + '/html/css'}),
    ], cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__")


if __name__ == "__main__":
    #asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    print("Auth : init")
    connSqlite = ConnSqlite()
    app = make_app()
    app.listen(5000)
    tornado.ioloop.IOLoop.current().start()
