![PoolX](./public/img/poolX_logo.png)

## Quick Setting Up Of Development

* `yarn install`
* `yarn start`

## Table of content

* [Getting Started](#getting-started)
  * [Install](#install)
    * [OSX and Linux](#osx-and-linux)
    * [Windows](#windows)
  * [Run](#run)
  * [Build](#build)
  * [Configuration](#configuration)
* [Contributing](#contributing)
  * [Local Development](#local-development)
  * [Development and PR Testing](#development-and-pr-testing)
  * [Deployment Environments](#deploy-environments)
  * [Release Process](#release-process)
* [Help](#help)

## Getting Started

In the following sections you will learn all you need to know to run the PoolX DApp locally.

#### Prerequisities

* You need to use Node > v6
* You need to use npm 4.x, or npm >= 5.3, or yarn to correctly install the dependencies.

### Install

#### OSX and Linux

1. From the desired directory you wish to copy the "poolx-www" folder with source files to.
   ```
   git clone {paste your repo link here}
   ```
   NOTE: Please use `develop` branch for contributing.
   ```
   git clone -b develop {paste repo link here}
   ```
2. Change directories to poolx-www:
   ```
   cd poolx-www
   ```
3. Make sure you have [NodeJS](https://nodejs.org/) (v8.4.0 or higher) and [npm](https://www.npmjs.com/) (5.4.1 or higher) installed.
4. Install dependencies from within poolx-www directory:
   ```
   yarn install
   ```
5. That is it, you are now ready to run the poolX dapp! Head to the [Run DApp](#run-dapp) section for further instructions.

#### Windows

1. Make sure you have the LTS version of [64-bit NodeJS](https://nodejs.org/en/download/current) (v8.9.1)
2. Run the node-v8.9.1-x64.msi installer and then continue through the installation as normal. Be sure to have the "Enable in PATH" option enabled before installing.
3. Open the command line in administrator mode by right clicking on the cmd.exe application and selecting "Run as administrator"
4. In the administrator command prompt, change to the directory where you want to store this repository.
   ```
   cd C:\some\directory\for\repositories
   ```
5. Update yarn to the latest version (in order to make sure the next step has the latest dependencies to install) with:
   ```
   npm install yarn@latest -g
   ```
6. You must install the NodeJS/NPM dependcies for Windows before you are able to continue. This command will take a few minutes to install all of the necessary dependencies for building NodeJS applications on Windows.
   ```
   npm install -g windows-build-tools
   ```
7. Install dependencies from within poolx-www directory:
   ```
   yarn install
   ```
8. For some reason the npm node-sass package does not install correctly in windows when using the 'npm install' command, so you must rebuild the node-sass package with:
   ```
   npm rebuild node-sass
   ```
9. The web3 package does not install correctly when using the 'npm install' command, so you must install it separately in order for this dapp to run. Use the following to install web3:
   ```
   npm install web3
   ```
10. That is it, you are now ready to run the poolX dapp! Head to the [Run dapp](#run-dapp) section for further instructions.

### Run

1. The PoolX dapp will need to connect to a poolX-api feathers server. Follow the poolX-api readme instructions to install and run server before proceeding further. Alternatively, you could change the configuration to connect to the `develop` environment, see the [Configuration](#configuration) section.
2. Start the dapp.
   ```
   yarn start
   ```
3. Once the dapp is up in your browser, click "Sign In" from the main menu.

### Build

```
yarn build
```

NOTE: due to a bug in Safari create-react-app's output does not work in Safari (and any iPhone browser)
To fix this:

`cd /node_modules/giveth-react-scripts/config`
open `webpack.config.prod.js`
go to line 300, and add:

```
  mangle: {
    safari10: true,
  },
```

now the build will work in Safari

### Configuration

The DApp has several node environment variables which can be used to alter the DApp behaviour without changing the code. You can set them through `.env` or `.env.local` files.

| Variable name                      | Default Value                     | Description                                                                                                                                                                                                         |
| ---------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                               | 3010                              | Port on which the DApp runs                                                                                                                                                                                         |
| REACT_APP_ENVIRONMENT              | 'localhost'                       | To which feathers environment should the DApp connect. By default it connects to localhost feathers. Allowed values are: `localhost`, `develop`, `production`. See [Deployment Environments](#deploy-environments). |
| REACT_APP_DECIMALS                 | 8                                 | How many decimal should be shown for ETH values. Note that the calculations are still done with 18 decimals.                                                                                                        |
| REACT_APP_FEATHERJS_CONNECTION_URL | Differs per REACT_APP_ENVIRONMENT | Overwrites the environment injected feathers connection URL.                                                                                                                                                        |
| REACT_APP_ETH_NODE_CONNECTION_URL  | Differs per REACT_APP_ENVIRONMENT | Overwrites the ethereum node connection URL for making ethereum transactions.                                                                                                                                       |
| REACT_APP_POOL_FACTORY_ADDRESS     | Differs per REACT_APP_ENVIRONMENT | Overwrites the Pool factory address.                                                                                                                                                                                |
| REACT_APP_BLOCKEXPLORER            | Differs per REACT_APP_ENVIRONMENT | Overwrites the block explorer base URL such as etherscan. The DApp assumes such blockexplorer api is `\<BLOCKEXPLORER\>/tx/\<TRANSACTION_HASH\>`                                                                    |

Example of `.env.local` file that makes the DApp run on port 8080, connects to the **develop** environment and uses custom blockexplorer:

```
PORT=8080
REACT_APP_ENVIRONMENT='develop'
REACT_APP_BLOCKEXPLORER='www.awesomeopensourceexplorer.io'
```
