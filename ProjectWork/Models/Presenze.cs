using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Presenze
    {
        public int IdPresenza { get; set; }
        public int IdLezione { get; set; }
        public int IdStudente { get; set; }
        public TimeSpan? Ingresso { get; set; }
        public TimeSpan? Uscita { get; set; }

        public Lezioni IdLezioneNavigation { get; set; }
        public Studenti IdStudenteNavigation { get; set; }
    }
}
