from flask import jsonify, request, Blueprint
from untils.response import Response
import sys, os
sys.path.append(os.getcwd())
from constants.constants import *

from services.network import NETWORK

services_network = NETWORK()

from vars import DARWIN, LINUX
sys_vars = DARWIN() if os.uname().sysname == "Darwin" else LINUX()

route_network = Blueprint('network', __name__)

@route_network.route('/api/network', methods=['GET', 'POST'])
def api_network():
    """Get all Networks"""
    if request.method == 'GET':
        controllerResponse = zerotier_api.make_request("GET", "/controller/network")

        nwids = controllerResponse.json()
        data  = services_network.getNetworksData(nwids)
        
        response_object = Response(200, "ok", data)

    elif request.method == 'POST':
        """Create new Network"""
        zt = zerotier_api.make_request("GET", "/status").json()["address"]

        reqData = request.json["config"]
        reqData["rules"] = sys_vars.default_rules

        response = zerotier_api.make_request("POST", f"/controller/network/{zt}______", json = reqData)

        data = services_network.getNetworksData([response.json()["id"]])

        response_object = Response(200, "ok", data[0])

    return jsonify(response_object)

@route_network.route('/api/network/<string:nwid>', methods=['GET', 'DELETE', 'POST'])
def api_network_nwid(nwid : str):

    if request.method == "GET":
        network = services_network.getNetworksData([nwid])[0]
    
        response_object = Response(200, "ok", network)

    elif request.method == "DELETE":
    
        zerotier_api.make_request(request.method, f"/controller/network/{nwid}")
    
        response_object = Response(200, "ok", db.delete_network(nwid))

    elif request.method == "POST":


        services_network.updateNetworkAdditionalData(nwid, request.json)

        if request.json.get("config"):
            services_network.updateNetworkAdditionalData(nwid, request.json["config"])
            zerotier_api.make_request("POST", f"/controller/network/{nwid}", json = request.json.get("config"))

        response_object = Response(200, "ok")

    return jsonify(response_object)




        
