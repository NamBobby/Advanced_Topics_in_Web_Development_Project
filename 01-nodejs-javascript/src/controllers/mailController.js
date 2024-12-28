const { sendMail } = require("../services/mailService");


const SendEmail = async (req, res) => {
    const { from, to, subject, html } = req.body;
    const mailOptions = {
      from,
      to: [to], 
      subject,
      html
    };
    const data = await sendMail(mailOptions);
    if (data.EC !== 0) {
      return res.status(400).json(data);
    }
    return res.status(200).json(data);
};
  
module.exports = {
    SendEmail
}