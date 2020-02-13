using System;
using System.Collections;
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
        public async void GetCalendarEvents()
        {
            var service = new CalendarService(new BaseClientService.Initializer
            {
                ApiKey = "AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs"
            });

            var response = await service.Events.List("ckhj7iqj3msae4i4ietm5ip1cg@group.calendar.google.com").ExecuteAsync();
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

            SaveEventsInContext(result);
        }

        private void SaveEventsInContext(List<EventiModel> events)
        {
            foreach(var e in events)
            {
                var lezione = new Lezioni
                {
                    Titolo = e.summary,
                    Data = e.date,
                    OraInizio = e.start,
                    OraFine = e.end
                };

                _context.Lezioni.Add(lezione);
            }

            _context.SaveChanges();

        }
    }
}
