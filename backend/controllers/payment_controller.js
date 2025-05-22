import sql from 'mssql';
//paying for appointment
// POST /api/payments/checkout
export const checkout = async (req, res) => {
    const d_id = parseInt(req.params.d_id);        // doctor ID from URL
    const p_id = req.user.id;                      // patient ID from token

    if (isNaN(d_id)) {
        return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    const { method, amount } = req.body;

    if (!method || !amount) {
        return res.status(400).json({ message: 'Missing payment data' });
    }

    try {
        const result = await sql.query(`
            EXEC dbo.InsertPayment
            @P_ID = ${p_id},
            @D_ID = ${d_id},
            @Method = '${method}',
            @Amount = ${amount}
        `);

        const response = result.recordset[0];

        if (response.Success === 1) {
            console.log('Payment ID:', response.PaymentID);
            res.json({ success: true, message: response.Message, id: response.PaymentID });
        } else {
            res.status(500).json({ success: false, error: response.Message });
        }

    } catch (err) {
        console.error('Error during payment:', err);
        res.status(500).json({ message: 'Payment failed', error: err.message });
    }
};




//to see payments details//with the payment_ID AND user token
// GET /api/payments/invoice/:id
export const get_invoice = async(req, res) => {
   // const p_id = req.user.id;//from token
    const payment_id = req.params.id;//from param

    if (isNaN(payment_id)) {
        return res.status(400).json({ message: 'Invalid payment ID' });
    } //make sure id is number

    try {
        const result = await sql.query(`
            SELECT Payment_ID, date, amount,method, statuses FROM Payment WHERE Payment_ID = ${payment_id};
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        const invoice = result.recordset[0];
        res.status(200).json(invoice); //send records

    } catch (err) {
        console.error('Error fetching invoice:', err);
        res.status(500).json({ message: 'Error fetching invoice', error: err.message });
    }
};