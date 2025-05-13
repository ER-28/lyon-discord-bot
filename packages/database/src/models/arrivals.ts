import { model, Schema } from "mongoose";

export interface IArrival {
  member_id: string;
  status: "pending" | "accepted" | "refused";
  channel_id: string;
  presentation: string;
  message_id: string;
}

export const arrivalSchema = new Schema<IArrival>({
  member_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "refused"],
    default: "pending",
  },
  channel_id: {
    type: String,
    required: true,
  },
  presentation: {
    type: String,
    required: true,
  },
  message_id: {
    type: String,
    required: true,
  },
});

export const Arrival = model<IArrival>("Arrival", arrivalSchema);