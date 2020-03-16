using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Lezioni
    {
        public Lezioni()
        {
            Presenze = new HashSet<Presenze>();
            PresenzeDocente = new HashSet<PresenzeDocente>();
        }

        public int IdLezione { get; set; }
        public DateTime Data { get; set; }
        public TimeSpan OraInizio { get; set; }
        public TimeSpan OraFine { get; set; }
        public string Titolo { get; set; }
        public int? IdMateria { get; set; }
        public string IdCalendario { get; set; }
        public string IdGEvent { get; set; }

        public Calendari IdCalendarioNavigation { get; set; }
        public Materie IdMateriaNavigation { get; set; }
        public ICollection<Presenze> Presenze { get; set; }
        public ICollection<PresenzeDocente> PresenzeDocente { get; set; }
    }
}
