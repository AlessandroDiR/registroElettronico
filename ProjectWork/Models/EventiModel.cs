using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWork.Models
{
    public class EventiModel
    {
        public string summary { get; set; }
        public DateTime? date { get; set; }
        public TimeSpan? start { get; set; }
        public TimeSpan? end { get; set; }
    }
}
