const CompanyUpdate = require('../models/CompanyUpdate');

// @desc    Get all company updates
// @route   GET /api/company-updates
// @access  Public
const getCompanyUpdates = async (req, res) => {
    try {
        const updates = await CompanyUpdate.find().populate('createdBy', 'firstName lastName').sort({ createdAt: -1 });
        res.json(updates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a company update
// @route   POST /api/company-updates
// @access  Private/Admin
const createCompanyUpdate = async (req, res) => {
    try {
        const { title, description, image, type } = req.body;
        
        const update = await CompanyUpdate.create({
            title,
            description,
            image,
            type,
            createdBy: req.user._id
        });

        res.status(201).json(update);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a company update
// @route   DELETE /api/company-updates/:id
// @access  Private/Admin
const deleteCompanyUpdate = async (req, res) => {
    try {
        const update = await CompanyUpdate.findById(req.params.id);
        
        if (!update) {
            return res.status(404).json({ message: 'Update not found' });
        }

        await update.deleteOne();
        res.json({ message: 'Update removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCompanyUpdates,
    createCompanyUpdate,
    deleteCompanyUpdate
};
