# Open Pi Monitor

An API written in **TypeScript** for getting data from your *Raspberry Pi*

## Installation

You can install **OpenPiMonitor** easily like any other Node.JS application.
```
> git clone https://github.com/HorseGlass/OpenPiMonitor.git
> cd OpenPiMonitor
> npm install
```
> **NOTE**: In order to successfully complete the installation you might need to use ***sudo*** before the `npm install` command

## Usage

Go to the root directory and run `npm run start`

## Avaible GET urls

|Main Type |Sub Type                 |Description|
|----------|:-----------------------:|-----------|
|**`/cpu`**|/temp<br>/load           |Returns the temperature of the CPU<br>Returns the current load of the whole CPU|
|**`/gpu`**|/temp                    |Returns the temperature of the GPU|
|**`/mem`**|/total<br>/free<br>/usage|Returns the total amount of RAM installed in your PI<br>Returns the amount of RAM thats avaible to be used by processes<br>Returns the amount of already used RAM|
|**`/storage`**|/total<br>/free<br>/used|Returns the total amount of storage in gigabytes<br>Returns avaible storage space in gigabytes<br>Returns the used storage space in gigabyte|
|**`/network`**|/ip|Returns the ip address of the pi in the **local** network|

## Command line arguments

You can customize how the *API* behaves[^1].  
After typing `npm run start` you can pass arguments to the API seperated by spaces.
> **Example**: `npm run start -- --port=3001`  
> **Note**: You need to seperate the arguments from the **npm** command using the `--` in the middle.

**Passable arguments**  
|Argument     |Default Value|Value Type|Description                                 |
|-------------|-------------|:--------:|--------------------------------------------|
|`--port`     |*3000*       |int       |API server port                             |

[^1]: More customizability to come