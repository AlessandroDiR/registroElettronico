using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Coordina
    {
        public int IdCoordinatore { get; set; }
        public int IdCorso { get; set; }

        public Coordinatori IdCoordinatoreNavigation { get; set; }
        public Corsi IdCorsoNavigation { get; set; }
    }
}
