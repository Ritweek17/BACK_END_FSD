export const handleContactSubmit = (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Here you would typically integrate with an email API (like SendGrid, Nodemailer, etc)
  // using process.env.EMAIL_API_KEY
  console.log(`Received contact form submission from ${name} (${email}): ${message}`);

  res.status(200).json({ success: 'Message sent successfully!' });
};
