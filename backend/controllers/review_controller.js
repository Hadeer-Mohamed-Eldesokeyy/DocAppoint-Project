import sql from 'mssql';

export const getDoctorReviews = async (req, res) => {
  const doctorId = parseInt(req.params.doctorId);
  if (isNaN(doctorId)) {
    return res.status(400).json({ error: 'Invalid doctor ID' });
  }

  try {
    const data = `SELECT rating,date FROM rating WHERE D_ID = ${doctorId}`;
    const result = await sql.query(data);
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this doctor' });
    }
    res.send(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching doctor reviews:', err);
    res.status(500).json({ error: 'Failed to fetch doctor reviews' });
  }
};

export const addReview = async (req, res) => {
  const { userId, doctorId, rating, comment } = req.body;

  if (!userId || !doctorId || !rating) {
    return res.status(400).json({ message: 'userId, doctorId, and rating are required' });
  }

  try {
    const data = `INSERT INTO rating (P_ID, D_ID, rating, comment) VALUES (${userId}, ${doctorId}, ${rating}, '${comment}')`;
    const result = await sql.query(data);
    if (result.rowsAffected[0] === 0) {
      return res.status(400).json({ message: 'Failed to add review' });
    }

    res.status(201).json({ message: '✅ Review submitted successfully' });
  } catch (err) {
    console.error('❌ Error adding review:', err);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

export const deleteReview = async (req, res) => {
  const reviewId = parseInt(req.params.id);
  if (isNaN(reviewId)) {
    return res.status(400).json({ message: 'Invalid review ID' });
  }

  try {
    const data = `DELETE FROM rating WHERE review_id = ${R_ID}`;
    const result = await sql.query(data);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'No review found with this ID' });
    }
    res.json({ message: '🗑️ Review deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting review:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
