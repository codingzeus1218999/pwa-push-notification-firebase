using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace SaveSubscriptionNamespace
{
    public static class SaveSubscriptionFunction
    {
        [Function("SaveSubscription")]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "save-subscription")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var logger = executionContext.GetLogger("SaveSubscription");
            logger.LogInformation("C# HTTP trigger function processed a request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var subscription = JsonSerializer.Deserialize<PushSubscription>(requestBody);

            // Save the subscription object to your database or storage here

            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
            await response.WriteStringAsync("Subscription saved successfully");
            return response;
        }
    }

    public class PushSubscription
    {
        public string Endpoint { get; set; } = null!;
        public Keys Keys { get; set; } = new Keys();
    }

    public class Keys
    {
        public string P256dh { get; set; } = null!;
        public string Auth { get; set; } = null!;
    }
}
