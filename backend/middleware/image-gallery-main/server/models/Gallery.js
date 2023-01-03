const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  images: {
    type: [String],
    required: false,
  },
});

module.exports = mongoose.model("galleries", gallerySchema);
