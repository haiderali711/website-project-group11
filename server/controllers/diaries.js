const mongoose = require('mongoose');

const Diary = require('../models/Diary');

const createNewDiaryPage = (req, res) => {
  const page = new Diary({
    _id: new mongoose.Types.ObjectId(),
    content: req.body.content,
    user: req.body.user,
    published: req.body.published
  });

  page
    .save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
};

//Get all the pages of the diary
const getDiary = (req, res, next) => {
  Diary.find(function(err, foundPages) {
    if (err) {
      return next(err);
    }
    if (foundPages === null) {
      return res.status(404).json({ message: 'No Pages found at all ' });
    }
    res.json({ AllPages: foundPages });
  }).populate('user', 'username');
};

const getDiaryWithDate = (req, res, next) => {
  const date = new Date(req.params.date);
  const nextDate = new Date(req.params.date);

  nextDate.setDate(nextDate.getDate(date) + 1);

  Diary.find({ published: { $gte: date, $lt: nextDate } }, function(
    err,
    foundPage
  ) {
    if (err) {
      return next(err);
    }
    if (foundPage === null) {
      return res.status(404).json({ message: 'No Page on the same date' });
    }
    res.json(foundPage);
  }).populate('user', 'username');
};

const deleteDiaryPage = (req, res, next) => {
  const date = new Date(req.params.date);
  const nextDate = new Date(req.params.date);
  nextDate.setDate(nextDate.getDate(date) + 1);

  Diary.findOneAndDelete(
    { published: { $gte: date, $lt: nextDate } },
    (err, foundPage) => {
      if (err) {
        return next(err);
      }
      if (foundPage === null) {
        return res.status(404).json({ message: 'No page on this Date' });
      }
      res.json(foundPage);
    }
  );
};

module.exports = {
  createNewDiaryPage,
  getDiaryWithDate,
  deleteDiaryPage,
  getDiary
};
