using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using ProjectWork.Models;
using ProjectWork.classi;
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
        public string SendEmail(Coordinatori c, Corsi corso)
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
                Subject = "FITSTIC | Credenziali registro",
                Body =  $"Ciao {c.Nome} e benvenuto in FITSTIC.\n\nTi comunichiamo che il tuo account è stato creato " +
                        $"e le tue credenziali per accedere a https://avocadoapi.azurewebsites.net/#/adminpanel sono le seguenti:\n\nUsername: {c.Username}\nPassword: {Cipher.decode(c.Password)}\n" +
                        $"Il codice per abilitare la registrazione delle firme su https://avocadoapi.azurewebsites.net/#/firme è {Cipher.decode(corso.Codice)}"
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
