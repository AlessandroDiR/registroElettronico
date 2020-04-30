using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Stage
    {
        public int IdGiornata { get; set; }
        public int IdStudente { get; set; }
        public DateTime Data { get; set; }
        public DateTime OraInizio { get; set; }
        public DateTime OraFine { get; set; }
        public string Argomento { get; set; }

        public Studenti IdStudenteNavigation { get; set; }
    }
}
