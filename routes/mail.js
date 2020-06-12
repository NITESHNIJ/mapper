const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

exports.send_mail = (reciever,subject,html) => {
    const oauth2Client = new OAuth2(
        "486193421840-5jrlk91ea8pa9mmqec8isfbmfunj1sa9.apps.googleusercontent.com", // ClientID
        "I0F3uEqfTo3tUGFofy4V_gOE", // Client Secret
        "https://developers.google.com/oauthplayground" // Redirect URL
   );

   oauth2Client.setCredentials({
        refresh_token: "1//04DgpNyJGpMPLCgYIARAAGAQSNwF-L9IrpFHjYUexEOx5aEwXDbIf0U_Sr-cSWn6QR_wuCMkg9LCoyXEEirI6QTGp1_gsYIiKjS8"
    });
    const accessToken = oauth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "niteshnijhawan99@gmail.com", 
            clientId: "486193421840-5jrlk91ea8pa9mmqec8isfbmfunj1sa9.apps.googleusercontent.com",
            clientSecret: "I0F3uEqfTo3tUGFofy4V_gOE",
            refreshToken: "1//04DgpNyJGpMPLCgYIARAAGAQSNwF-L9IrpFHjYUexEOx5aEwXDbIf0U_Sr-cSWn6QR_wuCMkg9LCoyXEEirI6QTGp1_gsYIiKjS8",
            accessToken: accessToken
        }
    });
    
    const mailOptions = {
        from: "niteshnijhawan99@gmail.com",
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