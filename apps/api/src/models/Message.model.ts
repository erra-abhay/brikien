import mongoose, { Schema } from 'mongoose';
import { IMessage } from '@brikien/types';

const messageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  ipHash: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);
