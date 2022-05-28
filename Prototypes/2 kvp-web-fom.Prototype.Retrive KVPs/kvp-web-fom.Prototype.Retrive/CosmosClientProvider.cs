using Microsoft.Azure.Cosmos;

namespace kvp_web_fom.Prototype.Retrieve;

public class CosmosClientProvider : IDisposable
{
    private const string FormsContainerId = "forms";

    public CosmosClientProvider(CosmosClient cosmosClient, Database database, Container container)
    {
        CosmosClient = cosmosClient ?? throw new ArgumentNullException(nameof(cosmosClient));
        Database = database ?? throw new ArgumentNullException(nameof(database));
        Container = container ?? throw new ArgumentNullException(nameof(container));
    }

    public CosmosClient CosmosClient { get; }
    public Database Database { get; }
    public Container Container { get; }

    public void Dispose()
    {
        CosmosClient.Dispose();
    }

    public static async Task<CosmosClientProvider> CreateInstanceAsync(string accountEndpoint, string authKey,
        string databaseId, string containerId)
    {
        var cosmosClient = new CosmosClient(accountEndpoint, authKey);
        var database =
            await cosmosClient.CreateDatabaseIfNotExistsAsync(databaseId);
        var container =
                    await database.Database.CreateContainerIfNotExistsAsync(containerId, "/feedbackType");

        return new CosmosClientProvider(cosmosClient, database.Database, container.Container);
    }

    public static CosmosClientProvider CreateInstance(string accountEndpoint, string authKey, string databaseId)
    {
        return new
                TaskFactory(CancellationToken.None,
                    TaskCreationOptions.None,
                    TaskContinuationOptions.None,
                    TaskScheduler.Default)
            .StartNew(() => CreateInstanceAsync(accountEndpoint, authKey, databaseId, FormsContainerId))
            .Unwrap()
            .GetAwaiter()
            .GetResult();
    }
}