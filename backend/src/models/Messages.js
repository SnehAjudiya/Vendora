import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = Schema(
  {
    roomId: { type: String, required: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true },

    // receiver Id
    isRead: { type: Boolean, default: false }
    // isDeleted
  },
  { timestamps: true }
)

export default mongoose.model("Messages", messageSchema);
