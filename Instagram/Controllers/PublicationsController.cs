using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Instagram.Models;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace Instagram.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublicationsController : ControllerBase
    {
        private readonly PublicationDbContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public PublicationsController(PublicationDbContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        // GET: api/Publications
        [HttpGet]
        public IEnumerable<Publication> GetPublications()
        {
            return _context.Publications
                .Select(p => new Publication()
                {
                    PublicationId = p.PublicationId,
                    PublicationName = p.PublicationName,
                    PublicationAuthor = p.PublicationAuthor,
                    PublicationDescription = p.PublicationDescription,
                    PublicationDate = p.PublicationDate,
                    ImageName = p.ImageName,
                    ImageSrc = $"/img/{p.ImageName}"
                    
                })
                .ToList();
        }

        // GET: api/Publications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Publication>> GetPublication(int id)
        {
            var publication = await _context.Publications.FindAsync(id);

            if (publication == null)
            {
                return NotFound();
            }

            return publication;
        }

        // PUT: api/Publications/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPublication(int id, [FromForm] Publication publication)
        {
            if (id != publication.PublicationId)
            {
                return BadRequest();
            }

            if (publication.ImageFile != null)
            {
                DeleteImage(publication.ImageName);
                publication.ImageName = await SaveImage(publication.ImageFile);
            }

            _context.Entry(publication).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PublicationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Publications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Publication>> PostPublication([FromForm] Publication publication)
        {
            publication.ImageName = await SaveImage(publication.ImageFile);
            _context.Publications.Add(publication);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPublication", new { id = publication.PublicationId }, publication);
        }

        // DELETE: api/Publications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePublication(int id)
        {
            var publication = await _context.Publications.FindAsync(id);
            if (publication == null)
            {
                return NotFound();
            }
            DeleteImage(publication.ImageName);
            _context.Publications.Remove(publication);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PublicationExists(int id)
        {
            return _context.Publications.Any(e => e.PublicationId == id);
        }
        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName =
                new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray())
                    .Replace(' ', '-');
            imageName = imageName + DateTime.Now.ToString("yymmssfff") +
                Path.GetExtension(imageFile.FileName);

            //string imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
            string imagePath = $"{_hostEnvironment.ContentRootPath}/ClientApp/public/img/{imageName}";
            //
            using (FileStream fs = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fs);
            }
            return imageName;
        }

        [NonAction]
        public void DeleteImage(string imageName)
        {
            //string imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
            string imagePath = $"{_hostEnvironment.ContentRootPath}/ClientApp/public/img/{imageName}";
            //
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
        }
    }
}
