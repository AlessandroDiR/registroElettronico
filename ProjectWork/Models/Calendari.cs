using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Calendari
    {
        public Calendari()
        {
            Lezioni = new HashSet<Lezioni>();
        }

        public string IdCalendario { get; set; }
        public int IdCorso { get; set; }
        public int Anno { get; set; }
        public string NextSyncToken { get; set; }

        public Corsi IdCorsoNavigation { get; set; }
        public ICollection<Lezioni> Lezioni { get; set; }
    }
}
