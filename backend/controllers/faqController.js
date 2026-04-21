const FAQ = require('../models/FAQ');

const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({});
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create({
      question: req.body.question,
      answer: req.body.answer
    });
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (faq) {
      faq.question = req.body.question || faq.question;
      faq.answer = req.body.answer || faq.answer;
      
      const updatedFAQ = await faq.save();
      res.json(updatedFAQ);
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (faq) {
      await faq.deleteOne();
      res.json({ message: 'FAQ removed' });
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFAQs, createFAQ, updateFAQ, deleteFAQ };
