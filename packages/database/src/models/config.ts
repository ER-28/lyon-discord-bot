import { Schema, model } from "mongoose";

export interface IConfig {
  guildId: string;
  channel: {
    presentation?: string | null;
    welcome?: string | null;
  };
  roles: {
    admin?: string | null;
    member?: string | null;
  };
}

export const configSchema = new Schema<IConfig>({
  guildId: {
    type: String,
    required: true,
  },
  channel: {
    presentation: {
      type: String,
      required: false,
    },
    welcome: {
      type: String,
      required: false,
    },
  },
  roles: {
    admin: {
      type: String,
      required: false,
    },
    member: {
      type: String,
      required: false,
    },
  },
});

export const Config = model<IConfig>("Config", configSchema);
