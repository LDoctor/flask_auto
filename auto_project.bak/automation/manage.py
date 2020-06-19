#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-6-28 下午2:59
# @Author  : nan
# @File    : manager.py

import os
import sys
import traceback
import json

import pkg_resources

sys.path.append("{}/flask_packages".format(sys.path[0]))
sys.path.append("{}/app_projects".format(sys.path[0]))

from gevent import pywsgi, monkey
try:
    monkey.patch_all()
except pkg_resources.VersionConflict:
    print """
    --------------------------------------------
         进入conf/sdparm 执行./yum_sdparm.sh
    --------------------------------------------
    """
from werkzeug.debug import DebuggedApplication
from geventwebsocket.handler import WebSocketHandler
import geventwebsocket
from multiprocessing import cpu_count, Process

from app_projects import create_app
from app_projects.tools.sqlite_queue import q
from flask_cors import CORS
from flask_script import Manager
from flask_migrate import MigrateCommand
from flask_sockets import Sockets


config_name = os.environ.get('FLASK_CONFIG') or 'default'
print config_name

app = create_app()
sockets = Sockets(app)
manager = Manager(app)
manager.add_command('db', MigrateCommand)


@sockets.route('/message_code/')
def message_socket(ws):
    import time
    while not ws.closed:
        t = q.get_nowait()
        if t is not None:
            try:
                ws.send(json.dumps({"data": t, "code": 0}))
            except geventwebsocket.exceptions.WebSocketError as e:
                pass
        time.sleep(1)


@app.errorhandler(Exception)
def internal_server_error(e):
    with open('/var/admin/install.log', 'a+') as f:
        traceback.print_exc(file=f)
    create_app().logger.error(traceback.format_exc())
    return json.dumps({'code': 1, 'message': traceback.format_exc()})


dapp = DebuggedApplication(app, evalex=True)
server = pywsgi.WSGIServer(('', 5559), dapp, handler_class=WebSocketHandler)
server.start()


def serve_forever():
    try:
        server.start_accepting()
        server._stop_event.wait()
    except KeyboardInterrupt:
        pass


@manager.command
def runserver():
    app.jinja_env.auto_reload = True
    CORS(app, supports_credentials=True)
    # app.run(host='0.0.0.0', port=5000, threaded=True)
    # from waitress import serve
    # serve(app, listen='*:5559', channel_timeout=1200)
    print ">>> server start <<<"
    # try:
    #     monkey.patch_all()
    #     dapp = DebuggedApplication(app, evalex=True)
    #     server = pywsgi.WSGIServer(('', 5559), dapp, handler_class=WebSocketHandler)
    #     server.serve_forever()
    # except KeyboardInterrupt:
    #     pass
    for i in range(2):
        try:
            p = Process(target=serve_forever)
            p.start()
        except KeyboardInterrupt:
            pass


if __name__ == '__main__':
    from app_projects.deploy.get_config import get_all_path
    print "检测是否缺省文件"
    get_all_path()
    print "检测完成"
    manager.run()


