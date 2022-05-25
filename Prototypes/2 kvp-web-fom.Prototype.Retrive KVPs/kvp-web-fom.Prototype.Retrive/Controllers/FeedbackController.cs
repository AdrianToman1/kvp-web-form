using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;

namespace kvp_web_fom.Prototype.Retrieve.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly ILogger<FeedbackController> _logger;
        private readonly CosmosClientProvider _cosmosClientProvider;

        public FeedbackController(CosmosClientProvider cosmosClientProvider, ILogger<FeedbackController> logger)
        {
            _cosmosClientProvider = cosmosClientProvider ?? throw new ArgumentNullException(nameof(cosmosClientProvider));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            if (_cosmosClientProvider.Container == null)
            {
                throw new ArgumentException($"{nameof(_cosmosClientProvider.Container)} must have a value", nameof(cosmosClientProvider));
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] FeedbackRequest feedbackRequest, CancellationToken cancellationToken = default)
        {
            if (feedbackRequest == null)
            {
                throw new ArgumentNullException(nameof(feedbackRequest));
            }

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var feedBack = new Feedback
            {
                FeedbackType = feedbackRequest.FeedbackType,
                FeedbackDate = feedbackRequest.FeedbackDate,
                Comments = feedbackRequest.Comments,
                Rating = feedbackRequest.Rating,
            };

            _ = await _cosmosClientProvider.Container.CreateItemAsync<Feedback>(feedBack, null, null, cancellationToken);

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
