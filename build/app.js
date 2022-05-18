var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve2, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/modules/logger.ts
var import_chalk, log;
var init_logger = __esm({
  "src/modules/logger.ts"() {
    import_chalk = __toESM(require("chalk"));
    log = {
      getTsp() {
        return new Date().toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul"
        });
      },
      e(str) {
        console.error(`[${this.getTsp()}] ${import_chalk.default.red(str)}`);
      },
      w(str) {
        console.warn(`[${this.getTsp()}] ${import_chalk.default.yellow(str)}`);
      },
      i(str) {
        console.info(`[${this.getTsp()}] ${import_chalk.default.cyan(str)}`);
      },
      s(str) {
        console.log(`[${this.getTsp()}] ${import_chalk.default.green(str)}`);
      },
      v(str) {
        console.log(`[${this.getTsp()}] ${import_chalk.default.white(str)}`);
      },
      d(str) {
        console.debug(`[${this.getTsp()}] ${import_chalk.default.blue(str)}`);
      }
    };
  }
});

// src/props.ts
var props;
var init_props = __esm({
  "src/props.ts"() {
    props = {
      bot: {
        prefix: "/",
        name: "HyunwooBot",
        website: "https://bot.hyunwoo.dev",
        icon: "https://cdn.discordapp.com/avatars/303202584007671812/9fe36da1c721e959a991d38dcffdbe67.png?size=256"
      },
      color: {
        red: 15238024,
        magenta: 13799652,
        orange: 14396281,
        yellow: 16506753,
        green: 11062411,
        cyan: 6734541,
        blue: 7454450,
        purple: 7833812,
        white: 12173258
      },
      icon: {
        call_end: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/call_end.png?alt=media&token=94663943-12f5-4566-9185-119bb7c4ad21",
        delete: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/delete.png?alt=media&token=7c210430-e1f1-4ef2-aa88-4e1d533b5dfe",
        edit: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/edit.png?alt=media&token=7b613d7f-df99-4950-ab38-85d2814db94b",
        enqueue: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/enqueue.png?alt=media&token=028b7e6a-7a89-413e-abad-c518e26c7cf8",
        in: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/in.png?alt=media&token=9ad76ee2-eee6-48fe-beae-eac909c57298",
        out: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/out.png?alt=media&token=c41b754c-94c9-48af-889e-c28521a2ad5c",
        play: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/play.png?alt=media&token=38cc0c28-41b4-44aa-9f2f-0ad9c23859ab",
        queue: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/queue.png?alt=media&token=71d7e90d-952e-4185-aaac-fd5dd2dcda46",
        role_append: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/role_append.png?alt=media&token=a6a7a60e-aa93-4bb2-91a1-60a17e40bfe4",
        role_remove: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/role_remove.png?alt=media&token=1dfcdc9b-ab85-494a-909c-49a8f27b7fa2",
        timer: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/timer.png?alt=media&token=db53fc67-5870-4d93-8f0d-dd4019b7a574",
        volume: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/volume.png?alt=media&token=887c1886-e440-48a4-b52e-15b064f5bc2f"
      },
      developerID: "303202584007671812",
      disconnectTimeout: 3e5
    };
  }
});

// src/modules/createError.ts
var createError;
var init_createError = __esm({
  "src/modules/createError.ts"() {
    init_logger();
    init_app();
    init_props();
    createError = (location, body, ref) => __async(void 0, null, function* () {
      try {
        let guild;
        if (ref) {
          if (ref.guild)
            guild = client.guilds.resolve(ref.guild);
          else if (ref.message)
            guild = ref.message.guild;
          else if (ref.interaction)
            guild = client.guilds.resolve(ref.interaction.guildId);
          else if (ref.member)
            guild = ref.member.guild;
          if (ref.message)
            body += `

Original Message: ${ref.message.content}`;
          else if (ref.interaction)
            body += `

Original Interaction: ${JSON.stringify(ref.interaction)}`;
        }
        log.e(`${guild ? `${guild.name} > ` : ""}${location} > ${body}`);
        (yield client.users.resolve(props.developerID).createDM()).send({
          embeds: [
            {
              author: {
                name: guild ? guild.name : null,
                iconURL: guild ? guild.iconURL() : null
              },
              color: props.color.red,
              description: String(body),
              footer: { text: location },
              timestamp: new Date()
            }
          ]
        });
      } catch (err2) {
        log.e(`CreateError > ${err2}`);
      }
    });
  }
});

// src/commands/user/help.ts
var help;
var init_help = __esm({
  "src/commands/user/help.ts"() {
    init_createError();
    init_app();
    init_props();
    help = {
      name: "help",
      version: 1,
      options(locale2) {
        return [
          {
            type: 3,
            name: "scope",
            description: locale2.scope,
            required: false,
            choices: [{ name: "manager", value: "manager" }]
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            const isManager = interaction.data.options && interaction.data.options[0].value === "manager" ? true : false;
            const fields = [];
            for (const [name, command] of !isManager ? userCommands : managerCommands) {
              fields.push({
                name: `${command.messageOnly ? prefix : "/"}${name}${state.locale.usage[name] ? ` ${state.locale.usage[name]}` : ""}`,
                value: state.locale.help[name] ? state.locale.help[name] : "\u200B",
                inline: true
              });
            }
            return [
              {
                color: props.color.purple,
                title: `${props.bot.name} ${!isManager ? state.locale.help.help : `${state.locale.help.help} ${state.locale.manager}`}`,
                url: props.bot.website,
                description: !isManager ? state.locale.help.description : state.locale.help.description_manager,
                thumbnail: { url: props.bot.icon },
                fields
              }
            ];
          } catch (err2) {
            createError("Help", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/modules/embedSender.ts
function sendEmbed(payload, embed2, options) {
  return __async(this, null, function* () {
    try {
      if (payload.interaction || payload.member) {
        const user = payload.member ? payload.member.user : client.users.resolve(payload.interaction.member.user.id);
        const guild = payload.member ? payload.member.guild : client.guilds.resolve(payload.interaction.guildId);
        let channel;
        if (options && options.guild && options.system)
          channel = guild.systemChannel;
        else if (options && options.guild && options.log) {
          const logChannel = states.get(payload.member ? payload.member.guild.id : payload.interaction.guildId).logChannel;
          if (!logChannel)
            return;
          channel = guild.channels.resolve(logChannel);
        } else if (payload.interaction)
          channel = guild.channels.resolve(payload.interaction.channelId);
        try {
          if (!options || options.dm)
            return (yield user.createDM()).send({
              embeds: [
                __spreadValues({
                  author: {
                    name: guild.name,
                    iconURL: guild.iconURL()
                  }
                }, embed2)
              ]
            });
          else if (!options.dm)
            return channel.send({
              embeds: [
                __spreadValues({
                  footer: {
                    text: user.tag,
                    iconURL: user.avatarURL()
                  }
                }, embed2)
              ]
            });
        } catch (err2) {
          if (!options.dm)
            return channel.send({
              embeds: [
                __spreadValues({
                  footer: {
                    text: user.tag,
                    iconURL: user.avatarURL()
                  }
                }, embed2)
              ]
            });
        }
      } else if (payload.message) {
      }
    } catch (err2) {
      createError("EmbedSender", err2, payload);
    }
  });
}
var init_embedSender = __esm({
  "src/modules/embedSender.ts"() {
    init_createError();
    init_app();
  }
});

// src/modules/voice/voiceConnect.ts
function voiceConnect(state, interaction) {
  return __async(this, null, function* () {
    try {
      const voiceChannel = client.guilds.resolve(interaction.guildId).members.resolve(interaction.member.user.id).voice.channel;
      if (!voiceChannel)
        return;
      else if (!voiceChannel.permissionsFor(client.user).has(["CONNECT", "SPEAK"])) {
        sendEmbed({ interaction }, {
          color: props.color.red,
          description: `\u274C **${state.locale.insufficientPerms.connect}**`
        }, { guild: true });
        throw new Error("Missing Permissions");
      }
      state.connection = yield (0, import_voice.joinVoiceChannel)({
        guildId: interaction.guildId,
        channelId: voiceChannel.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
      });
      if (state.timeout)
        clearTimeout(state.timeout);
      state.timeout = setTimeout(() => voiceDisconnect(state), props.disconnectTimeout);
    } catch (err2) {
      createError("VoiceConnect", err2, { interaction });
    }
  });
}
var import_voice;
var init_voiceConnect = __esm({
  "src/modules/voice/voiceConnect.ts"() {
    import_voice = require("@discordjs/voice");
    init_createError();
    init_embedSender();
    init_app();
    init_props();
    init_voice();
  }
});

// src/modules/voice/voiceDisconnect.ts
function voiceDisconnect(state, interaction) {
  return __async(this, null, function* () {
    try {
      if (!state.connection || !(0, import_voice3.getVoiceConnection)(state.guildId))
        return;
      state.isPlaying = false;
      (0, import_voice3.getVoiceConnection)(state.guildId).destroy();
      state.connection = null;
    } catch (err2) {
      createError("VoiceDisconnect", err2, { interaction });
    }
  });
}
var import_voice3;
var init_voiceDisconnect = __esm({
  "src/modules/voice/voiceDisconnect.ts"() {
    import_voice3 = require("@discordjs/voice");
    init_createError();
  }
});

// src/modules/voice/voiceStateCheck.ts
function voiceStateCheck(locale2, payload) {
  return __async(this, null, function* () {
    if (!client.guilds.resolve(payload.interaction ? payload.interaction.guildId : payload.message.guild.id).members.resolve(payload.interaction ? payload.interaction.member.user.id : payload.message.member.id).voice.channelId) {
      const guild = client.guilds.resolve(payload.interaction ? payload.interaction.guildId : payload.message.guild.id);
      sendEmbed(payload, {
        color: props.color.red,
        author: {
          name: guild.name,
          iconURL: guild.iconURL()
        },
        description: `\u274C **${locale2.music.joinVoiceChannel}**`
      });
      return true;
    }
    return false;
  });
}
var init_voiceStateCheck = __esm({
  "src/modules/voice/voiceStateCheck.ts"() {
    init_embedSender();
    init_app();
    init_props();
  }
});

// src/modules/voice/index.ts
var init_voice = __esm({
  "src/modules/voice/index.ts"() {
    init_voiceConnect();
    init_voiceDisconnect();
    init_voiceStateCheck();
  }
});

// src/commands/user/join.ts
var join;
var init_join = __esm({
  "src/commands/user/join.ts"() {
    init_voice();
    join = {
      name: "join",
      version: 1,
      execute(state, interaction) {
        voiceConnect(state, interaction);
      }
    };
  }
});

// src/commands/user/leave.ts
var leave;
var init_leave = __esm({
  "src/commands/user/leave.ts"() {
    init_voice();
    leave = {
      name: "leave",
      version: 1,
      execute(state, interaction) {
        voiceDisconnect(state, interaction);
      }
    };
  }
});

// src/modules/music/musicPause.ts
function musicPause(state, interaction) {
  return __async(this, null, function* () {
    try {
    } catch (err2) {
      createError("Pause", err2, { interaction });
    }
  });
}
var init_musicPause = __esm({
  "src/modules/music/musicPause.ts"() {
    init_createError();
  }
});

// src/modules/music/musicPlay.ts
function musicPlay(state, interaction) {
  return __async(this, null, function* () {
    try {
      if (yield voiceStateCheck(state.locale, { interaction }))
        return;
    } catch (err2) {
      createError("Play", err2, { interaction });
    }
  });
}
var init_musicPlay = __esm({
  "src/modules/music/musicPlay.ts"() {
    init_createError();
    init_voice();
  }
});

// src/modules/music/musicSkip.ts
function musicSkip(state, interaction) {
  return __async(this, null, function* () {
    try {
    } catch (err2) {
      createError("Skip", err2, { interaction });
    }
  });
}
var init_musicSkip = __esm({
  "src/modules/music/musicSkip.ts"() {
    init_createError();
  }
});

// src/modules/music/musicStop.ts
function musicStop(state, interaction) {
  return __async(this, null, function* () {
    try {
    } catch (err2) {
      createError("Stop", err2, { interaction });
    }
  });
}
var init_musicStop = __esm({
  "src/modules/music/musicStop.ts"() {
    init_createError();
  }
});

// src/modules/music/toggleLoop.ts
function toggleLoop(state, interaction) {
  return __async(this, null, function* () {
    try {
    } catch (err2) {
      createError("ToggleLoop", err2, { interaction });
    }
  });
}
var init_toggleLoop = __esm({
  "src/modules/music/toggleLoop.ts"() {
    init_createError();
  }
});

// src/modules/music/toggleRepeat.ts
function toggleRepeat(state, interaction) {
  return __async(this, null, function* () {
    try {
    } catch (err2) {
      createError("ToggleRepeat", err2, { interaction });
    }
  });
}
var init_toggleRepeat = __esm({
  "src/modules/music/toggleRepeat.ts"() {
    init_createError();
  }
});

// src/modules/music/index.ts
var init_music = __esm({
  "src/modules/music/index.ts"() {
    init_musicPause();
    init_musicPlay();
    init_musicSkip();
    init_musicStop();
    init_toggleLoop();
    init_toggleRepeat();
  }
});

// src/commands/user/loop.ts
var loop;
var init_loop = __esm({
  "src/commands/user/loop.ts"() {
    init_music();
    loop = {
      name: "loop",
      version: 1,
      execute(state, interaction) {
        toggleLoop(state, interaction);
      }
    };
  }
});

// src/commands/user/pause.ts
var pause;
var init_pause = __esm({
  "src/commands/user/pause.ts"() {
    init_music();
    pause = {
      name: "pause",
      version: 1,
      execute(state, interaction) {
        musicPause(state, interaction);
      }
    };
  }
});

// src/commands/user/play.ts
var play;
var init_play = __esm({
  "src/commands/user/play.ts"() {
    init_music();
    play = {
      name: "play",
      version: 2,
      options(locale2) {
        return [
          {
            type: 3,
            name: "query",
            description: locale2.music.options.query,
            required: false
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          musicPlay(state, interaction);
        });
      }
    };
  }
});

// src/commands/user/queue.ts
var queue;
var init_queue = __esm({
  "src/commands/user/queue.ts"() {
    init_createError();
    init_props();
    queue = {
      name: "queue",
      version: 1,
      execute(state, interaction) {
        try {
          if (state.queue.length) {
            const fields = [];
            for (const i in state.queue) {
              fields.push({ name: `#${i}`, value: state.queue[i].title });
            }
            fields.push({
              name: "\u200B",
              value: `${state.isPlaying ? "\u25B6\uFE0F" : "\u23F9"}${state.isLooped ? " \u{1F501}" : ""}${state.isRepeated ? " \u{1F502}" : ""}`
            });
            return [
              {
                color: props.color.purple,
                author: {
                  name: String(state.volume),
                  iconURL: props.icon.volume
                },
                title: `**${state.queue[0].title}**`,
                url: state.queue[0].videoURL,
                description: state.queue[0].channelName,
                thumbnail: { url: state.queue[0].thumbnailURL },
                fields
              }
            ];
          } else {
            return [
              {
                color: props.color.purple,
                description: `\u{1F5D1} **${state.locale.music.queueEmpty}**`
              }
            ];
          }
        } catch (err2) {
          createError("Queue", err2, { interaction });
        }
      }
    };
  }
});

// src/commands/user/repeat.ts
var repeat;
var init_repeat = __esm({
  "src/commands/user/repeat.ts"() {
    init_music();
    repeat = {
      name: "repeat",
      version: 1,
      execute(state, interaction) {
        return __async(this, null, function* () {
          toggleRepeat(state, interaction);
        });
      }
    };
  }
});

// src/commands/user/skip.ts
var skip;
var init_skip = __esm({
  "src/commands/user/skip.ts"() {
    init_music();
    skip = {
      name: "skip",
      version: 1,
      execute(state, interaction) {
        musicSkip(state, interaction);
      }
    };
  }
});

// src/commands/user/stop.ts
var stop;
var init_stop = __esm({
  "src/commands/user/stop.ts"() {
    init_music();
    stop = {
      name: "stop",
      version: 1,
      execute(state, interaction) {
        musicStop(state, interaction);
      }
    };
  }
});

// src/commands/user/tts.ts
var import_aws_sdk, import_config, polly, tts;
var init_tts = __esm({
  "src/commands/user/tts.ts"() {
    import_aws_sdk = require("aws-sdk");
    import_config = require("dotenv/config");
    new import_aws_sdk.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
    polly = new import_aws_sdk.Polly({
      region: "ap-northeast-2"
    });
    tts = {
      name: "tts",
      version: 1,
      options(locale2) {
        return [
          {
            type: 3,
            name: "text",
            description: locale2.text,
            required: true
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
        });
      }
    };
  }
});

// src/commands/user/volume.ts
var volume;
var init_volume = __esm({
  "src/commands/user/volume.ts"() {
    volume = {
      name: "volume",
      version: 1,
      options(locale2) {
        return [
          {
            type: 4,
            name: "value",
            description: "1~10",
            required: true,
            choices: [
              { name: 1, value: 1 },
              { name: 2, value: 2 },
              { name: 3, value: 3 },
              { name: 4, value: 4 },
              { name: 5, value: 5 },
              { name: 6, value: 6 },
              { name: 7, value: 7 },
              { name: 8, value: 8 },
              { name: 9, value: 9 },
              { name: 10, value: 10 }
            ]
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
        });
      }
    };
  }
});

// src/commands/user/index.ts
var user_exports = {};
__export(user_exports, {
  help: () => help,
  join: () => join,
  leave: () => leave,
  loop: () => loop,
  pause: () => pause,
  play: () => play,
  queue: () => queue,
  repeat: () => repeat,
  skip: () => skip,
  stop: () => stop,
  tts: () => tts,
  volume: () => volume
});
var init_user = __esm({
  "src/commands/user/index.ts"() {
    init_help();
    init_join();
    init_leave();
    init_loop();
    init_pause();
    init_play();
    init_queue();
    init_repeat();
    init_skip();
    init_stop();
    init_tts();
    init_volume();
  }
});

// src/services/firebase.ts
var import_firebase_admin, import_path, firestore;
var init_firebase = __esm({
  "src/services/firebase.ts"() {
    import_firebase_admin = __toESM(require("firebase-admin"));
    import_path = require("path");
    import_firebase_admin.default.initializeApp({
      credential: import_firebase_admin.default.credential.cert(require((0, import_path.resolve)(__dirname, "../firebase/hyunwoo-bot-5b9111af24ff.json")))
    });
    firestore = import_firebase_admin.default.firestore();
  }
});

// src/modules/checkPermission.ts
function checkPermission(locale2, payload, permission) {
  return __async(this, null, function* () {
    try {
      if (payload.interaction && payload.interaction.member.user.id === props.developerID || payload.message && payload.message.member.id === props.developerID)
        return false;
      if (payload.interaction && !client.guilds.resolve(payload.interaction.guildId).members.resolve(payload.interaction.member.user.id).permissions.has(permission)) {
        yield sendEmbed({ interaction: payload.interaction }, {
          description: `\u274C **${locale2.insufficientPerms[String(permission).toLowerCase()]}**`
        });
        return true;
      } else if (payload.message && !payload.message.guild.members.resolve(payload.message.member.id).permissions.has(permission)) {
        yield sendEmbed({ message: payload.message }, {
          description: `\u274C **${locale2.insufficientPerms[String(permission).toLowerCase()]}**`
        });
        return true;
      }
      return false;
    } catch (err2) {
      createError("CheckPermission", err2, payload);
    }
  });
}
var init_checkPermission = __esm({
  "src/modules/checkPermission.ts"() {
    init_createError();
    init_embedSender();
    init_app();
    init_props();
  }
});

// src/commands/manager/autorole.ts
var import_builders, autorole;
var init_autorole = __esm({
  "src/commands/manager/autorole.ts"() {
    init_createError();
    init_firebase();
    init_checkPermission();
    init_props();
    import_builders = require("@discordjs/builders");
    autorole = {
      name: "autorole",
      version: 1,
      slashCommand(locale2) {
        return new import_builders.SlashCommandBuilder().setName(autorole.name).setDescription(locale2.help[autorole.name]).addSubcommand((subcommand) => subcommand.setName("view").setDescription(`${locale2.manager} ${locale2.autoRole.options.view}`)).addSubcommand((subcommandGroup) => subcommandGroup.setName("add").setDescription(`${locale2.manager} ${locale2.autoRole.options.add}`).addUserOption((option) => option.setName("type").setDescription("User/Bot").setRequired(true)));
      },
      options(locale2) {
        return [
          {
            type: 1,
            name: "view",
            description: `${locale2.manager} ${locale2.autoRole.options.view}`
          },
          {
            type: 1,
            name: "add",
            description: `${locale2.manager} ${locale2.autoRole.options.add}`,
            options: [
              {
                type: 3,
                name: "type",
                description: "User/Bot",
                required: true,
                choices: [
                  { name: "user", value: "user" },
                  { name: "bot", value: "bot" }
                ]
              },
              { type: 8, name: "role", description: locale2.role, required: true }
            ]
          },
          {
            type: 1,
            name: "purge",
            description: `${locale2.manager} ${locale2.autoRole.options.purge}`
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { interaction }, "MANAGE_ROLES"))
              throw new Error("Missing Permissions");
            const method = interaction.data.options[0].name;
            if (method === "view") {
            } else if (method === "add") {
              state.autoRoles.push({
                type: interaction.data.options[0].options[0].value,
                role: interaction.data.options[0].options[1].value
              });
              yield firestore.collection(interaction.guildId).doc("config").update({ autoRoles: state.autoRoles });
            } else if (method === "purge") {
              state.autoRoles = [];
              yield firestore.collection(interaction.guildId).doc("config").update({ autoRoles: [] });
            }
            const fields = [];
            if (state.autoRoles.length >= 1)
              for (const autoRole of state.autoRoles) {
                fields.push({ name: autoRole.type, value: `<@&${autoRole.role}>` });
              }
            return [
              {
                color: props.color.yellow,
                title: `**\u2699\uFE0F ${state.locale.autoRole.autoRole}**`,
                fields: fields.length >= 1 ? fields : [{ name: "\u200B", value: state.locale.autoRole.empty }]
              }
            ];
          } catch (err2) {
            createError("AutoRole", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/commands/manager/delete.ts
var deleteMessage;
var init_delete = __esm({
  "src/commands/manager/delete.ts"() {
    init_createError();
    init_checkPermission();
    init_app();
    init_props();
    deleteMessage = {
      name: "delete",
      version: 2,
      options(locale2) {
        return [
          {
            type: 4,
            name: "amount",
            description: "1~100",
            required: true
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { interaction }, "MANAGE_MESSAGES"))
              throw new Error("Missing Permissions");
            yield client.channels.resolve(interaction.channelId).bulkDelete(Number(interaction.data.options[0].value));
            return [
              {
                color: props.color.purple,
                description: `\u{1F5D1} **${interaction.data.options[0].value}${state.locale.delete.deleted}**`
              }
            ];
          } catch (err2) {
            createError("Delete", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/commands/manager/disconnect.ts
var disconnect;
var init_disconnect = __esm({
  "src/commands/manager/disconnect.ts"() {
    init_createError();
    init_checkPermission();
    init_app();
    init_props();
    disconnect = {
      name: "disconnect",
      version: 2,
      options(locale2) {
        return [{ type: 6, name: "user", description: locale2.user, required: true }];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { interaction }, "MOVE_MEMBERS"))
              throw new Error("Missing Permissions");
            const voiceChannel = client.guilds.resolve(interaction.guildId).members.resolve(interaction.data.options[0].value).voice.channel.name;
            yield client.guilds.resolve(interaction.guild_id).members.resolve(interaction.data.options[0].value).voice.disconnect(`[Disconnect] Executed by ${interaction.member.user.username}#${interaction.member.user.discriminator}}`);
            return [
              {
                color: props.color.purple,
                title: `**\u2699\uFE0F ${state.locale.disconnect.disconnect}**`,
                description: `\u2705 **${state.locale.disconnect.disconnected.replace("{voiceChannel}", voiceChannel).replace("{cnt}", "1")}**`
              }
            ];
          } catch (err2) {
            createError("Disconnect", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/commands/manager/disconnectall.ts
var disconnectall;
var init_disconnectall = __esm({
  "src/commands/manager/disconnectall.ts"() {
    init_createError();
    init_checkPermission();
    init_app();
    init_props();
    disconnectall = {
      name: "disconnectall",
      version: 1,
      options(locale2) {
        return [{ type: 7, name: "voice_channel", description: locale2.voiceChannel, required: true }];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { interaction }, "MOVE_MEMBERS"))
              throw new Error("Missing Permissions");
            const channel = client.channels.resolve(interaction.data.options[0].value);
            if (channel.type !== "GUILD_VOICE" && channel.type !== "GUILD_STAGE_VOICE")
              return [
                {
                  color: props.color.red,
                  title: `**\u2699\uFE0F ${state.locale.disconnect.disconnect}**`,
                  description: `\u274C **${state.locale.notVoiceChannel}**`
                }
              ];
            const cnt = channel.members.size;
            if (cnt <= 0)
              return;
            for (const [key, member] of channel.members) {
              try {
                yield member.voice.disconnect(`[DisconnectAll] Executed by ${interaction.member.user.username}#${interaction.member.user.discriminator}}`);
              } catch (err2) {
              }
            }
            return [
              {
                color: props.color.purple,
                title: `**\u2699\uFE0F ${state.locale.disconnect.disconnect}**`,
                description: `\u2705 **${state.locale.disconnect.disconnected.replace("{voiceChannel}", client.guilds.resolve(interaction.guild_id).channels.resolve(interaction.data.options[0].value).name).replace("{cnt}", String(cnt))}**`
              }
            ];
          } catch (err2) {
            createError("DisconnectAll", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/modules/converter/getChannelID.ts
function getChannelID(guild, arg) {
  if (arg.startsWith("<#"))
    arg = arg.slice(2, -1);
  return guild.channels.cache.find((channel) => channel.id === arg || channel.name.toLowerCase() === arg.toLowerCase()).id;
}
var init_getChannelID = __esm({
  "src/modules/converter/getChannelID.ts"() {
  }
});

// src/modules/converter/getEmojiFromHex.ts
var init_getEmojiFromHex = __esm({
  "src/modules/converter/getEmojiFromHex.ts"() {
  }
});

// src/modules/converter/getHexFromEmoji.ts
function getHexFromEmoji(emoji) {
  return emoji.codePointAt(0).toString(16);
}
var init_getHexFromEmoji = __esm({
  "src/modules/converter/getHexFromEmoji.ts"() {
  }
});

// src/modules/converter/getLength.ts
var init_getLength = __esm({
  "src/modules/converter/getLength.ts"() {
  }
});

// src/modules/converter/index.ts
var init_converter = __esm({
  "src/modules/converter/index.ts"() {
    init_getChannelID();
    init_getEmojiFromHex();
    init_getHexFromEmoji();
    init_getLength();
  }
});

// src/commands/manager/edit.ts
var edit;
var init_edit = __esm({
  "src/commands/manager/edit.ts"() {
    init_converter();
    init_createError();
    init_checkPermission();
    edit = {
      name: "edit",
      messageOnly: true,
      execute(state, message, args) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { message }, "MANAGE_MESSAGES"))
              throw new Error("Missing Permissions");
            const embed2 = JSON.parse(args.slice(2).join(" "));
            const _message = yield message.guild.channels.resolve(getChannelID(message.guild, args[0])).messages.fetch(args[1]);
            yield _message.edit({ embeds: [embed2] });
            return message.react("\u2705");
          } catch (err2) {
            message.react("\u274C");
            createError("Edit", err2, { message });
          }
        });
      }
    };
  }
});

// src/commands/manager/embed.ts
var embed;
var init_embed = __esm({
  "src/commands/manager/embed.ts"() {
    init_converter();
    init_createError();
    init_checkPermission();
    embed = {
      name: "embed",
      messageOnly: true,
      execute(state, message, args) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { message }, "MANAGE_MESSAGES"))
              throw new Error("Missing Permissions");
            const embed2 = JSON.parse(args.slice(1).join(" "));
            yield message.guild.channels.resolve(getChannelID(message.guild, args[0])).send({ embeds: [embed2] });
            return message.react("\u2705");
          } catch (err2) {
            message.react("\u274C");
            createError("Embed", err2, { message });
          }
        });
      }
    };
  }
});

// src/commands/manager/locale.ts
var choices, _a, locale;
var init_locale = __esm({
  "src/commands/manager/locale.ts"() {
    init_createError();
    init_embedSender();
    init_firebase();
    init_checkPermission();
    init_app();
    init_props();
    choices = [];
    for (const [code, locale2] of Object.entries((_a = locales) != null ? _a : {})) {
      choices.push({ name: locale2.locale.name, value: code });
    }
    locale = {
      name: "locale",
      version: 1,
      options(locale2) {
        return [
          {
            type: 3,
            name: "locale",
            description: locale2.locale.locale,
            required: true,
            choices
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { interaction }, "MANAGE_GUILD"))
              throw new Error("Missing Permissions");
            const newLocale = interaction.data.options[0].value;
            if (state.locale.locale.code === newLocale)
              return [
                {
                  color: props.color.red,
                  description: `\u274C **${state.locale.locale.noChange}**`
                }
              ];
            const _message = yield sendEmbed({ interaction }, {
              color: props.color.orange,
              description: `\u2755 **${state.locale.locale.pending}**`
            }, { guild: true });
            state.locale = locales.get(newLocale);
            const payload = {};
            for (const [name, command] of userCommands) {
              try {
                payload[name] = {
                  id: (yield client.api.applications(process.env.APPLICATION).guilds(interaction.guild_id).commands.post({
                    data: {
                      name,
                      description: state.locale.help[name],
                      options: command.options ? command.options(state.locale) : []
                    }
                  })).id,
                  name,
                  version: command.version
                };
              } catch (err2) {
                createError(`ChangeLocale > CommandRegister > [${name}]`, err2, {
                  interaction
                });
              }
            }
            for (const [name, command] of managerCommands) {
              try {
                if (command.messageOnly)
                  continue;
                payload[name] = {
                  id: (yield client.api.applications(process.env.APPLICATION).guilds(interaction.guild_id).commands.post({
                    data: {
                      name,
                      description: `${state.locale.manager} ${state.locale.help[name]}`,
                      options: command.options ? command.options(state.locale) : []
                    }
                  })).id,
                  name,
                  version: command.version
                };
              } catch (err2) {
                createError(`ChangeLocale > CommandRegister > Manager > [${name}]`, err2, {
                  interaction
                });
              }
            }
            yield firestore.collection(interaction.guild_id).doc("config").update({ locale: newLocale });
            yield firestore.collection(interaction.guild_id).doc("commands").update(payload);
            yield _message.delete();
            return [
              {
                color: props.color.green,
                description: `\u2705 **${state.locale.locale.changed}**`
              }
            ];
          } catch (err2) {
            createError("ChangeLocale", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/commands/manager/log.ts
var log2;
var init_log = __esm({
  "src/commands/manager/log.ts"() {
    init_createError();
    init_firebase();
    init_checkPermission();
    init_props();
    log2 = {
      name: "log",
      version: 2,
      options(locale2) {
        return [
          {
            type: 7,
            name: "text_channel",
            description: locale2.textChannel,
            required: true
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { interaction }, "MANAGE_MESSAGES"))
              throw new Error("Missing Permissions");
            yield firestore.collection(interaction.guildId).doc("config").update({ logChannel: interaction.data.options[0].value });
            return [
              {
                color: props.color.green,
                title: `**\u{1F4E6} ${state.locale.log.log}**`,
                description: `\u2705 **${state.locale.log.set}<#${interaction.data.options[0].value}>**`
              }
            ];
          } catch (err2) {
            createError("Log", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/commands/manager/move.ts
var move;
var init_move = __esm({
  "src/commands/manager/move.ts"() {
    init_createError();
    init_checkPermission();
    init_app();
    init_props();
    move = {
      name: "move",
      version: 4,
      options(locale2) {
        return [
          {
            type: 6,
            name: "user",
            description: locale2.user,
            required: true
          },
          {
            type: 7,
            name: "to",
            description: locale2.voiceChannel,
            required: true
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { interaction }, "MOVE_MEMBERS"))
              throw new Error("Missing Permissions");
            const guild = client.guilds.resolve(interaction.guildId);
            const member = guild.members.resolve(interaction.data.options[0].value);
            const targetChannel = guild.channels.resolve(interaction.data.options[1].value);
            const prevChannel = member.voice.channel.name;
            if (targetChannel.type !== "GUILD_VOICE" && targetChannel.type !== "GUILD_STAGE_VOICE")
              return [
                {
                  color: props.color.red,
                  title: `**\u2699\uFE0F ${state.locale.move.move}**`,
                  description: `\u274C **${state.locale.notVoiceChannel}**`
                }
              ];
            yield member.voice.setChannel(targetChannel, `[Move] Executed by ${interaction.member.user.username}#${interaction.member.user.discriminator}`);
            return [
              {
                color: props.color.green,
                title: `**\u2699\uFE0F ${state.locale.move.move}**`,
                description: `\u2705 **1${state.locale.move.moved}${prevChannel} \u27A1\uFE0F ${targetChannel.name}**`
              }
            ];
          } catch (err2) {
            createError("Move", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/commands/manager/moveall.ts
var moveall;
var init_moveall = __esm({
  "src/commands/manager/moveall.ts"() {
    init_createError();
    init_checkPermission();
    init_app();
    init_props();
    moveall = {
      name: "moveall",
      version: 2,
      options(locale2) {
        return [
          {
            type: 7,
            name: "from",
            description: locale2.voiceChannel,
            required: true
          },
          {
            type: 7,
            name: "to",
            description: locale2.voiceChannel,
            required: true
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { interaction }, "MOVE_MEMBERS"))
              throw new Error("Missing Permissions");
            const guild = client.guilds.resolve(interaction.guildId);
            const fromChannel = guild.channels.resolve(interaction.data.options[0].value);
            const targetChannel = guild.channels.resolve(interaction.data.options[1].value);
            if (fromChannel.type !== "GUILD_VOICE" && fromChannel.type !== "GUILD_STAGE_VOICE" || targetChannel.type !== "GUILD_VOICE" && targetChannel.type !== "GUILD_STAGE_VOICE")
              return [
                {
                  color: props.color.red,
                  title: `**\u2699\uFE0F ${state.locale.move.move}**`,
                  description: `\u274C **${state.locale.notVoiceChannel}**`
                }
              ];
            const cnt = fromChannel.members.size;
            if (cnt <= 0)
              return;
            for (const [key, member] of fromChannel.members) {
              try {
                yield member.voice.setChannel(targetChannel, `[MoveAll] Executed by ${interaction.member.user.username}#${interaction.member.user.discriminator}`);
              } catch (err2) {
              }
            }
            return [
              {
                color: props.color.green,
                title: `**\u2699\uFE0F ${state.locale.move.move}**`,
                description: `\u2705 **${cnt}${state.locale.move.moved}${fromChannel.name} \u27A1\uFE0F ${targetChannel.name}**`
              }
            ];
          } catch (err2) {
            createError("MoveAll", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/commands/manager/privateroom.ts
var privateroom;
var init_privateroom = __esm({
  "src/commands/manager/privateroom.ts"() {
    init_createError();
    init_firebase();
    init_checkPermission();
    init_app();
    init_props();
    privateroom = {
      name: "privateroom",
      version: 2,
      options(locale2) {
        return [
          {
            type: 7,
            name: "fallback_voice_channel",
            description: locale2.voiceChannel,
            required: false
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { interaction }, "MANAGE_CHANNELS"))
              throw new Error("Missing Permissions");
            if (interaction.data.options && client.channels.resolve(interaction.data.options[0].value).type !== "GUILD_VOICE")
              return [
                {
                  color: props.color.red,
                  title: `**\u2699\uFE0F ${state.locale.privateRoom.privateRoom}**`,
                  description: `\u274C **${state.locale.notVoiceChannel}**`
                }
              ];
            const guild = client.guilds.resolve(interaction.guildId);
            const privateRoomID = (yield guild.channels.create(state.locale.privateRoom.create, {
              type: "GUILD_VOICE",
              userLimit: 1,
              permissionOverwrites: [
                {
                  type: "member",
                  id: client.user.id,
                  allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT", "MOVE_MEMBERS"]
                },
                {
                  type: "role",
                  id: guild.roles.everyone.id,
                  deny: ["CREATE_INSTANT_INVITE", "SPEAK"]
                }
              ]
            })).id;
            yield firestore.collection(guild.id).doc("config").update({
              privateRoom: {
                generator: privateRoomID,
                fallback: interaction.data.options ? interaction.data.options[0].value : null
              }
            });
            return [
              {
                color: props.color.green,
                title: `**${state.locale.privateRoom.privateRoom}**`,
                description: `\u2705 **${state.locale.privateRoom.set}**`
              }
            ];
          } catch (err2) {
            createError("PrivateRoom", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/commands/manager/reactionrole.ts
var reactionrole;
var init_reactionrole = __esm({
  "src/commands/manager/reactionrole.ts"() {
    init_converter();
    init_createError();
    init_firebase();
    init_checkPermission();
    init_app();
    reactionrole = {
      name: "reactionrole",
      version: 1,
      options(locale2) {
        return [
          {
            type: 1,
            name: "view",
            description: `${locale2.manager} ${locale2.reactionRole.options.view}`
          },
          {
            type: 1,
            name: "add",
            description: `${locale2.manager} ${locale2.reactionRole.options.add}`,
            options: [
              {
                type: 3,
                name: "message_id",
                description: locale2.messageID,
                required: true
              },
              {
                type: 3,
                name: "emoji",
                description: locale2.emoji,
                required: true
              },
              { type: 8, name: "role", description: locale2.role, required: true }
            ]
          },
          {
            type: 1,
            name: "remove",
            description: `${locale2.manager} ${locale2.reactionRole.options.remove}`,
            options: [
              {
                type: 3,
                name: "message_id",
                description: locale2.messageID,
                required: true
              },
              {
                type: 3,
                name: "emoji",
                description: locale2.emoji,
                required: true
              }
            ]
          },
          {
            type: 1,
            name: "purge",
            description: `${locale2.manager} ${locale2.reactionRole.options.purge}`
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { interaction }, "MANAGE_MESSAGES"))
              throw new Error("Missing Permissions");
            const guild = client.guilds.resolve(interaction.guildId);
            const channel = guild.channels.resolve(interaction.channelId);
            const method = interaction.data.options[0].name;
            const messageID = interaction.data.options[0].options[0].value;
            const emoji = interaction.data.options[0].options[1].value;
            const role = interaction.data.options[0].options[2].value;
            const _message = yield channel.messages.fetch(messageID);
            if (method === "add") {
              try {
                yield _message.react(emoji);
                state.reactionRoles.push({
                  textChannel: channel.id,
                  message: _message.id,
                  emoji: getHexFromEmoji(emoji),
                  role
                });
                return yield firestore.collection(guild.id).doc(channel.id).update({ reactionRoles: state.reactionRoles });
              } catch (err2) {
                createError("ReactionRole > Add", err2, { interaction });
              }
            } else if (method === "remove") {
              try {
                const idx = state.reactionRoles.findIndex((reactionRole) => reactionRole.emoji === getHexFromEmoji(emoji));
                if (idx === -1)
                  throw createError("ReactionRole > Remove", "ReactionRole Not Found", {
                    interaction
                  });
                state.reactionRoles.splice(idx, 1);
                yield firestore.collection(guild.id).doc(channel.id).update({ reactionRoles: state.reactionRoles });
                return yield _message.reactions.cache.get(emoji).remove();
              } catch (err2) {
                createError("ReactionRole > Remove", err2, { interaction });
              }
            } else if (method === "purge") {
              try {
                state.reactionRoles = [];
                yield firestore.collection(guild.id).doc(channel.id).update({ reactionRoles: [] });
                return yield _message.reactions.removeAll();
              } catch (err2) {
                createError("ReactionRole > Purge", err2, { interaction });
              }
            }
          } catch (err2) {
            createError("ReactionRole", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/commands/manager/setafktimeout.ts
var setafktimeout;
var init_setafktimeout = __esm({
  "src/commands/manager/setafktimeout.ts"() {
    init_createError();
    init_firebase();
    init_checkPermission();
    init_props();
    setafktimeout = {
      name: "setafktimeout",
      version: 1,
      options(locale2) {
        return [
          {
            type: 4,
            name: "minutes",
            description: locale2.afkTimeout.options.minutesToDisconnect,
            required: true
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { interaction }, "MANAGE_GUILD"))
              throw new Error("Missing Permissions");
            yield firestore.collection(interaction.guildId).doc("config").update({ afkTimeout: interaction.data.options[0].value });
            return [
              {
                color: props.color.green,
                title: `**${state.locale.afkTimeout.afkTimeout}**`,
                description: `\u2705 **${state.locale.afkTimeout.set.replace("{min}", interaction.data.options[0].value)}**`
              }
            ];
          } catch (err2) {
            createError("SetAfkTimeout", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/commands/manager/userrole.ts
var userrole;
var init_userrole = __esm({
  "src/commands/manager/userrole.ts"() {
    init_createError();
    init_firebase();
    init_checkPermission();
    init_app();
    init_props();
    userrole = {
      name: "userrole",
      version: 2,
      options(locale2) {
        return [
          {
            type: 1,
            name: "view",
            description: `${locale2.manager} ${locale2.userRole.options.view}`
          },
          {
            type: 1,
            name: "add",
            description: `${locale2.manager} ${locale2.userRole.options.add}`,
            options: [
              {
                type: 8,
                name: "role",
                description: locale2.role,
                required: true
              }
            ]
          },
          {
            type: 1,
            name: "remove",
            description: `${locale2.manager} ${locale2.userRole.options.remove}`,
            options: [
              {
                type: 8,
                name: "role",
                description: locale2.role,
                required: true
              }
            ]
          },
          {
            type: 1,
            name: "purge",
            description: `${locale2.manager} ${locale2.userRole.options.purge}`
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { interaction }, "MANAGE_ROLES"))
              throw new Error("Missing Permissions");
            const guild = client.guilds.resolve(interaction.guildId);
            const configDocRef = firestore.collection(guild.id).doc("config");
            const method = interaction.data.options[0].name;
            if (method === "view") {
            } else if (method === "add") {
              state.userRoles.push({
                id: guild.roles.resolveId(interaction.data.options[0].options[0].value),
                name: guild.roles.resolve(interaction.data.options[0].options[0].value).name,
                color: guild.roles.resolve(interaction.data.options[0].options[0].value).color === 0 ? null : guild.roles.resolve(interaction.data.options[0].options[0].value).hexColor
              });
              const payload = [];
              for (const userRole of state.userRoles) {
                payload[guild.roles.cache.get(userRole.id).rawPosition] = userRole;
              }
              state.userRoles = payload.filter((userRole) => userRole).reverse();
              yield configDocRef.update({ userRoles: state.userRoles });
            } else if (method === "remove") {
              const idx = state.userRoles.findIndex((userRole) => userRole.id === interaction.data.options[0].options[0].value);
              if (idx === -1)
                throw createError("UserRole > Remove", "UserRole Not Found", {
                  interaction
                });
              state.userRoles.splice(idx, 1);
              yield configDocRef.update({ userRoles: state.userRoles });
            } else if (method === "purge") {
              state.userRoles = [];
              yield configDocRef.update({ userRoles: [] });
            }
            let description = "";
            if (state.userRoles.length >= 1)
              state.userRoles.forEach((userRole) => description += `
<@&${userRole.id}>`);
            else
              description = state.locale.userRole.empty;
            return [
              {
                color: props.color.yellow,
                title: `**\u2699\uFE0F ${state.locale.userRole.userRole}**`,
                description
              }
            ];
          } catch (err2) {
            createError("UserRole", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/commands/manager/voicerole.ts
var voicerole;
var init_voicerole = __esm({
  "src/commands/manager/voicerole.ts"() {
    init_createError();
    init_firebase();
    init_checkPermission();
    init_app();
    init_props();
    voicerole = {
      name: "voicerole",
      version: 2,
      options(locale2) {
        return [
          {
            type: 1,
            name: "view",
            description: `${locale2.manager} ${locale2.voiceRole.options.view}`
          },
          {
            type: 1,
            name: "add",
            description: `${locale2.manager} ${locale2.voiceRole.options.add}`,
            options: [
              {
                type: 7,
                name: "voice_channel",
                description: locale2.voiceChannel,
                required: true
              },
              {
                type: 8,
                name: "role",
                description: locale2.role,
                required: true
              },
              {
                type: 7,
                name: "text_channel",
                description: locale2.voiceRole.options.channelToSendLogs,
                required: false
              }
            ]
          },
          {
            type: 1,
            name: "remove",
            description: `${locale2.manager} ${locale2.voiceRole.options.remove}`,
            options: [
              {
                type: 7,
                name: "voice_channel",
                description: locale2.voiceChannel,
                required: true
              }
            ]
          },
          {
            type: 1,
            name: "purge",
            description: `${locale2.manager} ${locale2.voiceRole.options.purge}`
          },
          {
            type: 1,
            name: "update",
            description: `${locale2.manager} ${locale2.voiceRole.options.update}`
          }
        ];
      },
      execute(state, interaction) {
        return __async(this, null, function* () {
          try {
            if (yield checkPermission(state.locale, { interaction }, "MANAGE_ROLES"))
              throw new Error("Missing Permissions");
            const guild = client.guilds.resolve(interaction.guildId);
            const configDocRef = firestore.collection(guild.id).doc("config");
            const method = interaction.data.options[0].name;
            if (method === "view") {
            } else if (method === "add") {
              const voiceChannel = interaction.data.options[0].options[0].value;
              if (!voiceChannel || client.channels.resolve(voiceChannel).type !== "GUILD_VOICE")
                return [
                  {
                    color: props.color.red,
                    title: `**\u2699\uFE0F ${state.locale.voiceRole.voiceRole}**`,
                    description: `\u274C **${state.locale.notVoiceChannel}**`
                  }
                ];
              const textChannel = interaction.data.options[0].options.length >= 3 ? interaction.data.options[0].options[2].value : null;
              if (textChannel && client.channels.resolve(textChannel).type !== "GUILD_TEXT")
                return [
                  {
                    color: props.color.red,
                    title: `**\u2699\uFE0F ${state.locale.voiceRole.voiceRole}**`,
                    description: `\u274C **${state.locale.notTextChannel}**`
                  }
                ];
              state.voiceRoles.push({
                voiceChannel,
                role: interaction.data.options[0].options[1].value,
                textChannel
              });
              yield configDocRef.update({ voiceRoles: state.voiceRoles });
            } else if (method === "remove") {
              const voiceChannel = interaction.data.options[0].options[0].value;
              if (client.channels.resolve(voiceChannel).type !== "GUILD_VOICE")
                return [
                  {
                    color: props.color.red,
                    title: `**\u2699\uFE0F ${state.locale.voiceRole.voiceRole}**`,
                    description: `\u274C **${state.locale.notVoiceChannel}**`
                  }
                ];
              const idx = state.voiceRoles.findIndex((voiceRole) => voiceRole.voiceChannel === voiceChannel);
              if (idx === -1)
                throw createError("VoiceRole > Remove", "VoiceRole Not Found", {
                  interaction
                });
              state.voiceRoles.splice(idx, 1);
              yield configDocRef.update({ voiceRoles: state.voiceRoles });
            } else if (method === "purge") {
              state.voiceRoles = [];
              yield configDocRef.update({ voiceRoles: [] });
            } else if (method === "update") {
              const payload = [];
              for (const voiceRole of state.voiceRoles) {
                if (!client.channels.cache.has(voiceRole.voiceChannel))
                  continue;
                for (const [memberID, member] of client.guilds.resolve(interaction.v).roles.resolve(voiceRole.role).members) {
                  if (member.voice.channelId === voiceRole.voiceChannel)
                    continue;
                  yield member.roles.remove(voiceRole.role, "[VoiceRole] Force Update");
                  payload.push({ member: memberID, action: "-=", role: voiceRole.role });
                }
                for (const [memberID, member] of Object.entries(client.guilds.resolve(interaction.guildId).channels.resolve(voiceRole.voiceChannel).members)) {
                  if (member.user.bot || member.roles.cache.has(voiceRole.role))
                    continue;
                  yield member.roles.add(voiceRole.role, "[VoiceRole] Force Update");
                  payload.push({ member: memberID, action: "+=", role: voiceRole.role });
                }
              }
              let description = payload.length ? `\u2705 **${state.locale.voiceRole.updated.replace("{cnt}", String(payload.length))}**` : `\u{1F645} **${state.locale.voiceRole.noChanges}**
`;
              payload.forEach((item) => description += `
<@${item.member}> **${item.action}** <@&${item.role}>`);
              return [
                {
                  color: props.color.purple,
                  title: `**\u2699\uFE0F ${state.locale.voiceRole.voiceRole}**`,
                  description
                }
              ];
            }
            const fields = [];
            if (state.voiceRoles && state.voiceRoles.length >= 1)
              state.voiceRoles.forEach((voiceRole) => fields.push({
                name: `${guild.channels.resolve(voiceRole.voiceChannel).name}`,
                value: `<@&${voiceRole.role}>${voiceRole.textChannel ? `(<#${voiceRole.textChannel}>)` : ""}`
              }));
            return [
              {
                color: props.color.yellow,
                title: `**\u2699\uFE0F ${state.locale.voiceRole.voiceRole}**`,
                fields: fields.length >= 1 ? fields : [{ name: "\u200B", value: state.locale.voiceRole.empty }]
              }
            ];
          } catch (err2) {
            createError("VoiceRole", err2, { interaction });
          }
        });
      }
    };
  }
});

// src/commands/manager/index.ts
var manager_exports = {};
__export(manager_exports, {
  autorole: () => autorole,
  delete: () => deleteMessage,
  disconnect: () => disconnect,
  disconnectall: () => disconnectall,
  edit: () => edit,
  embed: () => embed,
  locale: () => locale,
  log: () => log2,
  move: () => move,
  moveall: () => moveall,
  privateroom: () => privateroom,
  reactionrole: () => reactionrole,
  setafktimeout: () => setafktimeout,
  userrole: () => userrole,
  voicerole: () => voicerole
});
var init_manager = __esm({
  "src/commands/manager/index.ts"() {
    init_autorole();
    init_delete();
    init_disconnect();
    init_disconnectall();
    init_edit();
    init_embed();
    init_locale();
    init_log();
    init_move();
    init_moveall();
    init_privateroom();
    init_reactionrole();
    init_setafktimeout();
    init_userrole();
    init_voicerole();
  }
});

// src/locales/en.ts
var en;
var init_en = __esm({
  "src/locales/en.ts"() {
    en = {
      done: "Done",
      on: "ON",
      off: "OFF",
      manager: "[Manager]",
      scope: "Scope",
      user: "User",
      member: "Member",
      role: "Role",
      text: "Text",
      textChannel: "TextChannel",
      voiceChannel: "VoiceChannel",
      notTextChannel: "Not a text channel.",
      notVoiceChannel: "Not a voice channel.",
      messageID: "MessageID",
      embed: "Embed",
      emoji: "Emoji",
      minute: "m",
      locale: {
        locale: "Locale",
        code: "en",
        name: "English",
        noChange: "No changes have been made.",
        pending: "Currently updating locale configuration. Please wait.",
        changed: "Locale updated."
      },
      usage: {
        help: "[manager]",
        play: "[query|URL]",
        tts: "<text>",
        volume: "<1~10>",
        alarm: "<subscribe|unsubscribe|test>",
        autorole: "<view|add|purge> [user|bot] [role]",
        delete: "<amount>",
        disconnect: "<user>",
        disconnectall: "<voiceChannel>",
        edit: "<textChannel> <messageID> <messageEmbed>",
        embed: "<textChannel> <messageEmbed>",
        locale: "<code>",
        log: "<textChannel>",
        move: "<user> <targetVoiceChannel>",
        moveall: "<fromVoiceChannel> <targetVoiceChannel>",
        privateroom: "[fallbackVoiceChannel]",
        reactionrole: "<view|add|remove|purge> <textChannel> <messageID> [emoji] [role]",
        setafktimeout: "<minute(s)>",
        userrole: "<view|add|remove|purge> [role]",
        voicerole: "<view|add|remove|purge|update> <voiceChannel> <role> [textChannel]"
      },
      help: {
        help: "Help",
        description: "List of commands and descriptions you can use.\n(For manager commands, add 'manager' for the argument)\n<Required> [Optional]",
        description_manager: "List of commands and descriptions which managers can use.\n<Required> [Optional]",
        join: "Join a voice channel you are in",
        leave: "Disconnect from a voice channel you are in",
        loop: "Toggle loop for the queue",
        pause: "Pause the song",
        play: "Play/enqueue a music",
        queue: "Show queue",
        repeat: "Toggle repeat",
        skip: "Skip current music",
        stop: "Stop the music",
        tts: "Send a TTS to a voice channel you are in",
        volume: "Change the volume",
        alarm: "Send hourly alarms to a voice channel",
        autorole: "Give roles when a member/bot joins the server",
        delete: "Bulk delete messages",
        disconnect: "Disconnect a specific user from a voice channel",
        disconnectall: "Disconnect all users from a voice channel",
        edit: "Edit a previous embed that I sent",
        embed: "Create an embed",
        locale: "Change the default locale for the server",
        log: "Set a text channel for logging",
        move: "Move a specific user to a voice channel",
        moveall: "Move all users to another voice channel",
        privateroom: "Initalize a private room generator channel",
        reactionrole: "Add/remove a reaction role",
        setafktimeout: "Set minutes to kick AFK users",
        userrole: "Set user assignable roles in dashboard",
        voicerole: "Give a role when someone joins a voice channel"
      },
      insufficientPerms: {
        administrator: "You need an administrator permission to perform this command.",
        manage_guild: "You don't have permission to manage the guild.",
        manage_channels: "You don't have permission to manage channels.",
        manage_roles: "You don't have permission to manage roles.",
        manage_messages: "You don't have permission to manage messages.",
        move_members: "You don't have permission to move members.",
        connect: "I don't have permissions to Connect and Speak."
      },
      afkTimeout: {
        afkTimeout: "AFK Timeout",
        set: "AFK Timeout has been updated: {min} minutes",
        disconnected: " was disconnected due to inactivity.",
        disconnected_dm: "You've been disconnected due to inactivity.",
        countdownStarted: "AFK Timeout Countdown Started({min} minutes)",
        options: {
          minutesToDisconnect: "Minutes to Timeout"
        }
      },
      alarm: {
        options: {
          subscribe: "Subscribe to hourly alarm",
          unsubscribe: "Unsubscribe to hourly alarm",
          test: "Test hourly alarm"
        }
      },
      autoRole: {
        autoRole: "Auto Roles",
        empty: "No roles have been set.",
        roleAppended: "Role Append [AutoRole]",
        options: {
          view: "View AutoRole Config",
          add: "Add AutoRole Config",
          purge: "Purge AutoRole Config"
        }
      },
      delete: {
        deleted: " Messages have been deleted."
      },
      disconnect: {
        disconnect: "Disconnect",
        disconnected: "Disconnected {cnt}user(s) from {voiceChannel}"
      },
      music: {
        joinVoiceChannel: "To use this command, join a voice channel.",
        currentlyPlaying: "Currently playing a song.",
        noResult: "No results were found!",
        enqueued: "Enqueued",
        nowPlaying: "Now Playing",
        length: "Length",
        remaining: "Songs Remaning",
        position: "Position in Queue",
        queue: "Queue",
        queueEmpty: "Queue is empty.",
        loopToggled: "Loop Toggled ",
        repeatToggled: "Repeat Toggled ",
        noSongToSkip: "There is no song that I could skip!",
        skipped: "Skipped",
        volumeChanged: "Volume changed to ",
        options: { query: "Query/URL" }
      },
      log: {
        log: "Logging",
        set: "Log channel set to: ",
        guildMemberAdd: "User Join",
        guildMemberAdded: " joined the server.",
        guildMemberRemove: "User Leave",
        guildMemberRemoved: " left the server.",
        messageEdit: "Message Edited",
        messageDelete: "Message Deleted"
      },
      move: {
        move: "Move",
        moved: " user(s) moved: "
      },
      privateRoom: {
        privateRoom: "Private Room",
        create: "Create Private Room",
        set: "Private Room has been set.",
        waitingRoom: "Waiting Room",
        waitingForMove: " is Waiting for Move",
        privateTextCreated: "Private Text Channel has been created.\nThis channel is only visible to members in your PrivateRoom and server moderators.\nPlease note that new members don't have permission to read message history."
      },
      reactionRole: {
        roleAppended: "Role Append [ReactionRole]",
        roleRemoved: "Role Removed [ReactionRole]",
        options: {
          view: "View ReactionRole Config",
          add: "Add ReactionRole Config",
          remove: "Remove ReactionRole Config",
          purge: "Purge ReactionRole Config"
        }
      },
      userRole: {
        userRole: "User Assignable(Dashboard) Roles",
        empty: "\uC124\uC815\uB41C \uC5ED\uD560\uC774 \uC5C6\uC5B4\uC694.",
        options: {
          view: "View UserRole Config",
          add: "Add UserRole Config",
          remove: "Remove UserRole Config",
          purge: "Purge UserRole Config"
        }
      },
      voiceDisconnect: {
        notInVoiceChannel: "I'm currently not in a voice channel!"
      },
      voiceRole: {
        voiceRole: "Voice Channel Roles",
        updated: "Updated {cnt} voice role(s).",
        noChanges: "No moderation have been made.",
        empty: "No roles have been set.",
        roleAppended: "Role Appended [Voice]",
        roleRemoved: "Role Removed [Voice]",
        options: {
          view: "View VoiceRole Config",
          add: "Add VoiceRole Config",
          remove: "Remove VoiceRole Config",
          purge: "Purge VoiceRole Config",
          update: "Update VoiceRoles",
          channelToSendLogs: "TextChannel to send Enter/Leave Information"
        }
      }
    };
  }
});

// src/locales/ko.ts
var ko;
var init_ko = __esm({
  "src/locales/ko.ts"() {
    ko = {
      done: "\uC644\uB8CC",
      on: "\uCF1C\uC84C\uC5B4\uC694.",
      off: "\uAEBC\uC84C\uC5B4\uC694.",
      manager: "[\uB9E4\uB2C8\uC800]",
      scope: "\uBC94\uC704",
      user: "\uC720\uC800",
      member: "\uBA64\uBC84",
      role: "\uC5ED\uD560",
      text: "\uD14D\uC2A4\uD2B8",
      textChannel: "\uCC44\uD305\uCC44\uB110",
      voiceChannel: "\uC74C\uC131\uCC44\uB110",
      notTextChannel: "\uD574\uB2F9 \uCC44\uB110\uC740 \uCC44\uD305 \uCC44\uB110\uC774 \uC544\uB2C8\uC608\uC694.",
      notVoiceChannel: "\uD574\uB2F9 \uCC44\uB110\uC740 \uC74C\uC131 \uCC44\uB110\uC774 \uC544\uB2C8\uC608\uC694.",
      messageID: "\uBA54\uC2DC\uC9C0 ID",
      embed: "\uC784\uBCA0\uB4DC",
      emoji: "\uC774\uBAA8\uC9C0",
      minute: "\uBD84",
      locale: {
        locale: "\uC5B8\uC5B4",
        code: "ko",
        name: "\uD55C\uAD6D\uC5B4",
        noChange: "\uBCC0\uACBD\uB41C \uC0AC\uD56D\uC774 \uC5C6\uC5B4\uC694.",
        pending: "\uC5B8\uC5B4\uB97C \uBCC0\uACBD\uD558\uB294 \uC911\uC774\uC608\uC694. \uC7A0\uC2DC\uB9CC \uAE30\uB2E4\uB824\uC8FC\uC138\uC694.",
        changed: "\uC5B8\uC5B4\uAC00 \uBCC0\uACBD\uB410\uC5B4\uC694."
      },
      usage: {
        help: "[manager]",
        play: "[query|URL]",
        tts: "<\uD14D\uC2A4\uD2B8>",
        volume: "<1~10>",
        alarm: "<subscribe|unsubscribe|test>",
        autorole: "<view|add|purge> [user|bot] [\uC5ED\uD560]",
        delete: "<\uAC1C\uC218>",
        disconnect: "<\uC720\uC800>",
        disconnectall: "<\uC74C\uC131\uCC44\uB110>",
        edit: "<\uCC44\uD305\uCC44\uB110> <\uBA54\uC2DC\uC9C0ID> <\uC784\uBCA0\uB4DC>",
        embed: "<\uCC44\uD305\uCC44\uB110> <\uC784\uBCA0\uB4DC>",
        locale: "<\uC5B8\uC5B4 \uCF54\uB4DC>",
        log: "<\uCC44\uD305\uCC44\uB110>",
        move: "<\uC720\uC800> <\uD0C0\uAC9F \uC74C\uC131\uCC44\uB110>",
        moveall: "<\uC74C\uC131\uCC44\uB110> <\uD0C0\uAC9F \uC74C\uC131\uCC44\uB110>",
        privateroom: "[fallback \uC74C\uC131\uCC44\uB110]",
        reactionrole: "<view|add|remove|purge> <\uCC44\uD305\uCC44\uB110> <\uBA54\uC2DC\uC9C0ID> [\uC774\uBAA8\uC9C0] [\uC5ED\uD560]",
        setafktimeout: "<\uBD84>",
        userrole: "<view|add|remove|purge> <\uC5ED\uD560>",
        voicerole: "<view|add|remove|purge|update> <\uC74C\uC131\uCC44\uB110> <\uC5ED\uD560> [\uCC44\uD305\uCC44\uB110]"
      },
      help: {
        help: "\uB3C4\uC6C0\uB9D0",
        description: "\uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uBA85\uB839\uC5B4\uC640 \uB3C4\uC6C0\uB9D0 \uBAA9\uB85D\uC774\uC608\uC694!\n(\uAD00\uB9AC\uC790 \uBA85\uB839\uC5B4\uB97C \uBCF4\uB824\uBA74 'manager'\uB97C \uC778\uC790\uB85C \uBD99\uC5EC\uC8FC\uC138\uC694)\n<\uD544\uC218 \uC778\uC790> [\uC120\uD0DD\uC801 \uC778\uC790]",
        description_manager: "\uAD00\uB9AC\uC790\uAC00 \uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uBA85\uB839\uC5B4\uC640 \uB3C4\uC6C0\uB9D0 \uBAA9\uB85D\uC774\uC608\uC694!\n<\uD544\uC218 \uC778\uC790> [\uC120\uD0DD\uC801 \uC778\uC790]",
        join: "\uC74C\uC131\uCC44\uB110\uC5D0 \uC811\uC18D\uC2DC\uD0A4\uAE30",
        leave: "\uC74C\uC131\uCC44\uB110\uC5D0\uC11C \uB0B4\uBCF4\uB0B4\uAE30",
        loop: "\uBC18\uBCF5 \uC7AC\uC0DD \uD65C\uC131\uD654/\uBE44\uD65C\uC131\uD654",
        pause: "\uC7AC\uC0DD \uC911\uC778 \uB178\uB798 \uC77C\uC2DC\uC911\uC9C0",
        play: "\uB178\uB798 \uC7AC\uC0DD/\uB300\uAE30\uC5F4\uC5D0 \uCD94\uAC00",
        queue: "\uB300\uAE30\uC5F4 \uBCF4\uAE30",
        repeat: "\uD55C \uACE1 \uBC18\uBCF5 \uD65C\uC131\uD654/\uBE44\uD65C\uC131\uD654",
        skip: "\uC7AC\uC0DD \uC911\uC778 \uACE1 \uAC74\uB108\uB6F0\uAE30",
        stop: "\uC7AC\uC0DD \uC911\uC778 \uACE1 \uC911\uC9C0\uD558\uAE30",
        tts: "\uC74C\uC131\uCC44\uB110\uC5D0 TTS \uBA54\uC2DC\uC9C0 \uBCF4\uB0B4\uAE30",
        volume: "\uC74C\uB7C9 \uBCC0\uACBD\uD558\uAE30",
        alarm: "\uC74C\uC131 \uCC44\uB110\uC5D0 \uC815\uAC01 \uC54C\uB78C \uC1A1\uCD9C",
        autorole: "\uC11C\uBC84\uC5D0 \uC811\uC18D\uD558\uB294 \uBA64\uBC84/\uBD07\uC5D0\uAC8C \uC790\uB3D9 \uC5ED\uD560 \uBD80\uC5EC",
        delete: "\uBA54\uC2DC\uC9C0 \uC77C\uAD04 \uC0AD\uC81C",
        disconnect: "\uC74C\uC131\uCC44\uB110 \uD2B9\uC815 \uBA64\uBC84 \uC5F0\uACB0 \uB04A\uAE30",
        disconnectall: "\uC74C\uC131\uCC44\uB110 \uBA64\uBC84 \uC77C\uAD04 \uC5F0\uACB0 \uB04A\uAE30",
        edit: "\uBA54\uC2DC\uC9C0 \uC218\uC815",
        embed: "\uC784\uBCA0\uB4DC \uB9CC\uB4E4\uAE30",
        locale: "\uC11C\uBC84\uC758 \uAE30\uBCF8 \uC5B8\uC5B4 \uC124\uC815",
        log: "\uB85C\uADF8\uCC44\uB110 \uC124\uC815\uD558\uAE30",
        move: "\uC74C\uC131\uCC44\uB110 \uD2B9\uC815 \uBA64\uBC84 \uC774\uB3D9",
        moveall: "\uC74C\uC131\uCC44\uB110 \uBA64\uBC84 \uC77C\uAD04 \uC774\uB3D9",
        privateroom: "\uAC1C\uC778\uBC29 \uCD08\uAE30\uD654\uD558\uAE30",
        reactionrole: "\uC774\uBAA8\uC9C0 \uBC18\uC751\uC5D0 \uB530\uB978 \uC5ED\uD560 \uBD80\uC5EC",
        setafktimeout: "\uBE44\uD65C\uC131\uD654 \uCC44\uB110 \uC5F0\uACB0 \uD574\uC81C \uC2DC\uAC04 \uC124\uC815",
        userrole: "\uB300\uC2DC\uBCF4\uB4DC\uB97C \uD1B5\uD574 \uD560\uB2F9 \uAC00\uB2A5\uD55C \uC5ED\uD560 \uC124\uC815",
        voicerole: "\uC74C\uC131\uCC44\uB110 \uC811\uC18D\uC790\uC5D0\uAC8C \uC5ED\uD560 \uBD80\uC5EC"
      },
      insufficientPerms: {
        administrator: "\uC774 \uBA85\uB839\uC5B4\uB97C \uC2E4\uD589\uD558\uB824\uBA74 \uAD00\uB9AC\uC790 \uAD8C\uD55C\uC774 \uD544\uC694\uD574\uC694.",
        manage_guild: "\uC774 \uBA85\uB839\uC5B4\uB97C \uC2E4\uD589\uD558\uB824\uBA74 \uC11C\uBC84\uB97C \uAD00\uB9AC\uD560 \uC218 \uC788\uB294 \uAD8C\uD55C\uC774 \uD544\uC694\uD574\uC694.",
        manage_channels: "\uC774 \uBA85\uB839\uC5B4\uB97C \uC2E4\uD589\uD558\uB824\uBA74 \uCC44\uB110\uC744 \uAD00\uB9AC\uD560 \uC218 \uC788\uB294 \uAD8C\uD55C\uC774 \uD544\uC694\uD574\uC694.",
        manage_roles: "\uC774 \uBA85\uB839\uC5B4\uB97C \uC2E4\uD589\uD558\uB824\uBA74 \uC5ED\uD560\uC744 \uAD00\uB9AC\uD560 \uC218 \uC788\uB294 \uAD8C\uD55C\uC774 \uD544\uC694\uD574\uC694.",
        manage_messages: "\uC774 \uBA85\uB839\uC5B4\uB97C \uC2E4\uD589\uD558\uB824\uBA74 \uBA54\uC2DC\uC9C0\uB97C \uAD00\uB9AC\uD560 \uC218 \uC788\uB294 \uAD8C\uD55C\uC774 \uD544\uC694\uD574\uC694.",
        move_members: "\uC774 \uBA85\uB839\uC5B4\uB97C \uC2E4\uD589\uD558\uB824\uBA74 \uBA64\uBC84\uB97C \uC774\uB3D9\uD560 \uAD8C\uD55C\uC774 \uD544\uC694\uD574\uC694.",
        connect: "\uC774 \uBA85\uB839\uC5B4\uB97C \uC2E4\uD589\uD558\uB824\uBA74 \uC800\uC5D0\uAC8C [\uC5F0\uACB0], [\uB9D0\uD558\uAE30] \uAD8C\uD55C\uC744 \uBD80\uC5EC\uD574\uC8FC\uC138\uC694."
      },
      afkTimeout: {
        afkTimeout: "\uBE44\uD65C\uC131\uD654 \uC5F0\uACB0 \uD574\uC81C",
        set: "\uBE44\uD65C\uC131\uD654 \uCC44\uB110 \uC5F0\uACB0 \uD574\uC81C \uC2DC\uAC04\uC774 {min}\uBD84\uC73C\uB85C \uC5C5\uB370\uC774\uD2B8 \uB410\uC5B4\uC694.",
        disconnected: "\uB2D8\uAED8\uC11C \uBE44\uD65C\uC131\uD654 \uCC44\uB110\uC5D0\uC11C {min}\uBD84 \uB3D9\uC548 \uC790\uB9AC\uB97C \uBE44\uC6B0\uC168\uAE30\uC5D0 \uC5F0\uACB0 \uD574\uC81C\uB410\uC5B4\uC694.",
        disconnected_dm: "\uBE44\uD65C\uC131\uD654 \uCC44\uB110\uC5D0\uC11C {min}\uBD84 \uB3D9\uC548 \uC790\uB9AC\uB97C \uBE44\uC6B0\uC168\uAE30\uC5D0 \uC5F0\uACB0 \uD574\uC81C\uB410\uC5B4\uC694.",
        countdownStarted: "\uBE44\uD65C\uC131\uD654 \uC5F0\uACB0 \uD574\uC81C \uCE74\uC6B4\uD2B8\uB2E4\uC6B4({min}\uBD84)",
        options: {
          minutesToDisconnect: "\uC790\uB3D9 \uC5F0\uACB0 \uD574\uC81C\uAE4C\uC9C0 \uB300\uAE30 \uC2DC\uAC04(\uBD84)"
        }
      },
      alarm: {
        options: {
          subscribe: "\uC54C\uB78C \uAD6C\uB3C5",
          unsubscribe: "\uC54C\uB78C \uAD6C\uB3C5\uCDE8\uC18C",
          test: "\uC54C\uB78C \uD14C\uC2A4\uD2B8"
        }
      },
      autoRole: {
        autoRole: "\uC790\uB3D9 \uC5ED\uD560",
        empty: "\uC124\uC815\uB41C \uC5ED\uD560\uC774 \uC5C6\uC5B4\uC694.",
        roleAppended: "\uC5ED\uD560 \uCD94\uAC00 [\uC790\uB3D9 \uC5ED\uD560]",
        options: {
          view: "\uC124\uC815\uB41C \uC790\uB3D9 \uC5ED\uD560 \uBCF4\uAE30",
          add: "\uC790\uB3D9 \uC5ED\uD560 \uCD94\uAC00",
          purge: "\uC790\uB3D9 \uC5ED\uD560 \uCD08\uAE30\uD654"
        }
      },
      delete: {
        deleted: "\uAC1C\uC758 \uBA54\uC2DC\uC9C0\uB97C \uC0AD\uC81C\uD588\uC5B4\uC694!"
      },
      disconnect: {
        disconnect: "\uC5F0\uACB0 \uD574\uC81C",
        disconnected: "{voiceChannel}\uC5D0\uC11C {cnt}\uBA85\uC758 \uC5F0\uACB0\uC744 \uB04A\uC5C8\uC5B4\uC694."
      },
      log: {
        log: "\uB85C\uADF8",
        set: "\uB85C\uADF8\uCC44\uB110\uC774 \uBCC0\uACBD\uB410\uC5B4\uC694: ",
        guildMemberAdd: "\uBA64\uBC84 \uC785\uC7A5",
        guildMemberAdded: "\uB2D8\uC774 \uC0C8\uB85C\uC6B4 \uBA64\uBC84\uAC00 \uB418\uC5C8\uC5B4\uC694.",
        guildMemberRemove: "\uBA64\uBC84 \uB5A0\uB0A8/\uD1F4\uCD9C\uB428",
        guildMemberRemoved: "\uB2D8\uC740 \uB354 \uC774\uC0C1 \uC774 \uC11C\uBC84\uC758 \uBA64\uBC84\uAC00 \uC544\uB2C8\uC5D0\uC694.",
        messageEdit: "\uBA54\uC2DC\uC9C0 \uC218\uC815\uB428",
        messageDelete: "\uBA54\uC2DC\uC9C0 \uC0AD\uC81C\uB428"
      },
      music: {
        joinVoiceChannel: "\uC774 \uBA85\uB839\uC5B4\uB97C \uC2E4\uD589\uD558\uB824\uBA74 \uC74C\uC131 \uCC44\uB110\uC5D0 \uC811\uC18D\uD574\uC8FC\uC138\uC694.",
        currentlyPlaying: "\uD604\uC7AC \uC7AC\uC0DD\uC911\uC778 \uACE1\uC774 \uC788\uC5B4\uC694.",
        noResult: "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC5B4\uC694.",
        enqueued: "\uCD94\uAC00\uB428",
        nowPlaying: "\uD604\uC7AC \uC7AC\uC0DD\uC911",
        length: "\uAE38\uC774",
        remaining: "\uB0A8\uC740 \uACE1",
        position: "\uC7AC\uC0DD\uAE4C\uC9C0 \uB0A8\uC740 \uACE1",
        queue: "\uB300\uAE30\uC5F4",
        queueEmpty: "\uB300\uAE30\uC5F4\uC774 \uBE44\uC5B4\uC788\uC5B4\uC694.",
        loopToggled: "\uBC18\uBCF5 \uC7AC\uC0DD\uC774 ",
        repeatToggled: "1\uACE1 \uBC18\uBCF5 \uC7AC\uC0DD\uC774 ",
        noSongToSkip: "\uAC74\uB108\uB6F8 \uACE1\uC774 \uC5C6\uC5B4\uC694!",
        skipped: "\uAC74\uB108\uB6F0\uC5C8\uC5B4\uC694!",
        volumeChanged: "\uC74C\uB7C9\uC774 \uBCC0\uACBD\uB410\uC5B4\uC694: ",
        options: { query: "\uAC80\uC0C9\uD560 \uBB38\uC790\uC5F4 \uB610\uB294 URL" }
      },
      move: {
        move: "\uBA64\uBC84 \uC774\uB3D9",
        moved: "\uBA85\uC758 \uBA64\uBC84\uAC00 \uC774\uB3D9\uB410\uC5B4\uC694: "
      },
      privateRoom: {
        privateRoom: "\uAC1C\uC778\uBC29",
        create: "\uAC1C\uC778\uBC29 \uB9CC\uB4E4\uAE30",
        set: "\uAC1C\uC778\uBC29\uC774 \uCD08\uAE30\uD654\uB410\uC5B4\uC694.",
        waitingRoom: "\uB300\uAE30\uC2E4",
        waitingForMove: "\uB2D8\uC774 \uB300\uAE30\uC2E4\uC5D0 \uC785\uC7A5\uD558\uC5EC \uC774\uB3D9\uC744 \uAE30\uB2E4\uB9AC\uACE0 \uC788\uC5B4\uC694.",
        privateTextCreated: "\uAC1C\uC778\uBC29 \uCC44\uD305\uCC44\uB110\uC774 \uB9CC\uB4E4\uC5B4\uC84C\uC5B4\uC694.\n\uC774 \uCC44\uB110\uC740 \uAC1C\uC778\uBC29\uC5D0 \uCC38\uAC00\uD55C \uBA64\uBC84\uB4E4\uACFC \uB9E4\uB2C8\uC800\uB9CC \uBCFC \uC218 \uC788\uC5B4\uC694.\n\uB2A6\uAC8C \uCC38\uAC00\uD55C \uBA64\uBC84\uB294 \uBA3C\uC800 \uBCF4\uB0B8 \uBA54\uC2DC\uC9C0\uB97C \uC77D\uC744 \uC218 \uC5C6\uB2E4\uB294 \uC810\uC744 \uC54C\uC544\uB450\uC138\uC694."
      },
      reactionRole: {
        roleAppended: "\uC5ED\uD560 \uCD94\uAC00\uB428 [\uC774\uBAA8\uC9C0 \uC5ED\uD560]",
        roleRemoved: "\uC5ED\uD560 \uC81C\uAC70\uB428 [\uC774\uBAA8\uC9C0 \uC5ED\uD560]",
        options: {
          view: "\uC124\uC815\uB41C \uC774\uBAA8\uC9C0 \uC5ED\uD560 \uBCF4\uAE30",
          add: "\uC774\uBAA8\uC9C0 \uC5ED\uD560 \uCD94\uAC00",
          remove: "\uC774\uBAA8\uC9C0 \uC5ED\uD560 \uC0AD\uC81C",
          purge: "\uC774\uBAA8\uC9C0 \uC5ED\uD560 \uCD08\uAE30\uD654"
        }
      },
      userRole: {
        userRole: "\uB300\uC2DC\uBCF4\uB4DC \uC5ED\uD560",
        empty: "\uC124\uC815\uB41C \uC5ED\uD560\uC774 \uC5C6\uC5B4\uC694.",
        options: {
          view: "\uB300\uC2DC\uBCF4\uB4DC \uC5ED\uD560 \uBCF4\uAE30",
          add: "\uB300\uC2DC\uBCF4\uB4DC \uC5ED\uD560 \uCD94\uAC00",
          remove: "\uB300\uC2DC\uBCF4\uB4DC \uC5ED\uD560 \uC0AD\uC81C",
          purge: "\uB300\uC2DC\uBCF4\uB4DC \uC5ED\uD560 \uCD08\uAE30\uD654"
        }
      },
      voiceDisconnect: {
        notInVoiceChannel: "\uC800\uB294 \uC9C0\uAE08 \uC74C\uC131\uCC44\uB110\uC5D0 \uC788\uC9C0 \uC54A\uC544\uC694!"
      },
      voiceRole: {
        voiceRole: "\uC74C\uC131\uCC44\uB110 \uC5ED\uD560",
        updated: "{cnt}\uAC1C\uC758 \uC74C\uC131\uCC44\uB110 \uC5ED\uD560\uC744 \uC5C5\uB370\uC774\uD2B8\uD588\uC5B4\uC694.",
        noChanges: "\uC544\uBB34\uC77C\uB3C4 \uC77C\uC5B4\uB098\uC9C0 \uC54A\uC558\uC5B4\uC694.",
        empty: "\uC124\uC815\uB41C \uC5ED\uD560\uC774 \uC5C6\uC5B4\uC694.",
        roleAppended: "\uC5ED\uD560 \uCD94\uAC00\uB428 [\uC74C\uC131\uCC44\uB110]",
        roleRemoved: "\uC5ED\uD560 \uC81C\uAC70\uB428 [\uC74C\uC131\uCC44\uB110]",
        options: {
          view: "\uC124\uC815\uB41C \uC74C\uC131\uCC44\uB110 \uC5ED\uD560 \uBCF4\uAE30",
          add: "\uC74C\uC131\uCC44\uB110 \uC5ED\uD560 \uCD94\uAC00",
          remove: "\uC74C\uC131\uCC44\uB110 \uC5ED\uD560 \uC0AD\uC81C",
          purge: "\uC74C\uC131\uCC44\uB110 \uC5ED\uD560 \uCD08\uAE30\uD654",
          update: "\uC74C\uC131\uCC44\uB110 \uC5ED\uD560 \uC5C5\uB370\uC774\uD2B8",
          channelToSendLogs: "\uB85C\uADF8\uB97C \uAE30\uB85D\uD560 \uCC44\uD305\uCC44\uB110"
        }
      }
    };
  }
});

// src/locales/index.ts
var locales_exports = {};
__export(locales_exports, {
  en: () => en,
  ko: () => ko
});
var init_locales = __esm({
  "src/locales/index.ts"() {
    init_en();
    init_ko();
  }
});

// src/services/api.ts
var require_api = __commonJS({
  "src/services/api.ts"(exports) {
    var import_axios3 = __toESM(require("axios"));
    var import_compression = __toESM(require("compression"));
    var import_cors = __toESM(require("cors"));
    var import_express = __toESM(require("express"));
    var import_helmet = __toESM(require("helmet"));
    var import_morgan = __toESM(require("morgan"));
    init_logger();
    var import_config4 = require("dotenv/config");
    init_app();
    var app = (0, import_express.default)();
    app.use((0, import_cors.default)());
    app.use((0, import_helmet.default)());
    app.use((0, import_morgan.default)("short"));
    app.use((0, import_compression.default)());
    app.set("trust proxy", true);
    app.use(import_express.default.urlencoded({ extended: true, limit: "50mb" }));
    app.use(import_express.default.json({ limit: "50mb" }));
    var fetchGuildMember = (guildID, memberID) => {
      const _roles = [];
      const member = client.guilds.resolve(guildID).members.resolve(memberID);
      for (const userRole of states.get(guildID).userRoles) {
        if (member.roles.cache.has(userRole.id))
          _roles.push(userRole.id);
      }
      return {
        displayName: member.displayName,
        displayHexColor: member.displayHexColor,
        presence: {
          activities: member.presence.activities,
          status: member.presence.status
        },
        roles: _roles
      };
    };
    app.post("/fetch", (req, res) => __async(exports, null, function* () {
      try {
        if (!req.body.token)
          return res.sendStatus(401);
        const payload = {
          user: (yield import_axios3.default.get("https://discord.com/api/v8/users/@me", {
            headers: { Authorization: `Bearer ${req.body.token}` }
          })).data,
          guilds: []
        };
        const guilds = (yield import_axios3.default.get("https://discord.com/api/v8/users/@me/guilds", {
          headers: { Authorization: `Bearer ${req.body.token}` }
        })).data;
        for (const [guildID, state] of states) {
          const guild = guilds.find((guild2) => guild2.id === guildID);
          if (!guild)
            continue;
          payload.guilds.push(__spreadProps(__spreadValues({}, guild), {
            member: fetchGuildMember(guildID, payload.user.id),
            userRoles: states.get(guildID).userRoles
          }));
        }
        res.send(payload);
      } catch (err2) {
        res.sendStatus(400);
      }
    }));
    app.post("/guild", (req, res) => __async(exports, null, function* () {
      try {
        if (!req.body.token)
          return res.sendStatus(401);
        if (!states.get(req.body.guild) || !client.guilds.resolve(req.body.guild).members.resolve(req.body.member))
          return;
        res.json({
          member: fetchGuildMember(req.body.guild, req.body.member),
          userRoles: states.get(req.body.guild).userRoles
        });
      } catch (err2) {
        res.sendStatus(400);
      }
    }));
    app.put("/roles", (req, res) => __async(exports, null, function* () {
      try {
        if (!req.body.token)
          return res.sendStatus(401);
        const member = client.guilds.resolve(req.body.guild).members.resolve(req.body.member);
        if (!member || !req.body.roles)
          return res.sendStatus(404);
        for (const roleID of req.body.roles) {
          if (!client.guilds.resolve(req.body.guild).roles.cache.has(roleID) || states.get(req.body.guild).userRoles.findIndex((userRole) => userRole.id === roleID) === -1)
            return res.sendStatus(404);
        }
        for (const userRole of states.get(req.body.guild).userRoles) {
          const idx = req.body.roles.findIndex((roleID) => roleID === userRole.id);
          if (idx !== -1) {
            if (!member.roles.cache.has(userRole.id))
              yield member.roles.add(userRole.id, "[Dashboard] Role Update");
          } else {
            if (member.roles.cache.has(userRole.id))
              yield member.roles.remove(userRole.id, "[Dashboard] Role Update");
          }
        }
        res.sendStatus(200);
      } catch (err2) {
        res.sendStatus(400);
      }
    }));
    app.listen(process.env.HTTP_PORT || 20002, () => {
      log.i(`Listening on http://${process.env.HTTP_HOST || "localhost"}:${process.env.HTTP_PORT || 20002}`);
    });
  }
});

// src/events/error.ts
function err(error) {
  return __async(this, null, function* () {
    createError("ClientError", `[${error.name}] ${error.message}`);
  });
}
var init_error = __esm({
  "src/events/error.ts"() {
    init_createError();
  }
});

// src/modules/initializer/registerCommands.ts
function registerCommands(guildID, force) {
  return __async(this, null, function* () {
    try {
      const a = new import_builders2.SlashCommandBuilder().setName("autorole").setDescription("asdf").addSubcommand((subcommand) => subcommand.setName("view").setDescription(`asdf`)).addSubcommand((subcommandGroup) => subcommandGroup.setName("add").setDescription(`adsf`).addUserOption((option) => option.setName("type").setDescription("User/Bot").setRequired(true)));
      console.log(JSON.stringify(a.toJSON()));
    } catch (error) {
      log.e(error);
    }
  });
}
var import_rest, import_builders2, rest;
var init_registerCommands = __esm({
  "src/modules/initializer/registerCommands.ts"() {
    import_rest = require("@discordjs/rest");
    import_builders2 = require("@discordjs/builders");
    init_logger();
    rest = new import_rest.REST({ version: "10" }).setToken(process.env.TOKEN);
  }
});

// src/modules/initializer/setConfig.ts
function setConfig(guildID) {
  return __async(this, null, function* () {
    try {
      const configDocRef = firestore.collection(guildID).doc("config");
      if ((yield configDocRef.get()).exists)
        return;
      yield configDocRef.create({
        afkTimeout: -1,
        alarmChannel: null,
        autoRoles: [],
        locale: "ko",
        logChannel: null,
        logMessageEvents: false,
        privateRoom: { generator: null, fallback: null },
        privateRooms: [],
        reactionRoles: [],
        userRoles: [],
        voiceRoles: []
      });
    } catch (err2) {
      createError("Initializer > Config", err2, { guild: guildID });
    }
  });
}
var init_setConfig = __esm({
  "src/modules/initializer/setConfig.ts"() {
    init_createError();
    init_firebase();
  }
});

// src/modules/initializer/setGuild.ts
function setGuild(guildID) {
  return __async(this, null, function* () {
    try {
      yield firestore.collection(guildID).doc("guild").set(JSON.parse(JSON.stringify(client.guilds.resolve(guildID))));
    } catch (err2) {
      log.e(`SetGuild > ${err2}`);
    }
  });
}
var init_setGuild = __esm({
  "src/modules/initializer/setGuild.ts"() {
    init_app();
    init_logger();
    init_firebase();
  }
});

// src/modules/initializer/setState.ts
function setState(guildID, config) {
  return __async(this, null, function* () {
    states.set(guildID, {
      guildId: guildID,
      afkChannel: new import_discord.Collection(),
      afkTimeout: config ? config.afkTimeout : -1,
      alarmChannel: config ? config.alarmChannel : null,
      autoRoles: config ? config.autoRoles : [],
      locale: config ? locales.get(config.locale) : locales.get("ko"),
      logChannel: config ? config.logChannel : null,
      logMessageEvents: config ? config.logMessageEvents : false,
      mentionDebounce: null,
      privateRoom: config ? config.privateRoom : void 0,
      privateRooms: config ? config.privateRooms : [],
      reactionRoles: config ? config.reactionRoles : [],
      userRoles: config ? config.userRoles : [],
      voiceRoles: config ? config.voiceRoles : [],
      connection: null,
      queue: [],
      isLooped: false,
      isRepeated: false,
      isPlaying: false,
      volume: 3
    });
  });
}
var import_discord;
var init_setState = __esm({
  "src/modules/initializer/setState.ts"() {
    import_discord = require("discord.js");
    init_app();
  }
});

// src/modules/initializer/index.ts
var init_initializer = __esm({
  "src/modules/initializer/index.ts"() {
    init_registerCommands();
    init_setConfig();
    init_setGuild();
    init_setState();
  }
});

// src/events/guildCreate.ts
function guildCreate(guild) {
  return __async(this, null, function* () {
    try {
      log.d(`Initialize Started [ ${guild.name}(${guild.id}) ]`);
      yield setConfig(guild.id);
      setState(guild.id);
      yield registerCommands(guild.id, true);
      yield setGuild(guild.id);
      log.i(`Initialize Complete [ ${guild.name}(${guild.id}) ]`);
    } catch (err2) {
      createError("GuildCreate", err2, { guild });
    }
  });
}
var init_guildCreate = __esm({
  "src/events/guildCreate.ts"() {
    init_createError();
    init_initializer();
    init_logger();
  }
});

// src/events/guildDelete.ts
function guildDelete(guild) {
  return __async(this, null, function* () {
    try {
      yield firestore.collection(guild.id).doc("commands").delete();
      log.w(`Deleted Commands due to GuildDelete [ ${guild.name}(${guild.id}) ]`);
    } catch (err2) {
      createError("GuildDelete", err2, { guild });
    }
  });
}
var init_guildDelete = __esm({
  "src/events/guildDelete.ts"() {
    init_createError();
    init_firebase();
    init_logger();
  }
});

// src/events/guildMemberAdd.ts
function guildMemberAdd(member) {
  return __async(this, null, function* () {
    try {
      sendEmbed({ member }, {
        color: props.color.cyan,
        author: {
          name: states.get(member.guild.id).locale.log.guildMemberAdd,
          iconURL: props.icon.in
        },
        description: `**<@${member.user.id}>${states.get(member.guild.id).locale.log.guildMemberAdded}**`,
        timestamp: new Date()
      }, { guild: true, log: true });
      for (const autoRole of states.get(member.guild.id).autoRoles) {
        if (!(autoRole.type === "user" && !member.user.bot || autoRole.type === "bot" && member.user.bot))
          continue;
        yield member.roles.add(autoRole.role, "[AutoRole] GuildMemberAdd");
        yield sendEmbed({ member }, {
          color: props.color.cyan,
          author: {
            name: states.get(member.guild.id).locale.autoRole.roleAppended,
            iconURL: props.icon.role_append
          },
          description: `**<@${member.user.id}> += <@&${autoRole.role}>**`,
          timestamp: new Date()
        }, { guild: true, log: true });
      }
      return setGuild(member.guild.id);
    } catch (err2) {
      createError("GuildMemberAdd", err2, { guild: member.guild });
    }
  });
}
var init_guildMemberAdd = __esm({
  "src/events/guildMemberAdd.ts"() {
    init_createError();
    init_embedSender();
    init_initializer();
    init_app();
    init_props();
  }
});

// src/events/guildMemberRemove.ts
function guildMemberRemove(member) {
  return __async(this, null, function* () {
    try {
      sendEmbed({ member }, {
        color: props.color.cyan,
        author: {
          name: states.get(member.guild.id).locale.log.guildMemberRemove,
          iconURL: props.icon.out
        },
        description: `**<@${member.user.id}>${states.get(member.guild.id).locale.log.guildMemberRemoved}**`,
        timestamp: new Date()
      }, { guild: true, log: true });
      return setGuild(member.guild.id);
    } catch (err2) {
      createError("GuildMemberRemove", err2, { guild: member.guild });
    }
  });
}
var init_guildMemberRemove = __esm({
  "src/events/guildMemberRemove.ts"() {
    init_createError();
    init_embedSender();
    init_initializer();
    init_app();
    init_props();
  }
});

// src/events/interactionCreate.ts
function interactionCreate(interaction) {
  return __async(this, null, function* () {
    try {
      if (interaction.isApplicationCommand) {
        const command = userCommands.get(interaction.data.name) || managerCommands.find((cmd) => cmd.name === interaction.data.name && !cmd.messageOnly);
        if (!command)
          return;
        if (command.name === "locale") {
          yield import_axios.default.post(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, { type: 5, data: { content: "\u2755" } });
        }
        const response = yield command.execute(states.get(interaction.guildId), interaction);
        if (command.name === "locale") {
          yield import_axios.default.patch(`https://discord.com/api/v8/webhooks/${process.env.APPLICATION}/${interaction.token}/messages/@original`, {
            embeds: response
          });
        } else {
          yield import_axios.default.post(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, {
            type: 4,
            data: response ? Array.isArray(response) ? { embeds: response } : { content: response } : { content: `**\u2705 ${states.get(interaction.guild_id).locale.done}**` }
          });
        }
      }
    } catch (err2) {
      createError("InteractionCreate", err2, { interaction });
    }
  });
}
var import_axios;
var init_interactionCreate = __esm({
  "src/events/interactionCreate.ts"() {
    import_axios = __toESM(require("axios"));
    init_createError();
    init_app();
  }
});

// src/events/messageCreate.ts
function messageCreate(message) {
  return __async(this, null, function* () {
    try {
      if (message.author.bot)
        return;
      else if (message.channel.type === "DM") {
        yield message.react("\u274C");
        yield message.reply({
          embeds: [
            {
              color: props.color.red,
              title: "**\u274C Error**",
              description: "**This channel is read-only.\n\uC774 \uCC44\uB110\uC740 \uC77D\uAE30 \uC804\uC6A9\uC774\uC608\uC694.**"
            }
          ]
        });
        return;
      } else if (!states.get(message.guild.id).mentionDebounce && (/현우|hyunwoo/i.test(message.content) || message.mentions.has(client.user)) && !message.mentions.everyone && !message.content.startsWith(prefix)) {
        states.get(message.guild.id).mentionDebounce = setTimeout(() => states.get(message.guild.id).mentionDebounce = null, 3e4);
        yield import_axios2.default.post(`https://discord.com/api/v8/channels/${message.channel.id}/messages`, {
          content: `<@${props.developerID}>`,
          message_reference: { message_id: message.id }
        }, { headers: { Authorization: `Bot ${process.env.TOKEN}` } });
      } else if (!message.content.startsWith(prefix))
        return;
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = managerCommands.find((cmd) => cmd.name === commandName && cmd.messageOnly);
      if (!command)
        return;
      yield command.execute(states.get(message.guild.id), message, args);
    } catch (err2) {
      message.react("\u274C");
      createError("Message", err2, { message });
    }
  });
}
var import_axios2, import_config2;
var init_messageCreate = __esm({
  "src/events/messageCreate.ts"() {
    import_axios2 = __toESM(require("axios"));
    init_createError();
    init_app();
    init_props();
    import_config2 = require("dotenv/config");
  }
});

// src/events/messageDelete.ts
function messageDelete(message) {
  return __async(this, null, function* () {
  });
}
var init_messageDelete = __esm({
  "src/events/messageDelete.ts"() {
  }
});

// src/events/messageReactionAdd.ts
function messageReactionAdd(reaction, user) {
  return __async(this, null, function* () {
  });
}
var init_messageReactionAdd = __esm({
  "src/events/messageReactionAdd.ts"() {
  }
});

// src/events/messageReactionRemove.ts
function messageReactionRemove(reaction, user) {
  return __async(this, null, function* () {
  });
}
var init_messageReactionRemove = __esm({
  "src/events/messageReactionRemove.ts"() {
  }
});

// src/events/messageUpdate.ts
function messageUpdate(oldMessage, newMessage) {
  return __async(this, null, function* () {
  });
}
var init_messageUpdate = __esm({
  "src/events/messageUpdate.ts"() {
  }
});

// src/events/ready.ts
function ready() {
  return __async(this, null, function* () {
    try {
      for (const collection of yield firestore.listCollections()) {
        const guild = client.guilds.resolve(collection.id);
        if (!guild) {
          log.w(`Initialize Skipped [ ${(yield collection.doc("guild").get()).data().name} (${collection.id}) ]`);
          continue;
        }
        firestore.collection(guild.id).doc("config").onSnapshot((docSnapshot) => __async(this, null, function* () {
          const config = docSnapshot.data();
          if (!states.has(guild.id)) {
            log.d(`Initialize Started [ ${guild.name} (${guild.id}) ]`);
            setState(guild.id, config);
            yield registerCommands(guild.id);
            for (const reactionRole of config.reactionRoles) {
              yield guild.channels.resolve(reactionRole.textChannel).messages.fetch({ limit: 100 });
            }
            yield setGuild(guild.id);
            log.i(`Initialize Complete [ ${guild.name} (${guild.id}) ]`);
          } else {
            for (const [key, _config] of Object.entries(config)) {
              if (key === "locale")
                states.get(guild.id)[key] = locales.get(_config);
              else
                states.get(guild.id)[key] = _config;
            }
          }
        }), (err2) => {
          createError("Initialize > Firestore > DocumentUpdate", err2);
        });
      }
      yield client.user.setPresence(process.env.NODE_ENV !== "production" ? {
        status: "dnd",
        activities: [
          {
            type: "WATCHING",
            name: "Visual Studio Code",
            url: "https://bot.hyunwoo.dev"
          }
        ]
      } : {
        status: "online",
        activities: [{ type: "WATCHING", name: "/help", url: "https://bot.hyunwoo.dev" }]
      });
    } catch (err2) {
      createError("Ready", err2);
    }
    log.i(`Login w/ ${client.user.tag}`);
  });
}
var init_ready = __esm({
  "src/events/ready.ts"() {
    init_createError();
    init_firebase();
    init_initializer();
    init_logger();
    init_app();
  }
});

// src/events/roleDelete.ts
function roleDelete(role) {
  return __async(this, null, function* () {
    try {
      if (!states.get(role.guild.id).userRoles)
        return;
      const idx = states.get(role.guild.id).userRoles.findIndex((userRole) => userRole.id === role.id);
      if (idx === -1)
        return;
      states.get(role.guild.id).userRoles.splice(idx, 1);
      yield firestore.collection(role.guild.id).doc("config").update({ userRoles: states.get(role.guild.id).userRoles });
    } catch (err2) {
      createError("RoleDelete", err2, { guild: role.guild });
    }
  });
}
var init_roleDelete = __esm({
  "src/events/roleDelete.ts"() {
    init_createError();
    init_firebase();
    init_app();
  }
});

// src/events/roleUpdate.ts
function roleUpdate(oldRole, newRole) {
  return __async(this, null, function* () {
    try {
      const state = states.get(newRole.guild.id);
      if (!state.userRoles || !state.userRoles.length)
        return;
      const idx = state.userRoles.findIndex((userRole) => userRole.id === newRole.id);
      if (idx === -1)
        return;
      state.userRoles[idx].name = newRole.name;
      state.userRoles[idx].color = newRole.hexColor;
      yield firestore.collection(newRole.guild.id).doc("config").update({ userRoles: state.userRoles });
    } catch (err2) {
      createError("RoleUpdate", err2, { guild: oldRole.guild });
    }
  });
}
var init_roleUpdate = __esm({
  "src/events/roleUpdate.ts"() {
    init_createError();
    init_firebase();
    init_app();
  }
});

// src/events/voiceStateUpdate.ts
function voiceStateUpdate(oldState, newState) {
  return __async(this, null, function* () {
    if (oldState && newState && oldState.channelId === newState.channelId)
      return;
    const state = states.get(newState.guild.id || oldState.guild.id);
    if (oldState.member.user.id === client.user.id) {
      if (state.timeout)
        clearTimeout(state.timeout);
      state.connection = null;
      return;
    }
    if (oldState.member.user.bot || newState.member.user.bot)
      return;
    const configDocRef = firestore.collection(newState.guild.id || oldState.guild.id).doc("config");
    if (oldState.channelId) {
      try {
        if (state.privateRooms && state.privateRooms.length >= 1) {
          const privateRoom = state.privateRooms.find((privateRoom2) => privateRoom2.room === oldState.channelId || privateRoom2.waiting === oldState.channelId);
          if (state.privateRoom.generator && privateRoom) {
            if (privateRoom.room === oldState.channelId && privateRoom.host !== oldState.member.id) {
              const privateText = oldState.guild.channels.resolve(privateRoom.text);
              if (privateText) {
                yield privateText.send({
                  embeds: [
                    {
                      color: props.color.red,
                      author: {
                        name: oldState.member.displayName,
                        iconURL: oldState.member.user.avatarURL()
                      }
                    }
                  ]
                });
                yield privateText.permissionOverwrites.edit(oldState.member, { VIEW_CHANNEL: false }, { reason: "[PrivateRoom] Switch/Leave" });
              }
              try {
                yield oldState.guild.channels.resolve(state.privateRoom.generator).permissionOverwrites.resolve(oldState.member.id).delete("[PrivateRoom] Switch/Leave");
              } catch (err2) {
                createError("VoiceStateUpdate > ChannelResolve", err2, { guild: oldState.guild });
              }
            } else if (privateRoom.room !== newState.channelId && privateRoom.waiting !== newState.channelId && privateRoom.host === oldState.member.id && oldState.guild.channels.cache.has(privateRoom.room)) {
              for (const [memberID, member] of Object.assign([
                oldState.guild.channels.resolve(privateRoom.room).members,
                oldState.guild.channels.resolve(privateRoom.waiting).members
              ])) {
                if (state.privateRoom.fallback)
                  yield member.voice.setChannel(state.privateRoom.fallback, "[PrivateRoom] Deletion");
                else if (privateRoom.room === member.voice.channelID)
                  yield oldState.guild.channels.resolve(state.privateRoom.generator).permissionOverwrites.resolve(memberID).delete("[PrivateRoom] Deletion");
              }
              yield oldState.guild.channels.resolve(privateRoom.room).delete("[PrivateRoom] Deletion");
              yield oldState.guild.channels.resolve(privateRoom.waiting).delete("[PrivateRoom] Deletion");
              yield oldState.guild.channels.resolve(privateRoom.text).delete("[PrivateRoom] Deletion");
              const idx = state.privateRooms.findIndex((privateRoom2) => privateRoom2.host === oldState.member.id);
              if (idx === -1)
                throw createError("VoiceStateUpdate > PrivateRoom", "PrivateRoom Host Not Found", {
                  guild: newState.guild
                });
              state.privateRooms.splice(idx, 1);
              yield configDocRef.update({ privateRooms: state.privateRooms });
              yield oldState.guild.channels.resolve(state.privateRoom.generator).permissionOverwrites.resolve(oldState.member.id).delete("[PrivateRoom] Deletion");
            }
          }
        }
        if (state.afkChannel && state.afkChannel.has(oldState.member.id)) {
          clearTimeout(state.afkChannel.get(oldState.member.id));
          state.afkChannel.delete(oldState.member.id);
        }
        if (state.voiceRoles && state.voiceRoles.length >= 1) {
          const voiceRole = state.voiceRoles.find((voiceRole2) => voiceRole2.voiceChannel === oldState.channelId);
          if (voiceRole && oldState.member.roles.cache.has(voiceRole.role)) {
            if (voiceRole.textChannel) {
              oldState.guild.channels.resolve(voiceRole.textChannel).send({
                embeds: [
                  {
                    color: props.color.red,
                    author: {
                      name: oldState.member.displayName,
                      iconURL: oldState.member.user.avatarURL()
                    }
                  }
                ]
              });
            }
            yield oldState.member.roles.remove(voiceRole.role, "[VoiceRole] Switch/Leave Voice");
            sendEmbed({ member: oldState.member }, {
              color: props.color.cyan,
              author: { name: state.locale.voiceRole.roleRemoved, iconURL: props.icon.role_remove },
              description: `<@${oldState.member.user.id}> -= <@&${voiceRole.role}>`,
              timestamp: new Date()
            }, { guild: true, log: true });
            return;
          }
        }
      } catch (err2) {
        createError("VoiceStateUpdate > Switch/Leave", err2, { guild: oldState.guild });
      }
    }
    if (newState.channelId) {
      try {
        if (state.privateRooms && state.privateRooms.length >= 1) {
          const privateRoom = state.privateRooms.find((privateRoom2) => privateRoom2.room === newState.channelId || privateRoom2.waiting === newState.channelId);
          if (state.privateRoom.generator === newState.channelId) {
            const _privateRoom = yield newState.guild.channels.create(`\u{1F512} ${newState.member.displayName}`, {
              type: "GUILD_VOICE",
              permissionOverwrites: [
                {
                  type: "member",
                  id: newState.member.id,
                  allow: ["CONNECT", "PRIORITY_SPEAKER", "MOVE_MEMBERS"]
                },
                {
                  type: "member",
                  id: client.user.id,
                  allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT", "MOVE_MEMBERS"]
                },
                {
                  type: "role",
                  id: newState.guild.roles.everyone.id,
                  deny: ["CREATE_INSTANT_INVITE", "CONNECT"]
                }
              ],
              parent: newState.guild.channels.resolve(state.privateRoom.generator).parent
            });
            yield newState.member.voice.setChannel(_privateRoom, `[PrivateRoom] Creation`);
            yield newState.guild.channels.resolve(state.privateRoom.generator).permissionOverwrites.edit(newState.member, { VIEW_CHANNEL: false }, { reason: "[PrivateRoom] Creation" });
            const _waitingRoomID = yield (yield newState.guild.channels.create(`\u{1F6AA} ${newState.member.displayName} ${state.locale.privateRoom.waitingRoom}`, {
              type: "GUILD_VOICE",
              permissionOverwrites: [
                {
                  type: "member",
                  id: newState.member.id,
                  allow: ["SPEAK", "PRIORITY_SPEAKER", "MOVE_MEMBERS"]
                },
                {
                  type: "member",
                  id: client.user.id,
                  allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT", "MOVE_MEMBERS"]
                },
                {
                  type: "role",
                  id: newState.guild.roles.everyone.id,
                  deny: ["CREATE_INSTANT_INVITE", "SPEAK"]
                }
              ],
              parent: newState.guild.channels.resolve(state.privateRoom.generator).parent
            })).id;
            const _privateText = yield newState.guild.channels.create(`\u{1F512} ${newState.member.displayName}`, {
              type: "GUILD_TEXT",
              permissionOverwrites: [
                {
                  type: "member",
                  id: newState.member.id,
                  allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                },
                {
                  type: "member",
                  id: client.user.id,
                  allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "READ_MESSAGE_HISTORY"]
                },
                {
                  type: "role",
                  id: newState.guild.roles.everyone.id,
                  deny: ["VIEW_CHANNEL", "CREATE_INSTANT_INVITE", "READ_MESSAGE_HISTORY"]
                }
              ],
              parent: newState.guild.channels.resolve(state.privateRoom.generator).parent
            });
            yield _privateText.send({
              embeds: [
                {
                  color: props.color.green,
                  title: `**\u{1F6AA} ${state.locale.privateRoom.privateRoom}**`,
                  description: `\u2705 **${state.locale.privateRoom.privateTextCreated}**`,
                  timestamp: new Date()
                }
              ]
            });
            state.privateRooms.push({
              host: newState.member.id,
              text: _privateText.id,
              room: _privateRoom.id,
              waiting: _waitingRoomID
            });
            yield configDocRef.update({ privateRooms: state.privateRooms });
            return;
          } else if (state.privateRoom && privateRoom) {
            const privateText = newState.guild.channels.resolve(privateRoom.text);
            if (privateRoom.room === newState.channelId) {
              if (privateRoom.host !== newState.member.id) {
                yield newState.guild.channels.resolve(state.privateRoom.generator).permissionOverwrites.edit(newState.member, { VIEW_CHANNEL: false }, { reason: "[PrivateRoom] Accepted" });
                if (privateText) {
                  yield privateText.permissionOverwrites.edit(newState.member, { VIEW_CHANNEL: true }, { reason: "[PrivateRoom] Accepted" });
                  yield privateText.send({
                    embeds: [
                      {
                        color: props.color.cyan,
                        author: {
                          name: newState.member.displayName,
                          iconURL: newState.member.user.avatarURL()
                        }
                      }
                    ]
                  });
                  return;
                }
              }
            } else if (privateRoom.host !== newState.member.id && privateText)
              yield privateText.send({
                embeds: [
                  {
                    color: props.color.yellow,
                    title: `**\u{1F6AA} ${state.locale.privateRoom.privateRoom}**`,
                    description: `**<@${newState.member.user.id}>${state.locale.privateRoom.waitingForMove}**`,
                    timestamp: new Date()
                  }
                ]
              });
            return;
          }
        }
        if (state.afkChannel && state.afkChannel.has(newState.member.id)) {
          clearTimeout(state.afkChannel.get(newState.member.id));
          state.afkChannel.delete(newState.member.id);
        }
        if (state.afkTimeout > 0 && newState.channelId === newState.guild.afkChannelId) {
          state.afkChannel.set(newState.member.id, setTimeout(() => __async(this, null, function* () {
            try {
              if (!newState.guild.afkChannel.members.has(newState.member.id))
                return;
              yield newState.disconnect("[AFKTimeout] Disconnected due to inactivity");
              sendEmbed({ member: newState.member }, {
                color: props.color.purple,
                description: `**${state.locale.afkTimeout.disconnected_dm.replace("{min}", String(state.afkTimeout))}**`
              }, { dm: true });
              sendEmbed({ member: newState.member }, {
                color: props.color.cyan,
                author: {
                  name: state.locale.afkTimeout.afkTimeout,
                  iconURL: props.icon.call_end
                },
                description: `**<@${newState.member.user.id}>${state.locale.afkTimeout.disconnected.replace("{min}", String(state.afkTimeout))}**`,
                timestamp: new Date()
              }, { guild: true, log: true });
              return;
            } catch (err2) {
              createError("VoiceStateUpdate > AFK", err2, { guild: newState.guild });
            }
          }), state.afkTimeout * 6e4));
          sendEmbed({ member: newState.member }, {
            color: props.color.cyan,
            author: {
              name: `${state.locale.afkTimeout.countdownStarted.replace("{min}", String(state.afkTimeout))}`,
              iconURL: props.icon.timer
            },
            description: `<@${newState.member.user.id}>`,
            timestamp: new Date()
          }, { guild: true, log: true });
          return;
        }
        if (state.voiceRoles && state.voiceRoles.length >= 1) {
          const voiceRole = state.voiceRoles.find((voiceRole2) => voiceRole2.voiceChannel === newState.channelId);
          if (voiceRole && !newState.member.roles.cache.has(voiceRole.role)) {
            yield newState.member.roles.add(voiceRole.role, "[VoiceRole] Join Voice");
            if (voiceRole.textChannel) {
              newState.guild.channels.resolve(voiceRole.textChannel).send({
                embeds: [
                  {
                    color: props.color.cyan,
                    author: {
                      name: newState.member.displayName,
                      iconURL: newState.member.user.avatarURL()
                    }
                  }
                ]
              });
            }
            sendEmbed({ member: newState.member }, {
              color: props.color.cyan,
              author: {
                name: state.locale.voiceRole.roleAppended,
                iconURL: props.icon.role_append
              },
              description: `<@${newState.member.user.id}> += <@&${voiceRole.role}>`,
              timestamp: new Date()
            }, { guild: true, log: true });
            return;
          }
        }
      } catch (err2) {
        createError("VoiceStateUpdate > Join/Switch", err2, { guild: oldState.guild });
      }
    }
  });
}
var init_voiceStateUpdate = __esm({
  "src/events/voiceStateUpdate.ts"() {
    init_createError();
    init_embedSender();
    init_firebase();
    init_app();
    init_props();
  }
});

// src/events/index.ts
var require_events = __commonJS({
  "src/events/index.ts"(exports) {
    init_app();
    init_error();
    init_guildCreate();
    init_guildDelete();
    init_guildMemberAdd();
    init_guildMemberRemove();
    init_interactionCreate();
    init_messageCreate();
    init_messageDelete();
    init_messageReactionAdd();
    init_messageReactionRemove();
    init_messageUpdate();
    init_ready();
    init_roleDelete();
    init_roleUpdate();
    init_voiceStateUpdate();
    client.on("error", (error) => __async(exports, null, function* () {
      return err(error);
    }));
    client.on("guildCreate", (guild) => __async(exports, null, function* () {
      return guildCreate(guild);
    }));
    client.on("guildDelete", (guild) => __async(exports, null, function* () {
      return guildDelete(guild);
    }));
    client.on("guildMemberAdd", (member) => __async(exports, null, function* () {
      return guildMemberAdd(member);
    }));
    client.on("guildMemberRemove", (member) => __async(exports, null, function* () {
      return guildMemberRemove(member);
    }));
    client.on("interactionCreate", (interaction) => __async(exports, null, function* () {
      return interactionCreate(interaction);
    }));
    client.on("messageCreate", (message) => __async(exports, null, function* () {
      return messageCreate(message);
    }));
    client.on("messageDelete", (message) => __async(exports, null, function* () {
      return messageDelete(message);
    }));
    client.on("messageReactionAdd", (reaction, user) => __async(exports, null, function* () {
      return messageReactionAdd(reaction, user);
    }));
    client.on("messageReactionRemove", (reaction, user) => __async(exports, null, function* () {
      return messageReactionRemove(reaction, user);
    }));
    client.on("messageUpdate", (oldMessage, newMessage) => __async(exports, null, function* () {
      return messageUpdate(oldMessage, newMessage);
    }));
    client.on("ready", () => __async(exports, null, function* () {
      return ready();
    }));
    client.on("roleDelete", (role) => __async(exports, null, function* () {
      return roleDelete(role);
    }));
    client.on("roleUpdate", (oldRole, newRole) => __async(exports, null, function* () {
      return roleUpdate(oldRole, newRole);
    }));
    client.on("voiceStateUpdate", (oldState, newState) => __async(exports, null, function* () {
      return voiceStateUpdate(oldState, newState);
    }));
  }
});

// src/app.ts
var app_exports = {};
__export(app_exports, {
  client: () => client,
  locales: () => locales,
  managerCommands: () => managerCommands,
  prefix: () => prefix,
  states: () => states,
  userCommands: () => userCommands
});
module.exports = __toCommonJS(app_exports);
var import_discord2, import_config3, import_api, prefix, client, locales, states, userCommands, managerCommands;
var init_app = __esm({
  "src/app.ts"() {
    init_user();
    init_manager();
    init_locales();
    init_props();
    import_discord2 = require("discord.js");
    import_config3 = require("dotenv/config");
    import_api = __toESM(require_api());
    prefix = process.env.PREFIX || props.bot.prefix;
    client = new import_discord2.Client({
      intents: [
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "GUILDS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_INVITES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_VOICE_STATES",
        "GUILD_WEBHOOKS"
      ]
    });
    locales = new import_discord2.Collection();
    states = new import_discord2.Collection();
    userCommands = new import_discord2.Collection();
    managerCommands = new import_discord2.Collection();
    for (const [code, locale2] of Object.entries(locales_exports)) {
      locales.set(code, locale2);
    }
    for (const [name, command] of Object.entries(user_exports)) {
      userCommands.set(name, command);
    }
    for (const [name, command] of Object.entries(manager_exports)) {
      managerCommands.set(name, command);
    }
    client.login(process.env.TOKEN);
    require_events();
  }
});
init_app();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  client,
  locales,
  managerCommands,
  prefix,
  states,
  userCommands
});
