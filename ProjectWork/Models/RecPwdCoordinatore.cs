using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class RecPwdCoordinatore
    {
        public int Id { get; set; }
        public int IdCoordinatore { get; set; }
        public DateTime DataRichiesta { get; set; }
        public int Codice { get; set; }

        public Coordinatori IdCoordinatoreNavigation { get; set; }
    }
}
