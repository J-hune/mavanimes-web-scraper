# Mavanimes.co Scraper

I've known and used Javascript for a while (2017). <br>
After hearing a lot about TypeScript I took some time to learn this language.<br>
I made this project to put some of my learning into practice.

## About
This NodeJS application is a web-scraper of the site mavanimes.co.
With the discord.js library, it allows to send a discord message in the defined channel when an anime is uploaded.

## Configuration
Before launching the application, you must modify the configuration file `settings.js`

| Setting Name        | Description                                                      |
|---------------------|:-----------------------------------------------------------------|
| token               | Discord Bot Token                                                |
| timeBetweenEachCall | Interval (in minutes) between each check                         |
| GuildID             | The id of the discord server on which the messages will be sent  |
| ChannelID           | The id of the discord channel on which the messages will be sent |
> No Privileged Gateway Intents required


## Installation
```shell
npm install
```
```shell
npm start
```

## Any Questions ?
DM me on [Discord](https://discord.com/users/429652389256232962) !
