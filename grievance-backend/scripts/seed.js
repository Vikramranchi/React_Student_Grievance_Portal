// seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const CommitteeMember = require('../models/CommitteeMember'); // Adjust the path based on your project structure

// Hardcoded MongoDB URI
const uri = "mongodb+srv://vikramraj312002:Raj%406466624571@cluster0.z6tln.mongodb.net/Student_Management?retryWrites=true&w=majority";

const members = [
  { email: "btech10057.15@bitmesra.ac.in", password: "Vi@6264664570" },
  { email: "mtech10099.11@bitmesra.ac.in", password: "Vi@7462009932" },
  { email: "polyt15679.22@bitmesra.ac.in", password: "Vi@9631538810" },
  { email: "comps12454.12@bitmesra.ac.in", password: "Vi@728951122" },
  { email: "mecha56789.11@bitmesra.ac.in", password: "Vi@9631549910" },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    for (const member of members) {
      const hashedPassword = await bcrypt.hash(member.password, 10);
      const newMember = new CommitteeMember({
        email: member.email,
        password: hashedPassword,
      });
      await newMember.save();
      console.log(`Added member: ${member.email}`);
    }

    console.log("All members added to the database.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error adding members to the database:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
