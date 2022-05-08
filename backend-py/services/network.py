import sys, os, time
sys.path.append(os.getcwd())
from constants.constants import *

from vars import DARWIN, LINUX
sys_vars = DARWIN() if os.uname().sysname == "Darwin" else LINUX()


class NETWORK():
    """Classe um die Anfragen rund ums Networking zu handeln"""

    def getNetworksData(self, nwids : list) -> list:
        networks = []
        for nwid in nwids:
            controllerResponse = zerotier_api.make_request("GET", f"/controller/network/{nwid}").json()
            networks.append(self.getNetworkAdditionalData(controllerResponse))

        return networks

    def getNetworkAdditionalData(self, data : dict) -> dict:
        if db.read_networks_value(data.get("id")) == []:
            self.createNetworkAdditionalData(data.get("id"))

        additionalData = db.read_networks_value(data.get("id"))[0].get("additionalConfig")

        del data["rulesSource"]
        del data["objtype"]
        del data["revision"]
        del data["remoteTraceLevel"]
        del data["remoteTraceTarget"]

        networkData = {
            "id" : data.get("id"),
            "type" : "Network",
            "clock" : time.time(),
            "config" : data,
        }

        networkData = db.merge_two_dicts(networkData,additionalData)

        return networkData

    def createNetworkAdditionalData(self, nwid : str) -> None:
        saveData = {
            "id": nwid,
            "additionalConfig": {
            "description": "",
            "rulesSource": sys_vars.default_rule_source,
            "tagsByName": {},
            "capabilitiesByName": {},
                },
            "members": [],
            }
        
        db.write_value("networks", saveData)

    def updateNetworkAdditionalData(self, nwid : str, data : dict) -> None:
        additionalData = {}

        if (data.get("name")): 
            additionalData["name"] = data.get("name")

        if (data.get("description")): 
            additionalData["description"] = data.get("description")
        
        if (data.get("rulesSource")): 
            additionalData["rulesSource"] = data.get("rulesSource")
        
        if (data.get("tagsByName")): 
            additionalData["tagsByName"] = data.get("tagsByName")
        
        if (data.get("capabilitiesByName")): 
            additionalData["capabilitiesByName"] = data.get("capabilitiesByName")

        if (additionalData):
            db.update_network(nwid, additionalData)


        