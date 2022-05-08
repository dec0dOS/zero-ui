from flask import Flask, send_from_directory
from flask_cors import CORS
import os

app  = Flask(__name__, static_folder="app")
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/*": {"origins": "*"}})



from routes.network import route_network
from routes.auth import route_auth
from routes.member import route_member
from routes.user_managment import route_user_managment

app.register_blueprint(route_auth)
app.register_blueprint(route_network)
app.register_blueprint(route_member)
app.register_blueprint(route_user_managment)

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
        
    

    print("""
    /-----------------\\
    | 𝕬̊𝖗𝖊 𝖛𝖔𝖒 𝕰𝖎𝖘𝖛𝖔𝖑𝖐 |
    \-----------------/
    """)

    app.run(host='0.0.0.0', port=80)
