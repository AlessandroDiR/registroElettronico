using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Studenti
    {
        public Studenti()
        {
            Valutazioni = new HashSet<Valutazioni>();
        }

        public int IdStudente { get; set; }
        public string Nome { get; set; }
        public string Cognome { get; set; }
        public string Password { get; set; }
        public string Cf { get; set; }
        public DateTime DataNascita { get; set; }
        public string AnnoIscrizione { get; set; }
        public int IdCorso { get; set; }
        public string LuogoNascita { get; set; }

        public Corsi IdCorsoNavigation { get; set; }
        public ICollection<Valutazioni> Valutazioni { get; set; }
    }
}
