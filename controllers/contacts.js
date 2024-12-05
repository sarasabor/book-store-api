import { Resend } from "resend";
import Contact from "../models/Contact.js";
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const apiContact = async (req, res) => {
    const { name, email, message } = req.body;

    try {

        const emailResponse = await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>',
            to: 'saborsara.wad@gmail.com',
            replyTo: email,
            subject: 'New Contact Form Submission',
            html: `
                <p><strong>Name: </strong>${name}</p>
                <p><strong>Email: </strong>${email}</p>
                <p><strong>Message: </strong>${message}</p>
            `,
          });

        //* Save Data To Database;
        const contact = new Contact({ name, email, message });

        await contact.save();

        res.status(200).json({ messager: 'Form Submitted successfully'});
        
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', error});
    }
}

