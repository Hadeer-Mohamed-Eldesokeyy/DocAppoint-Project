import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';






//for signing up
export const register = async(req, res) => {
    const { username, email, password, phone, gender } = req.body;

    if (!email || !password || !username || !phone || !gender) {
        return res.status(400).json({ message: 'Missing required fields' });
    }//make sure data is given

    const hashedPassword = bcrypt.hashSync(password, 8); //encrypt pasword
    try {
        const result = await sql.query(`
            EXEC dbo.InsertUser
            @user_name = '${username}',      
            @email = '${email}',
            @password = '${hashedPassword}',
            @phone = '${phone}',
            @gender = '${gender}'
        `);
        //make sure user does not exist
        res.status(201).json({ message: 'User registered' }); // and added to the database

    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Error saving user', error: err.message });
    }
};


//logging
export const login = async(req, res) => {
    const {email, password} = req.body;

    if (!email || !password ) {
        return res.status(400).json({ message: 'Missing required fields' });
    }//make sure data is given

    try {
    
        const result = await sql.query(`
            SELECT * FROM [user] WHERE email = '${email}'
        `);

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Email not found!' });
        }//make sure email exists

        const user = result.recordset[0];//get the rest of user data

        const matching = bcrypt.compareSync(password, user.password);
        if (!matching) {
            return res.status(401).json({ message: 'INCORRECT PASSWORD!' });
        }//encrypt and match with encrypted password

        const token = jwt.sign({ id: user.ID }, process.env.JWT_SECRET, { expiresIn: '1h' });//make the users login token

        res.status(200).json({
            message: 'Login successful!',
            token: {
                id: user.ID,
                username: user.name,
                email: user.email,
                token: token//this is the token that will be used 
            }
        });

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};

// Get user profile
export const get_userprofile = async (req, res) => {
    const user_id = req.user.id;  // User id stored in the token

    try {

        const result = await sql.query(`
            SELECT ID, user_name, email, phone, gender
            FROM [user]
            WHERE ID = ${user_id}
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }//make sure user exists
        res.status(200).json(result.recordset[0]); //send records

    } catch (err) {
        console.error('Error retrieving user data:', err);
        res.status(500).json({ message: 'Error retrieving user data!', error: err.message });
    }
};

//update userprofile
export const update_userprofile = async(req, res) => {
    const { email, username ,phone} = req.body;
    const user_id = req.user.id;  // User id from token

    if (!email && !username && !phone) {
        return res.status(400).json({ message: 'Email or username required' });
    }//make sure data is given

    try {
        // Define query and dynamically add parameters
        let query = 'UPDATE [user] SET ';

        if (email) {
            query += `email = '${email}', ` ;
        }

        if (username) {
            query += `user_name = '${username}', `;
        }

        if (phone) {
            query += `phone = '${phone}', `;

        }

        // Remove trailing comma and space
        query = query.slice(0, -2);
        query +=  `WHERE ID = ${user_id}`;

        // Execute the query
        const result = await sql.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }//make sure user exists

        res.status(200).json({ message: 'Profile updated successfully' });

    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Error updating profile!', error: err.message });
    }
};


export const change_password = async(req, res) => {

    const {old_password, new_password} = req.body;
    const user_id = req.user.id;  // User id from token

    if (!new_password || !old_password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }//make sure data is given

   
    try {
        
        const result = await sql.query(`
            SELECT * FROM [user] WHERE ID = ${user_id}
        `);

        const user = result.recordset[0];
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const matching = bcrypt.compareSync(old_password, user.password);  
        if (!matching) {
            return res.status(401).json({ message: 'INCORRECT PASSWORD!' });
        }//match with encrypted password
        
        const new_hashedPassword = bcrypt.hashSync(new_password, 8); //encrypt pasword
        await sql.query(`
           update [user] set password
            = '${new_hashedPassword}' where ID = '${user_id}'
        `);

        res.status(201).json({ message: 'Password changed successfully' }); // and added to the database

    }catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ message: 'Error changing password!', error: err.message });
    }

};


//200 --> 0k
//401 --> unauthorized
//500 --> server error
//201 --> created
//400 --> bad request // missing stuff
//403 --> not allowed 
//404 --> not found


