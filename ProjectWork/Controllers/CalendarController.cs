using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProjectWork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> getCalendarEvents()
        {
            var service = new CalendarService(new BaseClientService.Initializer
            {
                ApiKey = "AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs"
            });

            var response = await service.Events.List("ckhj7iqj3msae4i4ietm5ip1cg@group.calendar.google.com").ExecuteAsync();
            var events = response.Items;
            var result = new List<object>();
            
            //foreach(var e in events)
            //{
            //    var json = new
            //    {
            //        summary = e.Summary != null ? e.Summary : "NONE",
            //        date = e.Start.DateTime != null ? e.Start.DateTime : null,
            //        start = e.Start.DateTime != null ? e.Start.DateTime : null,
            //        end = e.End.DateTime != null ? e.End.DateTime : null
            //    };
            //    result.Add(json);
            //}
            return Ok(events);

            // eventi = result.items
            // foreach eventi
                // e.start.dateTime.date -> (data evento)
                // e.start.dateTime
                // e.end.dateTime
                // summary
        }
    }
}