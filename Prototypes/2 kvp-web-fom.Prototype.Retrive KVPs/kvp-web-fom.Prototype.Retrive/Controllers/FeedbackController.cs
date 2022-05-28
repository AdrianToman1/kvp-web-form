using System.Dynamic;
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace kvp_web_fom.Prototype.Retrieve.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly CosmosClientProvider _cosmosClientProvider;
        private readonly ILogger<FeedbackController> _logger;

        public FeedbackController(CosmosClientProvider cosmosClientProvider, ILogger<FeedbackController> logger)
        {
            _cosmosClientProvider =
                cosmosClientProvider ?? throw new ArgumentNullException(nameof(cosmosClientProvider));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            if (_cosmosClientProvider.Container == null)
            {
                throw new ArgumentException($"{nameof(_cosmosClientProvider.Container)} must have a value",
                    nameof(cosmosClientProvider));
            }
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var q = _cosmosClientProvider.Container.GetItemLinqQueryable<IDictionary<string, object?>>(true);
                
                return Content(JsonConvert.SerializeObject(q.ToList(), new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                }), "application/json");
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound();
            }
        }

        [HttpGet("{id}", Name = "GetFeedback")]
        public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var response = await _cosmosClientProvider.Container.ReadItemAsync<IDictionary<string, object?>>(id.ToString(),
                    new PartitionKey("complaint"), null, cancellationToken);

                return Content(JsonConvert.SerializeObject(response.Resource, new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                }), "application/json");
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] IDictionary<string, object?> formData,
            CancellationToken cancellationToken = default)
        {
            if (formData == null)
            {
                throw new ArgumentNullException(nameof(formData));
            }

            IDictionary<string, object?> existingFormData = new ExpandoObject();
            existingFormData["id"] = Guid.NewGuid().ToString();

            var mergedFormData = Merge(formData, existingFormData);

            var response =
                await _cosmosClientProvider.Container.CreateItemAsync(mergedFormData, null, null, cancellationToken);

            return CreatedAtRoute("GetFeedback", new { id = response.Resource["id"] }, response.Resource);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, [FromBody] IDictionary<string, object?> formData,
            CancellationToken cancellationToken = default)
        {
            if (formData == null)
            {
                throw new ArgumentNullException(nameof(formData));
            }

            IDictionary<string, object?> existingFormData;

            try
            {
                var existingFormDataResponse =
                    await _cosmosClientProvider.Container.ReadItemAsync<IDictionary<string, object?>>(id.ToString(),
                        new PartitionKey("complaint"), null, cancellationToken);

                existingFormData = existingFormDataResponse.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                existingFormData = new ExpandoObject();
                existingFormData["id"] = id;
            }

            var mergedFormData = Merge(existingFormData, formData);

            var upsertResponse =
                await _cosmosClientProvider.Container.UpsertItemAsync(mergedFormData, null, null, cancellationToken);

            if (upsertResponse.StatusCode == HttpStatusCode.Created)
            {
                return CreatedAtRoute("GetFeedback", new { id = upsertResponse.Resource["id"] }, upsertResponse);
            }

            return Ok(mergedFormData);
        }

        private static IDictionary<string, object?> Merge(IDictionary<string, object?> baseValue,
            IDictionary<string, object?> updatedValues)
        {
            IDictionary<string, object?> result = new ExpandoObject();

            foreach (var property in baseValue)
            {
                if (property.Value == null)
                {
                    result[property.Key] = null;
                }
                else if (property.Value is JsonElement?)
                {
                    result[property.Key] = (property.Value as JsonElement?)?.GetString();
                }
                else
                {
                    result[property.Key] = property.Value;
                }
            }

            foreach (var property in updatedValues)
            {
                if (property.Value == null)
                {
                    result[property.Key] = null;
                }
                else if (property.Value is JsonElement?)
                {
                    result[property.Key] = (property.Value as JsonElement?)?.GetString();
                }
                else
                {
                    result[property.Key] = property.Value;
                }
            }

            return result;
        }
    }
}