using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Microsoft.AspNetCore.Mvc;
using ProjectWork.Models;

namespace ProjectWork.classi
{
    public class CalendarApi
    {
        private readonly AvocadoDBContext _context;
        public CalendarService _service;
        public CalendarApi(AvocadoDBContext context)
        {
            _context = context;
            ConfigService();
        }

        public void ConfigService()
        {
            //UserCredential credential;
            //using (var stream = new FileStream("credentials.json", FileMode.Open, FileAccess.Read))
            //{
            //    credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
            //        GoogleClientSecrets.Load(stream).Secrets,
            //        new[] { CalendarService.Scope.Calendar },
            //        "user", CancellationToken.None, new FileDataStore("Books.ListMyLibrary"));
            //};

            _service = new CalendarService(new BaseClientService.Initializer
            {
                //HttpClientInitializer = credential,
                ApiKey = "AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs"
            });
        }

        //public Channel ActivateWatch(CalendarService service, string gCalendarID)
        //{
        //    var body = new Channel
        //    {
        //        Id = Guid.NewGuid().ToString(),
        //        Type = "web_hook",
        //        Address = "https://avocadoapi.azurewebsites.net/notifications"
        //    };

        //    var request = service.Events.Watch(body, gCalendarID);
        //    var response = request.Execute();

        //    return response;
        //}

        public IList<Event> GetCalendarEvents(Calendari c)
        {
            var request = _service.Events.List(c.IdGoogleCalendar);
            request.MaxResults = 400;

            var response = request.Execute();
            var events = response.Items;
            c.NextSyncToken = response.NextSyncToken;

            _context.Calendari.Update(c);
            _context.SaveChanges();

            return events;
        }

        public IList<Event> GetUpdatedEvents(Calendari c)
        {
            var request = _service.Events.List(c.IdGoogleCalendar);
            request.MaxResults = 400;
            request.SyncToken = c.NextSyncToken;

            var response = request.Execute();
            var updatedEvents = response.Items;
            c.NextSyncToken = response.NextSyncToken;

            _context.Calendari.Update(c);
            _context.SaveChanges();

            return updatedEvents;
        }

        public List<object> UpdateEventsInContext(Calendari c, IList<Event> updatedEvents)
        {
            var lezioniNonValidate = new List<object>();
            foreach(var e in updatedEvents)
            {
                var lezione = _context.Lezioni.SingleOrDefault(l => l.IdGEvent == e.Id);
                if(lezione != null)
                {
                    if (e.Status == "cancelled")
                        _context.Lezioni.Remove(lezione);
                    else
                    {
                        lezione.Titolo = e.Summary;
                        lezione.Data = DateTime.Parse(e.Start.DateTime.ToString().Split(' ')[0]).Date;
                        lezione.OraInizio = TimeSpan.Parse(e.Start.DateTime.ToString().Split(' ')[1]);
                        lezione.OraFine = TimeSpan.Parse(e.End.DateTime.ToString().Split(' ')[1]);
                        lezione.IdMateria = FindIdMateria(e.Summary);

                        if(lezione.IdMateria == -1)
                            lezioniNonValidate.Add(e);
                        else
                            _context.Lezioni.Update(lezione);
                    }
                }
                else
                {
                    lezione = new Lezioni
                    {
                        Titolo = e.Summary,
                        Data = DateTime.Parse(e.Start.DateTime.ToString().Split(' ')[0]).Date,
                        OraInizio = TimeSpan.Parse(e.Start.DateTime.ToString().Split(' ')[1]),
                        OraFine = TimeSpan.Parse(e.End.DateTime.ToString().Split(' ')[1]),
                        IdCalendario = c.IdCalendario,
                        IdGEvent = e.Id,
                        IdMateria = FindIdMateria(e.Summary)
                    };

                    if(lezione.IdMateria == -1)
                        lezioniNonValidate.Add(e);
                    else
                        _context.Lezioni.Add(lezione);
                }
            }
            try
            {
                _context.SaveChanges();
            }
            catch
            {
                throw;
            }

            return lezioniNonValidate;
        }

        public List<object> SaveEventsInContext(Calendari c, IList<Event> events)
        {
            var lezioniNonValidate = new List<object>();
            foreach (var e in events)
            {
                var lezione = new Lezioni
                {
                    Titolo = e.Summary,
                    Data = DateTime.Parse(e.Start.DateTime.ToString().Split(' ')[0]).Date,
                    OraInizio = TimeSpan.Parse(e.Start.DateTime.ToString().Split(' ')[1]),
                    OraFine = TimeSpan.Parse(e.End.DateTime.ToString().Split(' ')[1]),
                    IdCalendario = c.IdCalendario,
                    IdGEvent = e.Id,
                    IdMateria = FindIdMateria(e.Summary)
                };

                if (lezione.IdMateria == -1)
                    lezioniNonValidate.Add(e);
                else
                    _context.Lezioni.Add(lezione);
            }
            try
            {
                _context.SaveChanges();
            }
            catch
            {
                throw;
            }

            return lezioniNonValidate;
        }

        private int FindIdMateria(string evento)
        {
            if (!evento.Contains('-'))
                return -1;

            var nomeMateria = evento.Split('-')[1].TrimStart();
            var materia = _context.Materie.SingleOrDefault(m => m.Nome == nomeMateria);
            if (materia == null)
                return -1;

            return materia.IdMateria;
        }
    }
}
