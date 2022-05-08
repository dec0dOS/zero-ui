import sys
import os
import requests
sys.path.append(os.getcwd())

from vars import DARWIN, LINUX
sys_vars = DARWIN() if os.uname().sysname == "Darwin" else LINUX()

class ZEROTIER_REST_API():
    """Classe um Requests an die Zerotier API zu machen"""
    
    token       = sys_vars.zerotier_token
    headers     = {"Accept": "application/json", "Content-Type": "application/json", "X-ZT1-Auth": token}
    base_URL    = "http://localhost:9993" if os.environ.get("ZU_CONTROLLER_ENDPOINT") == None else str(os.environ["ZU_CONTROLLER_ENDPOINT"])

    def make_request(self, method: str, url_piece: str, **kwargs) -> dict:
        response = requests.request(method, url=self.base_URL + url_piece, headers=self.headers, **kwargs)

        return response


