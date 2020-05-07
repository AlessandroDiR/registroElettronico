using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWork.CustomizedModels
{
    public class FirmaRemotaDocenteModel
    {
        public int IdDocente { get; set; }
        public string Password { get; set; }
        public int IdCorso { get; set; }
        public int Anno { get; set; }
        public int idLezione { get; set; }
    }
}
