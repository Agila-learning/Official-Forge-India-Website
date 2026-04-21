const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get messages between current user and another user
// @route   GET /api/chat/:userId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'firstName lastName role')
      .populate('receiver', 'firstName lastName role');

    // Mark messages as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all chat threads for current user (list of conversations)
// @route   GET /api/chat/threads
// @access  Private
const getThreads = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all unique conversation partners
    const sentMessages = await Message.find({ sender: userId }).distinct('receiver');
    const receivedMessages = await Message.find({ receiver: userId }).distinct('sender');

    const partnerIds = [...new Set([...sentMessages.map(String), ...receivedMessages.map(String)])];

    const threads = await Promise.all(
      partnerIds.map(async (partnerId) => {
        const partner = await User.findById(partnerId).select('firstName lastName role');
        const lastMessage = await Message.findOne({
          $or: [
            { sender: userId, receiver: partnerId },
            { sender: partnerId, receiver: userId },
          ],
        }).sort({ createdAt: -1 });

        const unreadCount = await Message.countDocuments({
          sender: partnerId,
          receiver: userId,
          isRead: false,
        });

        return { partner, lastMessage, unreadCount };
      })
    );

    res.json(threads.filter((t) => t.partner));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a new message (REST fallback, main is Socket.IO)
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, messageType, fileUrl } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      messageType: messageType || 'text',
      fileUrl,
    });
    const populated = await message.populate('sender', 'firstName lastName role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users current user can chat with (based on role)
// @route   GET /api/chat/contacts
// @access  Private
const getChatContacts = async (req, res) => {
  try {
    const currentUser = req.user;
    let allowedRoles = [];

    if (currentUser.role === 'Admin' || currentUser.role === 'Sub-Admin') {
      allowedRoles = ['Vendor', 'HR', 'Admin', 'Sub-Admin', 'Delivery Partner', 'Customer', 'Candidate'];
    } else if (currentUser.role === 'Vendor') {
      allowedRoles = ['Admin', 'Sub-Admin', 'Customer'];
    } else if (currentUser.role === 'HR') {
      allowedRoles = ['Admin', 'Sub-Admin', 'Candidate'];
    } else if (currentUser.role === 'Candidate') {
      allowedRoles = ['HR', 'Admin', 'Sub-Admin'];
    } else if (currentUser.role === 'Customer') {
      allowedRoles = ['Admin', 'Sub-Admin'];
    } else if (currentUser.role === 'Delivery Partner') {
      allowedRoles = ['Admin', 'Sub-Admin'];
    }

    const contacts = await User.find({
      role: { $in: allowedRoles },
      _id: { $ne: currentUser._id },
      approvalStatus: 'Approved',
    }).select('firstName lastName role businessName companyName');

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editMessage = async (req, res) => {
  try {
    const { messageId, content } = req.body;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.sender.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });
    
    message.content = content;
    message.isEdited = true;
    await message.save();
    res.json(message);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.sender.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });
    
    await message.deleteOne();
    res.json({ message: 'Message deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getMessages, getThreads, sendMessage, getChatContacts, editMessage, deleteMessage };
