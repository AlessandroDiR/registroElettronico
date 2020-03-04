using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class LogPresenze
    {
        public int IdLog { get; set; }
        public DateTime DataOra { get; set; }
        public string Modifiche { get; set; }
        public int IdCorso { get; set; }
        public int? IdStudente { get; set; }
        public int? IdDocente { get; set; }
        public int IdPresenza { get; set; }
    }
}
