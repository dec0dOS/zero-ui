<br />
<p align="center">
  <a href="https://github.com/dec0dOS/zero-ui">
    <img src="docs/images/logo.png" alt="Logo" width="150" height="150">
  </a>

  <p align="center">
    ZeroUI - ZeroTier Controller Web UI - is a web user interface for a self-hosted ZeroTier network controller.
    <br />
    <a href="https://github.com/dec0dOS/zero-ui"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/dec0dOS/zero-ui/issues">Report Bug</a>
    ·
    <a href="https://github.com/dec0dOS/zero-ui/issues">Request Feature</a>
  </p>
</p>

<summary><h2 style="display: inline-block">Table of Contents</h2></summary>

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

---

## About

<table>
<tr>
<td>

This project is highly inspired by [ztncui](https://github.com/key-networks/ztncui) and was developed to address the current limitations of applying the self-hosted [network controllers](https://github.com/zerotier/ZeroTierOne/tree/master/controller). Some [ztncui](https://github.com/key-networks/ztncui) problems cannot be fixed because of the core architecture of the project. ZeroUI tries to solve them and implements the following features:

- Full React-powered lightweight [SPA](https://en.wikipedia.org/wiki/Single-page_application) that brings better user experience, and ZeroUI is mobile-friendly.
- ZeroUI has ZeroTier Central complitible API. That means you could use CLI tools and custom applications made only for ZeroTier Central to manage your networks.
- ZeroUI implements controller-specific workarounds that address some existing [issues](https://github.com/zerotier/ZeroTierOne/issues/859).
- ZeroUI is more feature complete. ZeroUI has almost all network-controller supported features like rule editor. The development process hasn't stopped, so you will enjoy new features and bug fixes in the near future.
- ZeroUI deployment is simple. Please refer to [installation](#installation) for more info.

<details>
<summary>Wait, I haven't heard about ZeroTier yet...</summary>
<br>

[ZeroTier](https://www.zerotier.com) is awesome [open source project](https://github.com/zerotier/ZeroTierOne) that is available on wide range of [platforms](https://www.zerotier.com/download/).
Most of your hard networking problems could be solved with ZeroTier. It could replace all your complex VPN setups. You can place all your devices on a virtual LAN and manage it easily.

To sum up, ZeroTier combines the capabilities of VPN and SD-WAN, simplifying network management.

</details>

</td>
</tr>
</table>

### Built With

Frontend:

- [React](https://reactjs.org)
- [Material UI](https://material-ui.com)

Backend:

- [NodeJS](https://nodejs.org)
- [Express](https://expressjs.com)
- [Lowdb](https://github.com/typicode/lowdb)

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

The most simple one-minute installation. Great for the fresh VPS setup.

1. Download the `docker-compose.yml` file
   ```sh
   wget https://raw.githubusercontent.com/dec0dOS/zero-ui/main/docker-compose.yml
   ```
2. Replace `example.com` with your domain name in `docker-compose.yml`
3. Pull the images
   ```sh
   docker-compose pull
   ```
4. Run the containers
   ```sh
    docker-compose up -d --no-build
   ```
5. Check if everything is okay
   ```sh
    docker-compose logs
   ```
6. Disable your firewall for the following ports: `80/tcp`, `443/tcp` and `9993/udp`
   - on ubuntu/debian with ufw installed:
     ```sh
     ufw allow 80/tcp
     ufw allow 443/tcp
     ufw allow 9993/udp
     ```
   - or you may use the old good iptables:
     ```sh
     iptables -A INPUT -p tcp --dport 80 -j ACCEPT
     iptables -A INPUT -p tcp --dport 443 -j ACCEPT
     iptables -A INPUT -p udp --dport 9993 -j ACCEPT
     ```
7. Navigate to `https://YOURDOMAIN.com/app/`.
   Now you could use your ZeroUI instance with HTTPS support and automated certificate renewal.

> To disable HTTPS, please remove https-proxy from `docker-compose.yml`, set `ZU_SECURE_HEADERS` to `false` and change zero-ui port `expose` to `ports`.

Advanced manual setups are also supported. Check the following environment variables as a reference:
| Name | Default value | Description |
| ---------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| NODE_ENV | unset | You could learn more [here](https://nodejs.dev/learn/nodejs-the-difference-between-development-and-production) |
| ZU_SERVE_FRONTEND | true | You could disable frontend serving and use ZeroUI instance as REST API for your ZeroTier controller |
| ZU_SECURE_HEADERS | true | Enables [helmet](https://helmetjs.github.io) |
| ZU_CONTROLLER_ENDPOINT | http://localhost:9993/ | ZeroTier controller API endpoint |
| ZU_CONTROLLER_TOKEN | from /var/lib/zerotier-one/authtoken.secret | ZeroTier controller API token |
| ZU_DEFAULT_USERNAME | unset (docker-compose.yml: admin) | Default username that will be set on the first run |
| ZU_DEFAULT_PASSWORD | unset (docker-compose.yml: zero-ui) | Default password that will be set on the first run |
| ZU_DATAPATH | data/db.json | ZeroUI data storage path |

ZeroUI could be deployed as a regular nodejs web application, but it requires ZeroTier controller that is installed with `zerotier-one` package. More info about the network controller you could read [here](https://github.com/zerotier/ZeroTierOne/tree/master/controller).

## Usage

After installation, log in with your credentials that are declared with ZU_DEFAULT_USERNAME and ZU_DEFAULT_PASSWORD.

Currently, almost all actions are available through the UI. Refer to the [roadmap](#roadmap) for more information.

_For the screenshots, please refer to the [screenshots](docs/SCREENSHOTS.md)._

### Update

To get the latest version just run

    docker-compose pull && docker-compose up -d --no-build

in the folder where `docker-compose.yml` is located. Backup is not required as your data is saved in Docker volumes but recommended.
You could also set up [watchtower](https://github.com/containrrr/watchtower) for automatic updates.

    docker run -d \
        --name watchtower \
        -v /var/run/docker.sock:/var/run/docker.sock \
        --restart always \
        containrrr/watchtower \
        --cleanup --include-restarting \
        zu-main zu-controller

### Backup

The easiest way to create your ZeroUI data backup is to use the following commands:

    docker run --rm --volumes-from zu-controller -v $(pwd):/backup ubuntu tar cvf /backup/backup-controller.tar /var/lib/zerotier-one
    docker run --rm --volumes-from zu-main -v $(pwd):/backup ubuntu tar cvf /backup/backup-ui.tar /app/backend/data

## Roadmap

See the [open issues](https://github.com/dec0dOS/zero-ui/issues) for a list of proposed features (and known issues).

- [Top Feature Requests ✨](https://github.com/dec0dOS/zero-ui/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc) (Add your own votes using the 👍 reaction)
- [Top Bugs 😱](https://github.com/dec0dOS/zero-ui/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc) (Add your own votes using the 👍 reaction)
- [Newest Bugs 🙀](https://github.com/dec0dOS/zero-ui/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

[![GitHub issues open](https://img.shields.io/github/issues/dec0dOS/zero-ui.svg?maxAge=2592000)](https://github.com/dec0dOS/zero-ui/issues)

Please try to create bug reports that are:

- _Reproducible._ Include steps to reproduce the problem.
- _Specific._ Include as much detail as possible: which version, what environment, etc.
- _Unique._ Do not duplicate existing opened issues.
- _Scoped to a Single Bug._ One bug per report.

## Contributing

Contributions are what makes the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody else and are **greatly appreciated**.

1. Fork the project
2. Create your feature branch (`git checkout -b feat/amazing_feature`)
3. Commit your changes (`git commit -m 'Add amazing_feature'`)
4. Push to the branch (`git push origin feat/amazing_feature`)
5. Open a pull request

ZeroUI uses [conventional commits](https://www.conventionalcommits.org), so please follow the guidelines.
Run `yarn commit` to open [TUI](https://en.wikipedia.org/wiki/Text-based_user_interface) that follows conventional commits guidelines.

### Development environment

To set up a development environment, please follow these steps:

1. Clone the repo
   ```sh
   git clone https://github.com/dec0dOS/zero-ui.git
   ```
2. Install packages
   ```sh
   yarn installDeps
   ```
3. Start the development server
   ```sh
   yarn dev
   ```
4. Navigate to http://localhost:3000

It is also required to install ZeroTier controller. On Linux installing `zerotier-one` package is enough, other platforms require some tweaking. Firstly you should get the controller token. On macOS, you could find it with the following command:

    sudo cat "/Library/Application Support/ZeroTier/One/authtoken.secret"

After you could start ZeroUI development environment:

    ZU_CONTROLLER_TOKEN=TOKEN_FROM_authtoken.secret yarn dev

_For other platforms, please refer to [ZeroTier manual](https://www.zerotier.com/manual/#4)._

## Support

Reach out to me at one of the following places:

- Telegram: ***REMOVED***
- E-Mail: *****REMOVED*****

## Security

ZeroUI follows good practices of security, but 100% security can't be granted in software. ZeroUI is provided "as is" without any warranty. Use at your own risk.

For enterprise support, a more reliable and scalable solution, please use ZeroTier Central.

_For more info, please refer to the [security](docs/SECURITY.md)._

## Copyright notice

ZeroUI is not affiliated or associated with or endorsed by ZeroTier Central or ZeroTier, Inc.

## License

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg?style=flat-square)](<https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)>)

See [LICENSE](LICENSE) for more information.
