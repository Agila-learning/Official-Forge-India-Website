const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = async (req, res) => {
    try {
        const { subject, description, priority, category, relatedOrder } = req.body;
        const ticket = await Ticket.create({
            user: req.user._id,
            subject,
            description,
            priority,
            category,
            relatedOrder
        });

        // Also create a notification for admin (simulated by not specifying a user)
        await Notification.create({
            title: 'New Support Ticket Created',
            message: `Subject: ${subject} from ${req.user.firstName}`,
            type: 'Support',
            link: `/admin?view=tickets&id=${ticket._id}`
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all tickets (Admin) or user's tickets
// @route   GET /api/tickets
// @access  Private
exports.getTickets = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'Admin') {
            query.user = req.user._id;
        }
        const tickets = await Ticket.find(query).populate('user', 'firstName lastName email').sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update ticket (Admin can update status/priority, User can edit within 5 mins)
// @route   PUT /api/tickets/:id
// @access  Private
exports.updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Admin can update anything (status, priority)
        if (req.user.role === 'Admin') {
            ticket.status = req.body.status || ticket.status;
            ticket.priority = req.body.priority || ticket.priority;
        } else {
            // User/Vendor can only edit if it's their ticket and within 5 minutes of creation
            if (ticket.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to edit this ticket' });
            }

            // Lock if already resolved or closed (Strategic Enforcement)
            if (['Resolved', 'Closed'].includes(ticket.status)) {
                return res.status(400).json({ message: 'This ticket has been finalized and cannot be modified.' });
            }

            if (ticket.status !== 'Open') {
                return res.status(400).json({ message: 'Cannot edit a ticket that is already being processed' });
            }
            
            // Vendors/Users CANNOT manually resolve tickets (Strategic Enforcement)
            if (req.body.status && req.body.status === 'Resolved') {
                 return res.status(403).json({ message: 'Only Forge India Admin can authorize ticket resolution.' });
            }

            const fiveMinutes = 5 * 60 * 1000;
            const timeElapsed = Date.now() - new Date(ticket.createdAt).getTime();

            if (timeElapsed > fiveMinutes) {
                return res.status(400).json({ message: 'Edit window (5 minutes) has expired' });
            }

            ticket.subject = req.body.subject || ticket.subject;
            ticket.description = req.body.description || ticket.description;
            ticket.priority = req.body.priority || ticket.priority;
            ticket.category = req.body.category || ticket.category;
        }

        const updatedTicket = await ticket.save();

        // Notify user if Admin updated it
        if (req.user.role === 'Admin') {
            await Notification.create({
                user: ticket.user,
                title: 'Support Ticket Update',
                message: `Your ticket "${ticket.subject}" status changed to ${ticket.status}`,
                type: 'Support'
            });
        }

        res.json(updatedTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
exports.deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Only Admin or the Ticket owner can delete
        if (req.user.role !== 'Admin' && ticket.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this ticket' });
        }

        // Cannot delete if already processed (unless Admin)
        if (req.user.role !== 'Admin' && ticket.status !== 'Open') {
            return res.status(400).json({ message: 'Cannot delete a ticket that is already being processed' });
        }

        await ticket.deleteOne();
        res.json({ message: 'Ticket removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
