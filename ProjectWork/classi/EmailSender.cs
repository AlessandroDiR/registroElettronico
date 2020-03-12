using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using ProjectWork.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ProjectWork.classi
{
    public class EmailSender
    {
        public string SendEmail(Coordinatori c)
        {
            SmtpClient client = new SmtpClient()
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential
                {
                    UserName = "registro.fitstic@gmail.com",
                    Password = "dkviqxwjmlvrwppt"
                }
            };

            MailAddress from = new MailAddress("registro.fitstic@gmail.com", "Registro Fitstic");
            MailAddress to = new MailAddress(c.Email);
            MailMessage message = new MailMessage()
            {
                From = from,
                Subject = "Demo",
                Body = $"Ciao {c.Nome} e benvenuto in FITSTIC.\nTi comunichiamo che il tuo account è stato creato e le tue credenziali sono le seguenti:\nUsername:{c.Username}\nPassword:{c.Password}"
            };

            message.To.Add(to);

            try
            {
                client.SendMailAsync(message);
                return "success";
            }
            catch(Exception ex)
            {
                return ex.InnerException.Message;
            }
        }
    }
}
