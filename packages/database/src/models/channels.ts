import { Schema, model } from "mongoose";

export interface IChannel {
  channelId: string;
  name: string;
  type: string;
}

export const channelSchema = new Schema<IChannel>({
  channelId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

export const Channel = model<IChannel>("Channel", channelSchema);
