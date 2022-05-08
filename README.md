## This is a Fork of https://github.com/dec0dOS/zero-ui
- The backend is rewritten in python/flask
- the backend was done by https://github.com/ArevomEisvolk
- Doktor Xinux https://github.com/doktor-xinux/ helped running the docker container
- This is work in progress and should be considered experimental
- Kudos to dec0dOS for writing this first time

### Built With

Frontend:

- [React](https://reactjs.org)
- [Material UI](https://material-ui.com)

Backend:

- flask
- flask_cors
- bcrypt
- tinydb
- loguru
- requests

Deploy:

- [Docker](https://www.docker.com)
- [Docker Compose](https://docs.docker.com/compose/)
- [Caddy](https://caddyserver.com)

## Getting Started

### Prerequisites

The recommended method to install ZeroUI is by using Docker and Docker Compose.
To install [Docker](https://docs.docker.com/get-docker) and [Docker Compose](https://docs.docker.com/compose/install) on your system, please follow the installation guide from the [official Docker documentation](https://docs.docker.com/get-docker).

For HTTPS setup you will need a domain name.

### Installation


## Controller setup tips

If you are using the existing controller on the host, it may be necessary to allow connection from the Docker container.
You could do it in two ways:

1. Allowing controller management from any IP address:

```sh
echo "{\"settings\": {\"portMappingEnabled\": true,\"softwareUpdate\": \"disable\",\"allowManagementFrom\": [\"0.0.0.0/0\"]}}" > /var/lib/zerotier-one/local.conf
```

> Warning: don't forget to block connections to 9993/TCP from WAN. Direct controller API does not mean to be exposed to WAN, it should be proxified via ZeroUI backend.

## Usage

After installation, log in with your credentials that are declared with ZU_DEFAULT_USERNAME and ZU_DEFAULT_PASSWORD.

Currently, almost all main ZeroTier Central features are available. Refer to the [roadmap](#roadmap) for more information.

_For the screenshots, please refer to the [screenshots](docs/SCREENSHOTS.md)._

### Development environment


... TODO

## Security

ZeroUI follows good practices of security, but 100% security cannot be assured. ZeroUI is provided "as is" without any warranty. Use at your own risk.

For enterprise support, a more reliable and scalable solution, please use ZeroTier Central.

_For more information and to report security issues, please refer to our [security documentation](docs/SECURITY.md)._

## Copyright notice

ZeroUI-Userportal is not affiliated or associated with or endorsed by ZeroTier Central or ZeroTier, Inc.

## License

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg?style=flat-square)](<https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)>)

See [LICENSE](LICENSE) for more information.
