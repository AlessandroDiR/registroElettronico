using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Comprende
    {
        public int IdMateria { get; set; }
        public int IdCorso { get; set; }

        public Corsi IdCorsoNavigation { get; set; }
        public Materie IdMateriaNavigation { get; set; }
    }
}
