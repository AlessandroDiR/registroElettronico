using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWork.CustomizedModels
{
    public class RecPwd_CoordinatoreEmail
    {
        public string Email { get; set; }

    }

    public class RecPwd_CoordinatoreDati
    {
        public int Codice { get; set; }
        public int IdCoordinatore { get; set; }

        public string Password { get; set; }

    }
}
