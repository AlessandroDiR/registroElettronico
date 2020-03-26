using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWork.CustomizedModels
{
    public class EventiModel
    {
        public string Summary { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan Inizio { get; set; }
        public TimeSpan Fine { get; set; }
    }
}
