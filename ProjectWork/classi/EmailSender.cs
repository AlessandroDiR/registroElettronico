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
            MailMessage message = new MailMessage
            {
                From = from,
				IsBodyHtml = true,
                Subject = "FITSTIC | Credenziali registro",
                Body =  $"Ciao {c.Nome} e benvenuto in FITSTIC.<br><br>Ti comunichiamo che il tuo account è stato creato " +
                        $"e le tue credenziali per accedere a https://registrofitstic.azurewebsites.net/#/adminpanel sono le seguenti:<br><br><strong>Username</strong>: {c.Username}<br><strong>Password</strong>: {Cipher.decode(c.Password)}<br><br>" +
                        $"Il codice per abilitare la registrazione delle firme su https://registrofitstic.azurewebsites.net/#/firme è:<br> <strong style='font-size:25px'>{corso.Codice}</strong>"
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

        public string SendCredenzialiStudente(Studenti s)
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
            MailAddress to = new MailAddress(s.Email);
            MailMessage message = new MailMessage
            {
                From = from,
                IsBodyHtml = true,
                Subject = "FITSTIC | Credenziali registro",
                Body = $"Ciao {s.Nome} e benvenuto in FITSTIC.<br><br>Ti comunichiamo che il tuo account è stato creato e che ora puoi accedere al tuo <a href='https://registrofitstic.azurewebsites.net/#/studentipanel'>profilo personale<a/>.<br><br>L'username per accedere è: {s.Email}.<br></br>La prima cosa che devi fare è creare una password seguendo queste semplici istruzioni:<br>1) Vai su https://registrofistsic.azurewebsites.net/#/studentipanel <br>2) Clicca su 'Hai dimenticato la password?'<br>3) Inserisci l'indirizzo email per il quale vuoi recuperare la password<br>4) Riceverai un codice di conferma. Copialo nello step successivo e vai avanti<br>5) Procedi con l'inserimento di una nuova password<br><br><strong>Il gioco è fatto!</strong>"
            };

            message.To.Add(to);

            try
            {
                client.SendMailAsync(message);
                return "success";
            }
            catch (Exception ex)
            {
                return ex.InnerException.Message;
            }
        }

        public string SendCredenzialiAccessoRemoto(string email, string codice)
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
            MailAddress to = new MailAddress(email);
            MailMessage message = new MailMessage()
            {
                From = from,
                IsBodyHtml = true,
                Subject = "FITSTIC | Credenziali accesso remoto",
                Body = $"Ciao! Ecco il codice di accesso per registrare la firma da remoto: {codice}"
            };

            message.To.Add(to);

            try
            {
                client.SendMailAsync(message);
                return "success";
            }
            catch (Exception ex)
            {
                return ex.InnerException.Message;
            }
        }

        public string SendEmailTo(string emailTo, string subject, string body)
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
            MailAddress to = new MailAddress(emailTo);
            MailMessage message = new MailMessage()
            {
                From = from,
                IsBodyHtml = true,
                Subject = subject,
                Body = body
            };

            message.To.Add(to);

            try
            {
                client.SendMailAsync(message);
                return "success";
            }
            catch (Exception ex)
            {
                return ex.InnerException.Message;
            }
        }
        
        
    }
}
