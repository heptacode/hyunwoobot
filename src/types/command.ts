export interface Command {
  id?: string;
  name: string;
  version?: number;
  messageOnly?: boolean;
  options?: Function;
  execute?: Function;
  private?: boolean;
}

export interface CommandOptions {
  type: CommandOptionType;
  name: string;
  description: string;
  required?: boolean;
  choices?: CommandOptionChoice[];
  options?: CommandOptions[];
}

export type CommandOptionType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface CommandOptionChoice {
  name: string;
  value: number | string;
}
