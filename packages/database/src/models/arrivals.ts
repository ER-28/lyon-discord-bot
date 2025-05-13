import { Schema, model } from "mongoose";

export interface IArrival {
  status: "pending" | "accepted" | "refused";

  member_id: string;
  channel_id?: string | null;
  message_id?: string | null;

  presentation?: string | null;
  presentation_message_id?: string | null;
}

export const arrivalSchema = new Schema<IArrival>({
  status: {
    type: String,
    enum: ["pending", "accepted", "refused"],
    default: "pending",
  },
  member_id: {
    type: String,
    required: true,
  },
  channel_id: {
    type: String,
    required: false,
  },
  message_id: {
    type: String,
    required: false,
  },
  presentation: {
    type: String,
    required: false,
  },
  presentation_message_id: {
    type: String,
    required: false,
  },
});

export const Arrival = model<IArrival>("Arrival", arrivalSchema);
