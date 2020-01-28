using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Tenere
    {
        public int IdDocente { get; set; }
        public int IdCorso { get; set; }

        public Corsi IdCorsoNavigation { get; set; }
        public Docenti IdDocenteNavigation { get; set; }
    }
}
