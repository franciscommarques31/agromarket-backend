const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthDate: { type: Date },
    city: { type: String },
    country: { type: String },
    phone: { type: String },

    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isAdmin: { type: Boolean, default: false },

 
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
