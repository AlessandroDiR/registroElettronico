using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Corsi
    {
        public Corsi()
        {
            Calendari = new HashSet<Calendari>();
            Comprende = new HashSet<Comprende>();
            Coordina = new HashSet<Coordina>();
            Studenti = new HashSet<Studenti>();
            Tenere = new HashSet<Tenere>();
        }

        public int IdCorso { get; set; }
        public string Nome { get; set; }
        public string Luogo { get; set; }
        public string Logo { get; set; }
        public string Codice { get; set; }
        public string CodicePrimoAnno { get; set; }
        public string CodiceSecondoAnno { get; set; }
        public bool StagePrimoAnno { get; set; }
        public bool StageSecondoAnno { get; set; }

        public ICollection<Calendari> Calendari { get; set; }
        public ICollection<Comprende> Comprende { get; set; }
        public ICollection<Coordina> Coordina { get; set; }
        public ICollection<Studenti> Studenti { get; set; }
        public ICollection<Tenere> Tenere { get; set; }
    }
}
