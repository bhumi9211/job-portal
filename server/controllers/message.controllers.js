import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";
import {io} from '../config/socket.js'


export const getChatPartners = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    });
    const chatPartnersIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === currentUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];
    const chatPartners = await User.find({ _id: chatPartnersIds }).select(
      "-password"
    );
    res.status(200).json(chatPartners);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllChatPartners = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const role = req.user.role;

    // ================= STUDENT =================
    if (role === "student") {
      const professors = await User.find({
        role: "professor",
      }).select("-password");

      return res.status(200).json(professors);
    }

    // ================= PROFESSOR =================
    if (role === "professor") {
      // 1️⃣ Other professors (exclude self)
      const otherProfessors = await User.find({
        role: "professor",
        _id: { $ne: currentUserId },
      }).select("-password");

  
      const chatPartners = [...otherProfessors];

      return res.status(200).json(chatPartners);
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { text } = req.body;
    const receiverId = req.params.id;

    // 👇 image comes from multer, NOT body
    const imageFile = req.file;
    console.log("BODY:", req.body);
console.log("FILE:", req.file);


    if (!text && !imageFile) {
      return res.status(400).json({
        message: "Message text or image is required",
      });
    }

    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "You cannot send message to yourself" });
    }

    let imageUrl;

    if (imageFile) {
      imageUrl = await uploadOnCloudinary(imageFile.buffer, imageFile.originalname);
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    io.to(receiverId.toString()).emit("newMessage", newMessage);
    
    return res.status(200).json(newMessage);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const search = async (req, res) => {
  try {
    const { search } = req.query;
    
    if (search.length < 2) {
      return res.json({ users: [] });
    }

    const users = await User.find({
      _id: { $ne: req.user.id },
      fullName: { $regex: search, $options: 'i' }  // Name-only search
    })
    .select('fullName role profileImage')
    .limit(10)
    .lean();

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Search failed' });
  }
};


