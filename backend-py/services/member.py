import sys, os, time

import sys, os
sys.path.append(os.getcwd())
from constants.constants import *

from vars import DARWIN, LINUX
sys_vars = DARWIN() if os.uname().sysname == "Darwin" else LINUX()


class MEMBER():
    """Classe um die Anfragen rund ums MemberVerwaltung zu handeln"""
    
    def getPeer(self, mid : str) -> dict:
        
        return zerotier_api.make_request("GET", f"/peer/{mid}")

    def filterDeleted(self, nwid : str, mid : str) -> str:
        try:
            if db.read_networks_member_value(nwid, mid).get("deleted") != True:
                
                return mid
        except:
            
            return mid


    def getMembersData(self, nwid : str , mids : str) -> list:
        members = []
        for mid in mids:
            if self.filterDeleted(nwid, mid):
                member = zerotier_api.make_request("GET", f"/controller/network/{nwid}/member/{mid}").json()
                members.append(self.getMemberAdditionalData(member))
            
        return members

    def getMemberAdditionalData(self, data : dict) -> dict:
        
        #DB BUG INITIALIZATION MIGRATION
        if db.read_networks_member_value(data.get("nwid"),data.get("id")) == None:
            members = db.read_networks_value(data.get("nwid"))[0].get("members")
            if members != None:
                members.append({"id" : data.get("address")})
                db.table_update("networks", {"members" : members } , db.read_networks_value(data.get("nwid"))[0].doc_id)
            else:
                db.table_update("networks", {"members" : [{"id" : data.get("address")}] } , db.read_networks_value(data.get("nwid"))[0].doc_id)
        #END MIGRATION SECTION
        
        
        peerData = {}
        zt = zerotier_api.make_request("GET", "/status").json()["address"]
        peer = self.getPeer(data.get("id")).json()

        if (peer):
            peerData["latency"] = peer.get("latency")
            peerData["online"] = 1 if peer.get("latency") != -1 else 2
            peerData["clientVersion"] = peer.get("version")
            if peer.get("paths"):
                peerData["lastOnline"] = peer.get("paths")[0]["lastReceive"]
                peerData["physicalAddress"] = peer.get("paths")[0]["address"].split("/")[0]
                peerData["physicalPort"] = peer.get("paths")[0]["address"].split("/")[1]
        else:
            peerData["online"] = 0

        del data["lastAuthorizedCredential"]
        del data["lastAuthorizedCredentialType"]
        del data["objtype"]
        del data["remoteTraceLevel"]
        del data["remoteTraceTarget"]
        
        additionalData = {}
        
        try :
            additionalData = db.read_networks_member_value(data.get("nwid"),data.get("id"))["additionalConfig"]
        except:
            additionalData = {}

        memberData = {
            "id"    : data.get("nwid") + "-" + data.get("id"),
            "type"  : "Member",
            "clock" : time.time(),
            "networkId" : data.get("nwid"),
            "nodeId" : data.get("id"),
            "controllerId" : zt,
            **additionalData,
            **peerData,
            "config" : data
        }
        
        return memberData

    def updateMemberAdditionalData(self, nwid : str, mid : str, data : dict) -> None:
        try:
            additionalConfig = db.read_networks_member_value(nwid, mid)["additionalConfig"]
        except:
            additionalConfig = {}
        
        ## Only for Usermanagment
        if type(data) == list:
            data = data[0]
            authorized = data["authorized"] if data["authorized"] == True else False
            db.update_network_members(nwid, mid, {"additionalConfig" : db.merge_two_dicts(additionalConfig, {"authorized" : authorized})} )
        ##
        else:
            if data.get("config") and data.get("config").get("authorized") != None:
                authorized = data.get("config")["authorized"] if data.get("config")["authorized"] == True else False
                db.update_network_members(nwid, mid, {"additionalConfig" : db.merge_two_dicts(additionalConfig, {"authorized" : authorized})} )

            additionalData = data.get("config") if data.get("config") != None else {}

            if (data.get("name")):
                additionalData["name"] = data["name"]

            if (data.get("description")):
                additionalData["description"] = data["description"]

            if additionalData:
                db.update_network_members(nwid, mid, {"additionalConfig" : db.merge_two_dicts(additionalConfig, additionalData)})

    def deleteMemberAdditionalData(self, nwid, mid) -> None:
        db.update_network_members(nwid, mid, {"id": mid, "deleted" : True})