using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Instagram.Models
{
    public class PublicationDbContext : DbContext
    {
        public PublicationDbContext(DbContextOptions<PublicationDbContext> options) : base(options)
        { }

        public DbSet<Publication> Publications { get; set; }
    }
}
