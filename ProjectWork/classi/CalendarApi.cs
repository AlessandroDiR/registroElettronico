using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Microsoft.AspNetCore.Mvc;
using ProjectWork.Models;

namespace ProjectWork.classi
{
    public class CalendarApi
    {
        private readonly AvocadoDBContext _context;
        public CalendarApi(AvocadoDBContext context)
        {
            _context = context;
        }

        private List<EventiModel> GetCalendarEvents(string gCalendarID)
        {
            var service = new CalendarService(new BaseClientService.Initializer
            {
                ApiKey = "AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs"
            });

            var request = service.Events.List(gCalendarID);
            request.MaxResults = 400;

            var response = request.Execute();
            var events = response.Items;
            var result = new List<EventiModel>();

            foreach (var e in events)
            {
                if (e.Status != "cancelled")
                {
                    var date = e.Start.DateTime != null ? e.Start.DateTime.ToString().Split(' ')[0] : null;
                    var start = e.Start.DateTime != null ? e.Start.DateTime.ToString().Split(' ')[1] : null;
                    var end = e.End.DateTime != null ? e.End.DateTime.ToString().Split(' ')[1] : null;
                    var json = new EventiModel
                    {
                        summary = e.Summary != null ? e.Summary : "NONE",
                        date = DateTime.Parse(date).Date,
                        start = TimeSpan.Parse(start),
                        end = TimeSpan.Parse(end)
                        
                    };
                    result.Add(json);
                }
            }

            return result;
        }

        public bool SaveEventsInContext(string gCalendarID, string idCalendario)
        {
            var events = GetCalendarEvents(gCalendarID);
            foreach (var e in events)
            {
                var lezione = new Lezioni
                {
                    Titolo = e.summary,
                    Data = e.date,
                    OraInizio = e.start,
                    OraFine = e.end,
                    IdCalendario = idCalendario,
                    IdMateria = FindIdMateria(e.summary)
                };

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

            return true;

        }

        private int FindIdMateria(string evento)
        {
            var nomeMateria = evento.Split('-')[1].TrimStart();
            var id = _context.Materie.SingleOrDefault(m => m.Nome == nomeMateria).IdMateria;

            return id;
        }
    }
}
