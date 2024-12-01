import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GrievanceForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    course: "",
    program: "",
    phoneNumber: "",
    email: "",
    category: "",
    description: "",
  });
  const navigate = useNavigate();

  const emailPattern = /^[a-zA-Z]{1,5}\d{1,5}\.\d{2}@bitmesra\.ac\.in$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://react-student-grievance-portal-8.onrender.com/api/grievances", formData);
      alert("Your grievance has been submitted successfully!");
      navigate("/first");
      setFormData({
        name: "",
        rollNo: "",
        course: "",
        program: "",
        phoneNumber: "",
        email: "",
        category: "",
        description: "",
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting grievance: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Updated Header */}
      <header className="bg-blue-500 text-white py-4 fixed w-full top-0 z-10 flex flex-col items-center">
        <h2 className="text-lg font-bold">Birla Institute of Technology</h2>
        <div className="flex items-center justify-center">
        <img
        src="/Logo.jpg" // Make sure the logo is placed in the public folder
        alt="Logo"
        className="absolute left-0 ml-4 h-24 border-2 border-white shadow-md"
      />

          <h1 className="text-2xl font-bold">Submit Your Grievance</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center pt-28">
        <form className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-4">
            <label htmlFor="name" className="block font-bold mb-1">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="rollno" className="block font-bold mb-1">Roll No:</label>
            <input
              type="text"
              id="rollno"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              required
              pattern="MCA/\d{5}/\d{2}"
              className="block w-full p-2 border rounded"
              title="Please enter the roll number in the correct format (e.g., MCA/10057/23)"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="course" className="block font-bold mb-1">Course:</label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              className="block w-full p-2 border rounded"
            >
              <option value="">Select Course</option>
              <option value="Architecture and Planning">Architecture and Planning</option>
              <option value="Bioengineering and Biotechnology">Bioengineering and Biotechnology</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Chemical Engineering">Chemical Engineering</option>
              <option value="Computer Science and Engineering">Computer Science and Engineering</option>
              <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Production Engineering">Production Engineering</option>
              <option value="M.Pharma">M.Pharma</option>
              <option value="B.Pharma">B.Pharma</option>
              <option value="Information Technology">Information Technology</option>
              <option value="IMSC Mathematics and Computing">IMSC Mathematics and Computing</option>
              <option value="MBA">MBA</option>
              <option value="MCA">MCA</option>
              <option value="Bachelor of Architecture">Bachelor of Architecture</option>
              <option value="Bachelor of Food Technology">Bachelor of Food Technology</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="program" className="block font-bold mb-1">Program:</label>
            <select
              id="program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              required
              className="block w-full p-2 border rounded"
            >
              <option value="">Select Program</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="Msc">Msc</option>
              <option value="IMSC">IMSC</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="phonenumber" className="block font-bold mb-1">Phone Number:</label>
            <input
              type="tel"
              id="phonenumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="block w-full p-2 border rounded"
              title="Please enter a 10-digit phone number"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-1">Email ID:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              pattern={emailPattern.source}
              className="block w-full p-2 border rounded"
              title="Please enter the email in the correct format (e.g., abc10057.23@bitmesra.ac.in)"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block font-bold mb-1">Grievance Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="block w-full p-2 border rounded"
            >
              <option value="">Select Category</option>
              <option value="Academic">Academic</option>
              <option value="Financial">Financial</option>
              <option value="Hostel">Hostel</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block font-bold mb-1">Grievance Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="block w-full p-2 border rounded"
            ></textarea>
          </div>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            Submit
          </button>
        </form>
      </main>
    </div>
  );
};

export default GrievanceForm;
