using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;

namespace kvp_web_fom.Prototype.Retrieve.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly ILogger<FeedbackController> _logger;

        public FeedbackController(ILogger<FeedbackController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] FeedbackRequest feedbackRequest)
        {
            var endpointUri = "https://localhost:8081";
            var primaryKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";

            var cosmosClient = new CosmosClient(endpointUri, primaryKey);
            var database = await cosmosClient.CreateDatabaseIfNotExistsAsync("kvp-web-form");
            var container = await database.Database.CreateContainerIfNotExistsAsync("Basic", "/FeedbackType");

            var feedBack = new Feedback
            {
                FeedbackType = feedbackRequest.FeedbackType,
                FeedbackDate = feedbackRequest.FeedbackDate,
                Comments = feedbackRequest.Comments,
                Rating = feedbackRequest.Rating,
            };

            var wakefieldFamilyResponse = await container.Container.CreateItemAsync<Feedback>(feedBack);

            return Ok();
        }
    }

    public class FeedbackRequest
    {
        public string? FeedbackType { get; set; }
        public DateTime? FeedbackDate { get; set; }
        public string? Comments { get; set; }
        public int? Rating { get; set; }
    }

    public class Feedback
    {
        public Feedback()
        {
            id = Guid.NewGuid();
        }

        public Guid id { get; set; }
        public string? FeedbackType { get; set; }
        public DateTime? FeedbackDate { get; set; }
        public string? Comments { get; set; }
        public int? Rating { get; set; }
    }
}
