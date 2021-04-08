using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace Instagram.Models
{
    public class Publication
    {
        [Key]
        public int PublicationId { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string PublicationName { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string PublicationDescription { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string PublicationAuthor { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime PublicationDate { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string ImageName { get; set; }

        [NotMapped]
        public IFormFile ImageFile { get; set; }

        [NotMapped]
        public string ImageSrc { get; set; }
    }
}
