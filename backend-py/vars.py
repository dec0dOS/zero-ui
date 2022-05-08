import pathlib
import os

class OS_DEFAULTS():
    """Classe um die Default Pfade und Variablen bereitzustellen"""

    default_config_path     = './config/'

    try:
        username = str(os.environ['ZU_DEFAULT_USERNAME'])
        password = str(os.environ['ZU_DEFAULT_PASSWORD'])

    except:
        username = "admin"
        password = "zero-ui"

    default_admin_creditals = {
        "username" : username,
        "passwort" : password
        }
    
    default_rule_source = open("./constants/default_rules_source.txt").read()
    default_rules       = open("./constants/default_rules.json").read()


    
class DARWIN(OS_DEFAULTS):
    """Classe um die Pfade und Variablen des Betriebsystems bereitzustellen"""

    def __init__(self) -> None:

        self.default_path   = str(pathlib.Path.home()) + "/Zerotier"
        self.zerotier_token = open("/Library/Application Support/ZeroTier/One/authtoken.secret", encoding="utf-8").read()

class LINUX(OS_DEFAULTS):
    """Classe um die Pfade und Variablen des Betriebsystems bereitzustellen"""

    def __init__(self) -> None:

        self.default_path   = "/Zerotier"
        self.zerotier_token = open("/var/lib/zerotier-one/authtoken.secret", encoding="utf-8").read()
