// =============================================
// server.js - Main Express Server
// =============================================

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// --- App Setup ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors());                        // Allow cross-origin requests
app.use(express.json());                // Parse incoming JSON request bodies
app.use(express.static('public'));      // Serve frontend files from /public folder

// --- Supabase Client Setup ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// =============================================
// ROUTES - REST API Endpoints
// =============================================

// --- GET /api/students ---
// Fetch all students, or search by name/email/course/phone
app.get('/api/students', async (req, res) => {
  try {
    const { search } = req.query; // e.g. /api/students?search=john

    let query = supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false }); // Newest first

    // If a search term is provided, filter across multiple fields
    if (search && search.trim() !== '') {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,course.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching students:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- GET /api/students/:id ---
// Fetch a single student by their ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)   // WHERE id = :id
      .single();      // Expect only one result

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching student:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- POST /api/students ---
// Add a new student
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, course, phone } = req.body;

    // Basic server-side validation
    if (!name || !email || !course || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('students')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(409).json({ success: false, message: 'A student with this email already exists.' });
    }

    // Insert the new student
    const { data, error } = await supabase
      .from('students')
      .insert([{ name, email, course, phone }])
      .select() // Return the inserted row
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data, message: 'Student added successfully!' });
  } catch (error) {
    console.error('Error adding student:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- PUT /api/students/:id ---
// Update an existing student's information
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, course, phone } = req.body;

    // Basic server-side validation
    if (!name || !email || !course || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Check if the new email is already taken by a DIFFERENT student
    const { data: existing } = await supabase
      .from('students')
      .select('id')
      .eq('email', email)
      .neq('id', id)  // Exclude the current student's own record
      .single();

    if (existing) {
      return res.status(409).json({ success: false, message: 'This email is already used by another student.' });
    }

    // Perform the update
    const { data, error } = await supabase
      .from('students')
      .update({ name, email, course, phone })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data, message: 'Student updated successfully!' });
  } catch (error) {
    console.error('Error updating student:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- DELETE /api/students/:id ---
// Delete a student by ID
app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Student deleted successfully!' });
  } catch (error) {
    console.error('Error deleting student:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📚 Student Management System is ready!\n`);
});
