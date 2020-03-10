using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit;
using MimeKit;
using System.Security.Cryptography.X509Certificates;
using Google.Apis.Auth.OAuth2;

namespace ProjectWork.classi
{
    public class MailSender
    {
        public static void Send()
        {
            var certificate = new X509Certificate2(@"C:\Users\dirom\Downloads\client_secret_263043063844-6lded6hnl71c3q4r0pf3qcauk0jhhnl9.apps.googleusercontent.com", "9Dd5rtREfG2EzqN56h28AX5p", X509KeyStorageFlags.Exportable);
            //var credential = new ServiceAccountCredential(new ServiceAccountCredential
            //    .Initializer());

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Alessandro", "diromaalessandro@gmail.com"));
            message.To.Add(new MailboxAddress("Mrs. Alessandro", "alessandro.diroma.studio@fitstic-edu.com"));
            message.Subject = "Funziona?";

            message.Body = new TextPart("plain")
            {
                Text = @"Ciao mondo"
            };

            using (var client = new SmtpClient())
            {
                // For demo-purposes, accept all SSL certificates (in case the server supports STARTTLS)
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                client.Connect("smtp.gmail.com", 587, false);

                // Note: only needed if the SMTP server requires authentication
                client.Authenticate("diromaalessandro@gmail.com", ".taralluccievino..");

                client.Send(message);
                client.Disconnect(true);
            }
        }
    }
}
