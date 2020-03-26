using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProjectWork.Models;

namespace ProjectWork.CustomizedModels
{
    public class PostCorsiModel
    {
        public AuthAdminModel AuthAdmin { get; set; }
        public Corsi Corso { get; set; }
    }
}
