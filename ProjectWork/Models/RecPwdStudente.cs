using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class RecPwdStudente
    {
        public int Id { get; set; }
        public int IdStudente { get; set; }
        public DateTime DataRichiesta { get; set; }
        public int Codice { get; set; }

        public Studenti IdStudenteNavigation { get; set; }
    }
}
