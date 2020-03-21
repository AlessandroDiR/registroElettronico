using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProjectWork.Models;

namespace ProjectWork.CustomizedModels
{
    public class PostStudentiModel
    {
        public AuthCoordinatoreModel AuthCoordinatore { get; set; }
        public Studenti[] Studenti { get; set; }
    }
}
