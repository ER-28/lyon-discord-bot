import {model, Schema} from "mongoose";

export interface IRole {
  id: string;
  name: string;
}

export const roleSchema = new Schema<IRole>({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

export const User = model<IRole>('Role', roleSchema);