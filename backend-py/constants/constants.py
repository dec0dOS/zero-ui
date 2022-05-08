import os, sys
sys.path.append(os.getcwd())
from untils.db import Zero_DB
from untils.textTransform import HASH
from untils.zero_tier_api import ZEROTIER_REST_API
from untils.zerologger import LogurLogger
from loguru import logger


from vars import DARWIN, LINUX


sys_vars = DARWIN() if os.uname().sysname == "Darwin" else LINUX()

if os.path.isdir(sys_vars.default_config_path) == False:
    os.mkdir(sys_vars.default_config_path)
    
    
db           = Zero_DB()
hash         = HASH()
zerotier_api = ZEROTIER_REST_API()
logger  = LogurLogger(logger).getlogger()



pw_hash = hash.hash_password(sys_vars.default_admin_creditals.get("passwort"))

if db.read_user_credentials(sys_vars.default_admin_creditals.get("username")) == []:    
    db.write_user_credentials(**{"username" : sys_vars.default_admin_creditals.get("username"), "salted_passwort" : pw_hash, "role" : "admin"})