using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Materie
    {
        public Materie()
        {
            Comprende = new HashSet<Comprende>();
            Insegnare = new HashSet<Insegnare>();
            Valutazioni = new HashSet<Valutazioni>();
        }

        public int IdMateria { get; set; }
        public string Nome { get; set; }
        public string Descrizione { get; set; }

        public Lezioni Lezioni { get; set; }
        public ICollection<Comprende> Comprende { get; set; }
        public ICollection<Insegnare> Insegnare { get; set; }
        public ICollection<Valutazioni> Valutazioni { get; set; }
    }
}
