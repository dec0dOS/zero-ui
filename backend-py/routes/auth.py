from flask import jsonify, request, Blueprint
from untils.response import Response
import os
from werkzeug.exceptions import BadRequest

import sys, os
sys.path.append(os.getcwd())
from constants.constants import *

from vars import DARWIN, LINUX
sys_vars = DARWIN() if os.uname().sysname == "Darwin" else LINUX()

route_auth = Blueprint('auth', __name__)

@route_auth.route('/auth/login', methods=['POST'])
def login():

    login_data = request.json
    userdata = db.read_user_credentials(login_data.get("username"))
    if userdata != []:
        if hash.is_correct_password(userdata[0].get("salted_passwort"), login_data.get("password")):
            response_object = Response(200, "ok", {"role" : userdata[0].get("role"), "token" : "eisvolk"})
        else:
            raise BadRequest()
    else:
        raise BadRequest()

    return jsonify(response_object)
