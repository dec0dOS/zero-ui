import os
import sys
import os, time
sys.path.append(os.getcwd())
from tinydb import TinyDB, Query
from tinydb import TinyDB, where
from tinydb.table import Document


from vars import DARWIN, LINUX
sys_vars = DARWIN() if os.uname().sysname == "Darwin" else LINUX()
    
class Zero_DB():
    """TinyDB Json Datenbank um verschiedene Werte zu speicher"""
    """PS: Das war teilweiße ein ganz schöner Krampf"""

    def __init__(self, path=sys_vars.default_config_path, **kwargs) -> None:
        self.db         = TinyDB(path + 'db.json', indent=4)
        self.users      = self.db.table("users")
        self.networks   = self.db.table("networks")
        self.query      = Query()

    def write_user_credentials(self, username, salted_passwort, role):
        self.users.insert({
            "username" : username,
            "salted_passwort" : salted_passwort,
            "role" : role 
        })
    def merge_two_dicts(self, x, y):
        """Given two dictionaries, merge them into a new dict as a shallow copy."""
        z = x.copy()
        z.update(y)
        return z

    def read_user_credentials(self, user):
        return self.users.search(self.query.username == user)

    def read_user_member(self, user):
        return self.users.search(self.query.username == user)

    def read_users(self):
        return self.users.all()

    def read_networks_value(self, value):
        return self.networks.search(self.query.id == value)
    
    def read_networks_member_value(self, nwid, mid):
        for item in self.networks.search(self.query.id == nwid):
            if item.get("members") != None:
                for member in item.get("members"):
                    if member.get("id") == mid:
                        return member

    def update_network(self, nwid, data):
        self.networks.upsert(Document({ "additionalConfig" : self.merge_two_dicts(self.read_networks_value(nwid)[0].get("additionalConfig"), data)}, doc_id=self.read_networks_value(nwid)[0].doc_id))

    def update_network_members(self, nwid, mid, data):
        upd = []
        for item in self.read_networks_value(nwid)[0]["members"]:
            if item["id"] == mid:
                upd.append(self.merge_two_dicts(item, data))
            else:
                upd.append(item)

        self.networks.upsert(Document({ "members" : upd }, doc_id=self.read_networks_value(nwid)[0].doc_id))

    def find_networks_id_by_member(self, value):
        for network in self.networks.all():
            for member in network.get("members"):
                if member == value:
                    return network.get("id")

    def clean_user_member(self, user):

        self.users.upsert(Document({ "members" : {} }, doc_id=self.read_user_member(user)[0].doc_id))


    def update_user_member(self, user, key, data : dict):
        
        members = {}

        def _get_dict_values(item : str):
            return self.read_user_member(user)[0].get("members")[item]
        
        def _get_dict_key(item : dict):
            return item
        
        if self.read_user_member(user)[0].get("members") != None and self.read_user_member(user)[0].get("members") != {}:
            
            popd = self.read_user_member(user)[0].get("members")
            try:
                popd[key]
            except:
                pass

            members.update(popd)
            
            for item in self.read_user_member(user)[0].get("members"):
                if _get_dict_key(item) == key:
                    members.update({key : [data,  *_get_dict_values(item)]})
                else:
                    members.update({key : [data]})


                
        else:
            members.update({key : [data]})
        
        self.users.upsert(Document({ "members" : members }, doc_id=self.read_user_member(user)[0].doc_id))

    def delete_network(self, value):
        return self.networks.remove(self.query.id == value)

    def delete_user(self, value):
        return self.users.remove(self.query.username == value)
            
    def write_value(self, table, value):
        self.db.table(table).insert(value)

    def read_table_values(self, table):
        return self.db.table(table).all()

    def table_update(self, table, value, doc_id):
        self.db.table(table).update(value, doc_ids=[doc_id])

    def return_db(self):
        return self.db


if __name__ == "__main__":
    db = Zero_DB()
    nwid = "95004cf76d12a86e"
    mid = "95004cf76d"
    from tinydb.operations import set
    from tinydb.table import Document
    db.networks.remove(where('id') == 'xxx')
    


    
    
    