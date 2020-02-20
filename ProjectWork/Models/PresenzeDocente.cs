using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class PresenzeDocente
    {
        public int IdPresenza { get; set; }
        public int IdLezione { get; set; }
        public int IdDocente { get; set; }
        public TimeSpan Ingresso { get; set; }
        public TimeSpan Uscita { get; set; }

        public Docenti IdDocenteNavigation { get; set; }
        public Lezioni IdLezioneNavigation { get; set; }
    }
}
