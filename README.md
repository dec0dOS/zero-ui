<br />
<p align="center">
  <a href="https://github.com/dec0dOS/zero-ui">
    <img src="docs/images/logo.png" alt="Logo" width="150" height="150">
  </a>

  <p align="center">
    ZeroUI - ZeroTier Controller Web UI - is a web user interface for a self-hosted ZeroTier network controller.
    <br />
    <a href="https://github.com/dec0dOS/zero-ui/blob/main/docs/SCREENSHOTS.md"><strong>Explore the screenshots »</strong></a>
    <br />
    <br />
    <a href="https://github.com/dec0dOS/zero-ui/issues">Bug Report</a>
    ·
    <a href="https://github.com/dec0dOS/zero-ui/issues">Feature Request</a>
    ·
    <a href="https://github.com/dec0dOS/zero-ui/discussions">Ask a Question</a>
  </p>
</p>

<details open="open" >
<summary>Table of Contents</summary>

- [About](#about)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Update](#update)
  - [Backup](#backup)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
  - [Development environment](#development-environment)
- [Support](#support)
- [Security](#security)
- [Copyright notice](#copyright-notice)
- [License](#license)

</details>

---

## About

This project drew inspiration from [ztncui](https://github.com/key-networks/ztncui) and was developed to address the current limitations of self-hosted [network controllers](https://github.com/zerotier/ZeroTierOne/tree/master/controller). Some of the issues in [ztncui](https://github.com/key-networks/ztncui) cannot be resolved due to the core architecture of the project. ZeroUI aims to resolve these issues and introduces the following features:

- It is a lightweight [Single Page Application (SPA)](https://en.wikipedia.org/wiki/Single-page_application) built with React, providing an improved user experience, and it is mobile-friendly.
- ZeroUI is compatible with the ZeroTier Central API, allowing you to use CLI tools and custom applications designed for ZeroTier Central to manage your networks.
- ZeroUI implements controller-specific workarounds to address certain existing [issues](https://github.com/zerotier/ZeroTierOne/issues/859) that are not addressed in [ZTNCUI](https://github.com/key-networks/ztncui/issues/63).
- ZeroUI is more feature-complete, supporting almost all network controller features, including a rule editor. Development is ongoing, so you can expect regular updates with new features and bug fixes.
- Deploying ZeroUI is straightforward; refer to the [installation](#installation) section for more information.

<details>
<summary>Curious about ZeroTier?</summary>
<br>

[ZeroTier](https://www.zerotier.com) is an impressive [open-source project](https://github.com/zerotier/ZeroTierOne) available on a wide range of [platforms](https://www.zerotier.com/download/). It can resolve many of your complex networking issues, potentially replacing your intricate VPN setups. You can create a virtual LAN and manage all your devices effortlessly.

In essence, ZeroTier combines the capabilities of VPN and SD-WAN, simplifying network management.

</details>

## Built With

Frontend:

- [React](https://reactjs.org)
- [Material UI](https://material-ui.com)

Backend:

- [NodeJS](https://nodejs.org)
- [Express](https://expressjs.com)
- [Lowdb](https://github.com/typicode/lowdb)

Ready-to-use deployment solution:

- [Docker](https://www.docker.com)
- [Docker Compose](https://docs.docker.com/compose/)
- [Caddy](https://caddyserver.com)

## Getting Started

### Prerequisites

The recommended way to install ZeroUI is by using Docker and Docker Compose. To install [Docker](https://docs.docker.com/get-docker) and [Docker Compose](https://docs.docker.com/compose/install) on your system, please follow the installation guide in the [official Docker documentation](https://docs.docker.com/get-docker).

For HTTPS setup, you will need a domain name. You can obtain one for free at https://www.duckdns.org.

### Installation

Here's a straightforward one-minute installation guide, perfect for a fresh VPS setup:

1. Create a project directory

```sh
mkdir -p /srv/zero-ui/
cd /srv/zero-ui/
```

2. Download the `docker-compose.yml` file

```sh
wget https://raw.githubusercontent.com/dec0dOS/zero-ui/main/docker-compose.yml
```

or

```sh
curl -L -O https://raw.githubusercontent.com/dec0dOS/zero-ui/main/docker-compose.yml
```

3. Replace `YOURDOMAIN.com` with your domain name and set admin credentials (`ZU_DEFAULT_PASSWORD`) in `docker-compose.yml`
4. Pull the image

```sh
docker pull dec0dos/zero-ui
```

5. Run the containers

```sh
docker-compose up -d --no-build
```

6. Check if everything is okay (`CTRL-C` to stop log preview)

```sh
docker-compose logs -f
```

7. Disable your firewall for the following ports: `80/tcp`, `443/tcp`, and `9993/udp`

- On Ubuntu/Debian with ufw installed:

```sh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 9993/udp
```

- Or you can use iptables:

```sh
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p udp --dport 9993 -j ACCEPT
```

8. Navigate to `https://YOURDOMAIN.com/app/`.
   Now you can use your ZeroUI instance with HTTPS support and automated certificate renewal.

> To disable Caddy proxy and HTTPS, remove the `https-proxy` from `docker-compose.yml`, set `ZU_SECURE_HEADERS` to `false`, and change zero-ui port `expose` to `ports`.

Advanced manual setups are also supported. Check the following environment variables as a reference:
| Name | Default value | Description |
| ---------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| NODE_ENV | unset | You could learn more [here](https://nodejs.dev/learn/nodejs-the-difference-between-development-and-production) |
| LISTEN_ADDRESS | `0.0.0.0` | Express server listen address |
| ZU_SERVE_FRONTEND | `true` | You could disable frontend serving and use ZeroUI instance as REST API for your ZeroTier controller |
| ZU_SECURE_HEADERS | `true` | Enables [helmet](https://helmetjs.github.io) |
| ZU_CONTROLLER_ENDPOINT | `http://localhost:9993/` | ZeroTier controller API endpoint |
| ZU_CONTROLLER_TOKEN | from `/var/lib/zerotier-one/authtoken.secret` | ZeroTier controller API token |
| ZU_DEFAULT_USERNAME | unset (`docker-compose.yml`: admin) | Default username that will be set on the first run |
| ZU_DEFAULT_PASSWORD | unset (`docker-compose.yml`: zero-ui) | Default password that will be set on the first run |
| ZU_DATAPATH | `data/db.json` | ZeroUI data storage path |
| ZU_DISABLE_AUTH | `false` | If set to true, automatically log in all users. This is useful if ZeroUI is protected by an authentication proxy. Note that when this value is changed, the localStorage of instances of logged-in panels should be cleared |
| ZU_LAST_SEEN_FETCH | `true`| Enables [Last Seen feature](https://github.com/dec0dOS/zero-ui/issues/40) |
| ZU_LAST_SEEN_SCHEDULE | `*/5 * * * *` | Last Seen cron-like schedule |
| ZU_LOGIN_LIMIT | `false` | Enable rate limiter for /login endpoint |
| ZU_LOGIN_LIMIT_WINDOW | 30 | The duration of the IP ban in minutes |
| ZU_LOGIN_LIMIT_ATTEMPTS | 50 | Login attemps before ban |

ZeroUI could be deployed as a regular nodejs web application, but it requires a ZeroTier controller that is installed with the `zerotier-one` package. For more info about the network controller, you could read [here](https://github.com/zerotier/ZeroTierOne/tree/master/controller/#readme).

For Ansible Role, please refer to the [zero-ui-ansible repository](https://github.com/dec0dOS/zero-ui-ansible).

<details>
<summary>Controller Setup Tips (Outside Docker)</summary>
<br>

If you are using an existing controller on the host, you may need to allow connections from the Docker container. There are two ways to do this:

1. Allow controller management from any IP address:

```sh
echo "{\"settings\": {\"portMappingEnabled\": true,\"softwareUpdate\": \"disable\",\"allowManagementFrom\": [\"0.0.0.0/0\"]}}" > /var/lib/zerotier-one/local.conf
```

> Warning: Don't forget to block connections to 9993/TCP from the WAN. Directly exposing the controller API to the WAN is not recommended; it should be proxified via the ZeroUI backend.

2. Add `network_mode: "host"` to zero-ui in `docker-compose.yml`.

For more information, please refer to this [discussion](https://github.com/dec0dOS/zero-ui/discussions/8).

</details>

## Usage

After installation, log in with the credentials declared with `ZU_DEFAULT_USERNAME` and `ZU_DEFAULT_PASSWORD`.

Currently, some main ZeroTier Central features are missing. Refer to the [roadmap](#roadmap) for more information.

_For screenshots, please refer to the [screenshots](docs/SCREENSHOTS.md) section._

### Update

To get the latest version, simply run

```sh
docker-compose pull && docker-compose up -d --no-build
```

in the folder where `docker-compose.yml` is located. Backups may not be necessary since most of your data is usually saved at the controller level, but it's still a good idea to consider them as a precautionary measure.

### Backup

You should regularly back up the `zerotier-one` and `data` folders in your ZeroUI installation directory. You can do this manually before upgrading using the following commands:

```sh
tar cvf backup-ui.tar data/
tar cvf backup-zt.tar zerotier-one/
```

## Roadmap

For a list of proposed features (and known issues), see the [open issues](https://github.com/dec0dOS/zero-ui/issues).

- [Top Feature Requests](https://github.com/dec0dOS/zero-ui/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Top Bugs](https://github.com/dec0dOS/zero-ui/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Newest Bugs](https://github.com/dec0dOS/zero-ui/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

[![GitHub issues open](https://img.shields.io/github/issues/dec0dOS/zero-ui.svg?maxAge=2592000)](https://github.com/dec0dOS/zero-ui/issues)

When creating bug reports, please ensure they are:

- _Reproducible._ Include steps to reproduce the problem.
- _Specific._ Provide as much detail as possible, including version, environment, etc.
- _Unique._ Avoid duplicating existing open issues.
- _Scoped to a Single Bug._ Report one bug per issue.

## Contributing

Firstly, thank you for considering contributing! Contributions are what make the open-source community thrive. Any contributions you make will benefit everyone, and they are highly appreciated.

To contribute:

1. Fork the project.
2. Create your feature branch (`git checkout -b feat/amazing_feature`).
3. Commit your changes (`git commit -m 'feat: add amazing_feature'`).
4. Push to the branch (`git push origin feat/amazing_feature`).
5. [Open a Pull Request](https://github.com/dec0dOS/zero-ui/compare?expand=1)

ZeroUI uses [conventional commits](https://www.conventionalcommits.org), so please follow the guidelines. You can use `yarn commit` to open a [Text-Based User Interface (TUI)](https://en.wikipedia.org/wiki/Text-based_user_interface) that follows conventional commits guidelines.

### Development Environment

To set up a development environment, follow these steps:

1. Clone the repo

```sh
git clone https://github.com/dec0dOS/zero-ui.git
cd zero-ui
```

2. Install packages

```sh
yarn install
```

3. Start the development server

```sh
yarn dev
```

4. Navigate to http://localhost:3000

You will also need to install the ZeroTier controller. On Linux, installing the `zerotier-one` package is sufficient, but other platforms may require some adjustments. First, you should obtain the controller token. On macOS, you can find it using the following command:

```sh
sudo cat "/Library/Application Support/ZeroTier/One/authtoken.secret"
```

Afterward, you can start the ZeroUI development environment:

```sh
ZU_CONTROLLER_TOKEN=TOKEN_FROM_authtoken.secret yarn dev
```

For other platforms, please refer to the [ZeroTier manual](https://docs.zerotier.com/service/v1/).

## Support

If you need assistance or have questions, reach out through [GitHub Discussions](https://github.com/dec0dOS/zero-ui/discussions).

## Security

ZeroUI follows best practices for security, but complete security cannot be guaranteed. ZeroUI is provided "as is" without any warranty. Use at your own risk.

For enterprise support and a more reliable and scalable solution, please consider using ZeroTier Central.

For more information and to report security issues, please refer to our [security documentation](docs/SECURITY.md).

## Copyright Notice

ZeroUI is not affiliated with, associated with, or endorsed by ZeroTier Central or ZeroTier, Inc.

## License

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg?style=flat-square)](<https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)>)

See [LICENSE](LICENSE) for more information.
