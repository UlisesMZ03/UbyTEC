using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;

namespace UbyTECAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IMongoDatabase _database;

        public FeedbackController(IMongoDatabase database)
        {
            _database = database;
        }

        [HttpPost]
        public async Task<IActionResult> PostFeedback([FromBody] FeedbackModel feedbackModel)
        {
            if (feedbackModel == null || string.IsNullOrEmpty(feedbackModel.Feedback))
            {
                return BadRequest(new { error = "Feedback vacío" });
            }

            try
            {
                var collection = _database.GetCollection<BsonDocument>("UbytecCollection");
                var document = new BsonDocument
                {
                    { "FeedBack", feedbackModel.Feedback }
                };

                await collection.InsertOneAsync(document);

                return CreatedAtAction(nameof(PostFeedback), new { id = document["_id"] }, new
                {
                    message = "Feedback guardado exitosamente",
                    feedbackId = document["_id"].ToString()
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al guardar el feedback: {ex.Message}");
                return StatusCode(500, new { error = "Error al guardar el feedback" });
            }
        }
    }

    public class FeedbackModel
    {
        public string Feedback { get; set; } = string.Empty;
    }
}