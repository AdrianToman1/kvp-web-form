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

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken = default)
        {
            var feedback = await _cosmosClientProvider.Container.ReadItemAsync<Feedback>(id.ToString(), new PartitionKey("complaint"), null, cancellationToken);

            if (feedback == null)
            {
                return NotFound();
            }

            return Ok(feedback.Resource);
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

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, [FromBody] FeedbackRequest feedbackRequest, CancellationToken cancellationToken = default)
        {
            if (feedbackRequest == null)
            {
                throw new ArgumentNullException(nameof(feedbackRequest));
            }

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            Feedback feedback = await _cosmosClientProvider.Container.ReadItemAsync<Feedback>(id.ToString(), new PartitionKey("complaint"), null, cancellationToken);

            if (feedback == null)
            {
                feedback = new Feedback { id = id };
            }

            feedback.FeedbackType = feedbackRequest.FeedbackType;
            feedback.FeedbackDate = feedbackRequest.FeedbackDate;
            feedback.Comments = feedbackRequest.Comments;
            feedback.Rating = feedbackRequest.Rating;

            _ = await _cosmosClientProvider.Container.UpsertItemAsync<Feedback>(feedback, null, null, cancellationToken);

            //if (entityState == EntityState.Added)
            //{
            //    return CreatedAtRoute("GetCountry", new { id = data.Id }, feedback);
            //}

            return Ok(feedback);
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
