# HyunwooBot

## Dependencies

- discord.js
- firebase
- scrape-youtube
- ytdl-core

## Features

- Slash commands
- Custom log delivery channel
- Timeout for AFK users
- Private Text + Voice Channel for users

## Commands

| Command                                                                              | Description                                    |
| :----------------------------------------------------------------------------------- | :--------------------------------------------- |
| /help [manager]                                                                      | List of commands and descriptions              |
| /autorole \<view\|add\|purge> [user\|bot] [role]                                     | Give roles when a member/bot joins the server  |
| /embed \<textChannel> \<messageEmbed>                                                | Create an embed                                |
| /edit \<textChannel> \<messageID> \<messageEmbed>                                    | Edit a previous embed                          |
| /delete \<amount>                                                                    | Bulk delete messages                           |
| /disconnect \<voiceChannel>                                                          | Disconnect all users from a voice channel      |
| /move \<fromVoiceChannel> \<targetVoiceChannel>                                      | Move all users to another voice channel        |
| /locale \<code>                                                                      | Change the default locale for the server       |
| /log \<textChannel>                                                                  | Set a text channel for logging                 |
| /privateroom                                                                         | Initalize a private room generator channel     |
| /reactionrole \<view\|add\|remove\|purge> \<textChannel> \<messageID> [emoji] [role] | Add/remove a reaction role                     |
| /setafktimeout \<minute(s)>                                                          | Set minutes to kick AFK users                  |
| /voicerole \<view\|add\|remove\|purge> \<voiceChannel> \<role> [textChannel]         | Give a role when someone joins a voice channel |

## Command - Music (On development)

| Command            | Description                     |
| :----------------- | :------------------------------ |
| /join              | Join a voice channel            |
| /leave             | Disconnect from a voice channel |
| /play [query\|URL] | Play/Enqueue a music            |
| /pause             | Pause the song                  |
| /stop              | Stop the music                  |
| /queue             | Show Queue                      |
| /loop              | Toggle loop for the queue       |
| /repeat            | Toggle repeat                   |
| /skip              | Skip current music              |
| /volume \<1~10>    | Change the volume               |
