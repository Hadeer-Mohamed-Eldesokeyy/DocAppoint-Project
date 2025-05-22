import sql from 'mssql';
export const show_doctor =   async (req, res) => {
    const { city, speciality } = req.query;
  
    try {
      // Query the database to fetch doctors based on filters
      let query = 'SELECT D_ID, photoURL, name, speciality, rating, city FROM Doctor WHERE 1=1';
      if (city) {
        query += ` AND LOWER(city) = LOWER('${city}')`;
      }
      if (speciality) {
        query += ` AND LOWER(speciality) = LOWER('${speciality}')`;
      }
  
      const result = await sql.query(query);
      // Send the filtered doctors' details
      res.send(result.recordset);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      res.status(500).json({ error: 'An error occurred while fetching doctors' });
    }
  };


  export const get_doctor_by_id = async (req, res) => {
    const doctorId = req.params.id;
    console.log('doctorid:', doctorId, 'type:', typeof doctorId)
    try {
      // Query the database to fetch doctor details by id
      const query = `SELECT photoURL, name, speciality, city, working_days, working_hours, contact_info, rating FROM Doctor WHERE D_ID = '${doctorId}'`;
      const result = await sql.query(query);
      console.log(result.recordset)
      // Check if the doctor exists in the database
      if (result.recordset.length > 0) {
        const doctorDetails = result.recordset[0];
        res.send(doctorDetails);
      } else {
        res.status(404).json({ error: 'Doctor not found' });
      }
    } catch (err) {
      console.error('Error fetching doctor details:', err);
      res.status(500).json({ error: 'An error occurred while fetching doctor details' });
    }
  };
  





  export const add_doctor = async (req, res) => {
    const { UserName, Email, Password, Phone, Gender, Speciality, City, Price, WorkingHours, Rating, WorkingDays, photoURL } = req.body;
  
    try {
      const query = `
        EXEC dbo.InsertDoctorWithUser 
        @UserName = '${UserName}', @Email = '${Email}', @Password = '${Password}', 
        @Phone = '${Phone}', @Gender = '${Gender}', @Speciality = '${Speciality}', @city = '${City}', 
        @Price = ${Price}, @WorkingHours = '${WorkingHours}', @Rating = ${Rating}, 
        @WorkingDays = '${WorkingDays}', @photoURL = '${photoURL}';
      `;
      const result = await sql.query(query);
      console.log(result.recordset)
  
      res.status(201).json({ message: 'Doctor added successfully', data: result.recordset });
    } catch (err) {
      console.error('Error adding doctor:', err);
      res.status(500).json({ error: 'An error occurred while adding the doctor' });
    }
  };
  


  export const update_doctor = async (req, res) => {
    const doctorId = req.params.id;
    console.log('doctorid:', doctorId, 'type:', typeof doctorId)
    const { City, Price, WorkingHours, WorkingDays, ContactInfo, photoURL } = req.body;
  
    try {
      const query = `
        EXEC dbo.UpdateDoctorDetails 
        @D_ID= '${doctorId}', @city = '${City}', 
        @Price = ${Price}, @working_hours = '${WorkingHours}', 
        @working_days = '${WorkingDays}', @contact_info = '${ContactInfo}', @photoURL = '${photoURL}';
      `;
      const result = await sql.query(query);
      console.log(result.recordset)
  
      res.status(201).json({ message: 'Doctor added successfully', data: result.recordset });
    } catch (err) {
      console.error('Error adding doctor:', err);
      res.status(500).json({ error: 'An error occurred while adding the doctor' });
    }
  };
  
  
  export const delete_doctor =  async (req, res) => {
    const doctorId = req.params.id;
    console.log('doctorid:', doctorId)
    try {
      const query = `EXEC dbo.DeleteDoctor @DoctorID = '${doctorId}';`;
      await sql.query(query);
  
      res.json({ message: 'Doctor deleted successfully' });
    } catch (err) {
      console.error('Error deleting doctor:', err);
      res.status(500).json({ error: 'An error occurred while deleting the doctor' });
    }
  };