// export type InteractionType = /* Ping */ 1 | /* ApplicationCommand */ 2 | /* MessageComponent */ 3;

// export interface Interaction {
//   version: number;
//   type: InteractionType;
//   token: string;
//   id: string;
//   guild_id: string;
//   channel_id: string;
//   member: {
//     user: {
//       username: string;
//       public_flags: number;
//       id: string;
//       discriminator: string;
//       avatar: string | null;
//     };
//     roles: string[];
//     premium_since: Date | null;
//     permissions: number;
//     pending: boolean;
//     nick: null;
//     mute: boolean;
//     joined_at: Date;
//     is_pending: boolean;
//     deaf: boolean;
//   };
//   data?: ApplicationCommandInteractionData;
// }

// export interface ApplicationCommandInteractionData {
//   id: string;
//   name: string;
//   resolved?: any;
//   options?: ApplicationCommandInteractionDataOption[];
//   custom_id: string;
//   component_type: number;
// }

// export interface ApplicationCommandInteractionDataOption {
//   name: string;
//   value?: string;
//   options?: ApplicationCommandInteractionDataOption[];
// }

// export interface InteractionResponse {
//   type: InteractionResponseType;
//   data: InteractionApplicationCommandCallbackData;
// }

// type InteractionResponseType = 1 | 4 | 5;

// export interface InteractionApplicationCommandCallbackData {
//   tts?: boolean;
//   content?: string;
//   embeds?: any[];
//   allowed_mentions?: any;
//   flags?: number;
// }
