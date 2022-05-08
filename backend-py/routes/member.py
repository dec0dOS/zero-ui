from flask import jsonify, request, Blueprint
from untils.response import Response
import sys, os
sys.path.append(os.getcwd())
from constants.constants import *

from services.member import MEMBER
services_member = MEMBER()

from vars import DARWIN, LINUX
sys_vars = DARWIN() if os.uname().sysname == "Darwin" else LINUX()

route_member = Blueprint('member', __name__)


@route_member.route('/api/network/<string:nwid>/member', methods=['GET', 'DELETE'])
def api_network_nwid_member(nwid : str):
    if request.method == "GET":
        
        mids = zerotier_api.make_request(request.method, f"/controller/network/{nwid}/member")
        
        data = services_member.getMembersData(nwid, mids.json().keys())
        
        response_object = Response(200, "ok", data)
        
    return jsonify(response_object)


@route_member.route('/api/network/<string:nwid>/member/<string:mid>', methods=['DELETE', 'POST'])
def api_network_nwid_member_member(nwid : str, mid : str):
    if request.method == "POST":

        services_member.updateMemberAdditionalData(nwid, mid, request.json)

        if type(request.json) == list:
            zerotier_api.make_request(request.method, f"/controller/network/{nwid}/member/{mid}", json = {"authorized" : request.json[0]["authorized"]})
            data = services_member.getMembersData(nwid, [mid])

        elif (request.json.get("config")):

            zerotier_api.make_request(request.method, f"/controller/network/{nwid}/member/{mid}", json = request.json["config"])
            data = services_member.getMembersData(nwid, [mid])
            
        else:
            data = services_member.getMembersData(nwid, [mid])
       
        response_object = Response(200, "ok", data)

    elif request.method == "DELETE":
        services_member.deleteMemberAdditionalData(nwid, mid)

        zerotier_api.make_request(request.method, f"/controller/network/{nwid}/member/{mid}")
        
        defaultConfig = {
            "authorized": False,
            "ipAssignments": [],
            "capabilities": [],
            "tags": []
            }

        zerotier_api.make_request("POST", f"/controller/network/{nwid}/member/{mid}", json = defaultConfig)

        response_object = Response(200, "ok")

        
        
    return jsonify(response_object)