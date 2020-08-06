const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

exports.send_mail = (reciever,subject,html) => {
    const oauth2Client = new OAuth2(
        "860836230484-8v186r03m65jg5660lnn33nju6m7jbnq.apps.googleusercontent.com", // ClientID
        "8v3iui62AD_ckMmZTEhzBzFZ", // Client Secret
        "https://developers.google.com/oauthplayground" // Redirect URL
   );

   oauth2Client.setCredentials({
        refresh_token: "1//04ci2qE_5hSpGCgYIARAAGAQSNwF-L9IrDFYY0TcKFHP-9wFzn4MFVbTvW5N6eN-EtyKeqz7Hog0lhA8bk-a21_-tHmBupoVr-dU"
    });
    const accessToken = oauth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "niteshnijhawan100@gmail.com", 
            clientId: "860836230484-8v186r03m65jg5660lnn33nju6m7jbnq.apps.googleusercontent.com",
            clientSecret: "8v3iui62AD_ckMmZTEhzBzFZ",
            refreshToken: "1//04ci2qE_5hSpGCgYIARAAGAQSNwF-L9IrDFYY0TcKFHP-9wFzn4MFVbTvW5N6eN-EtyKeqz7Hog0lhA8bk-a21_-tHmBupoVr-dU",
            accessToken: accessToken
        }
    });
    
    const mailOptions = {
        from: "niteshnijhawan100@gmail.com",
        to: reciever,
        subject: subject,
        generateTextFromHTML: true,
        html: html
    };

    transporter.sendMail(mailOptions, (err,response)=>{
        if(err)
            console.log(err);
        else
            console.log(response);
        transporter.close();
    });

}