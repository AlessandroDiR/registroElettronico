using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Valutazioni
    {
        public int IdValutazione { get; set; }
        public int IdStudente { get; set; }
        public int IdDocente { get; set; }
        public int IdMateria { get; set; }
        public DateTime Data { get; set; }
        public string Voto { get; set; }

        public Docenti IdDocenteNavigation { get; set; }
        public Materie IdMateriaNavigation { get; set; }
        public Studenti IdStudenteNavigation { get; set; }
    }
}
