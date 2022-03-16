import nodemailer from "nodemailer";
const sendEmail = async (options: any) => {
  // create reusable transporter object
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  // send mail with transport object
  const message = {
    from: `${process.env.USER_EMAIL}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.log("err");
  }
};

export default sendEmail;
