import { connect } from 'mongoose';

export const connectDatabase = async (url: string) => {
  await connect(url);
}