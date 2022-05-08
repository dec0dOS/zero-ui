from flask import jsonify, request, Blueprint
from untils.response import Response
from threading import Timer
import sys, os
sys.path.append(os.getcwd())
from constants.constants import *
from services.user_managment import USER_MANAGMENT


services_user_managment = USER_MANAGMENT()

from vars import DARWIN, LINUX
sys_vars = DARWIN() if os.uname().sysname == "Darwin" else LINUX()

route_user_managment = Blueprint('user_managment', __name__)


@route_user_managment.route('/api/user-managment', methods=['GET', 'POST'])
def api_user_managment():

    if request.method == 'POST':
        user = services_user_managment.createUserData(request.json["username"], request.json["passwort"], request.json["role"])
        
        response_object = Response(200, "ok")
        
    elif request.method == 'GET':
        users = []
        data = services_user_managment.getUsersData()
        for user in data:
            users.append(user.get("username"))
        
        response_object = Response(200, "ok", users)
        
    return jsonify(response_object)

@route_user_managment.route('/api/user-managment/del/<string:user>', methods=['GET', 'POST'])
def api_user_managment_del(user : str):

    if request.method == 'POST':

        user = services_user_managment.delUserData(user)
        
        if user:
            response_object = Response(200, "ok")


        
    return jsonify(response_object)

@route_user_managment.route('/api/user-managment/member/<string:user>', methods=['GET', 'POST'])
def api_user_managment_update_member(user : str):

    if request.method == 'GET':
        
        member = services_user_managment.getUserMember(user)
        for network in member:
            for idx, user_member in enumerate(member[network]):
                auth = services_user_managment.isUserMemberAuth(network, user_member["address"])
                member[network][idx]["authorized"] = auth
        
                response_object = Response(200, "ok", member)

    elif request.method == 'POST':

        services_user_managment.updateUserMember(user, request.json["right"])
        
        response_object = Response(200, "ok")

    return jsonify(response_object)


@route_user_managment.route('/api/user-managment/member/<string:user>/reason', methods=['POST'])
def api_user_managment_log_reason(user : str):

    if request.method == 'POST':
        logger.info(f'Reason : {request.json["reason"]}  |  Duration : {request.json["duration"]}', ip=request.remote_addr, username=user)
        t = Timer(services_user_managment.convert(request.json["duration"]), services_user_managment.deauth, args=(request.json["nwid"],request.json["mid"]))
        t.start()     
    
    response_object = Response(200, "ok")
    return jsonify(response_object)


    
