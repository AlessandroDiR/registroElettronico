using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Insegnare
    {
        public int IdDocente { get; set; }
        public int IdMateria { get; set; }

        public Docenti IdDocenteNavigation { get; set; }
        public Materie IdMateriaNavigation { get; set; }
    }
}
