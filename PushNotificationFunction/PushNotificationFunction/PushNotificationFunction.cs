using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace PushNotificationNamespace
{
    public static class PushNotificationFunction
    {
        private static readonly string publicKey = "BJgU9xP-B0LnxW8GMLOdbX2csHkvlwnQF7ecrORS2b59enz4FJUI_ZI9oaC4aOgtQ14iscMgbiXCVYTyvU2R_os";
        private static readonly string privateKey = "ZoUtBVmxjx-_w4Ez2OSZpy0zbNFgJcxYJBM7tOFb9Kc";

        [Function("TriggerPushNotification")]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "trigger-push-notification")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var logger = executionContext.GetLogger("TriggerPushNotification");
            logger.LogInformation("C# HTTP trigger function processed a request.");
            
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonSerializer.Deserialize<PushMessage>(requestBody);
            
            // Retrieve the subscription object from your database or storage here
            var subscription = new PushSubscription
            {
                Endpoint = "https://fcm.googleapis.com/fcm/send/eimt_rktp3g:APA91bGDxQUommW8aID_Ztfsoc7gqcIdjnOiWQvN35zYGQ_0Dc7bK7keDrPPw9JDwawUOpR8LQsl3u8wKcpQzzW8UZGLJbvQDCQGWu5JqafKCruyio3srz5ahE93yh1tSBcBt-FDsa9P",
                Keys = new Keys
                {
                    P256dh = "BCHNKzXJJzhWWJYNkF99eHDBrZUzO_uT0tGRa9uVqUPDapRuR8u9Svyuvv5nGHAjAgnpIF0a4zW5rftHSFV6IO4",
                    Auth = "c4iWO0nJxtthFffa98qxdg"
                }
            };

            using var client = new HttpClient();
            var notification = new
            {
                subscription = new
                {
                    subscription.Endpoint,
                    keys = new
                    {
                        p256dh = subscription.Keys.P256dh,
                        auth = subscription.Keys.Auth
                    }
                },
                payload = JsonSerializer.Serialize(new { title = data.title, body = data.body }),
                vapidDetails = new
                {
                    subject = "mailto:codingzeus1218999@gmail.com",
                    publicKey,
                    privateKey
                }
            };

            var json = JsonSerializer.Serialize(notification);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync(subscription.Endpoint, content);

            var httpResponse = req.CreateResponse(response.IsSuccessStatusCode ? System.Net.HttpStatusCode.OK : System.Net.HttpStatusCode.BadRequest);
            httpResponse.Headers.Add("Access-Control-Allow-Origin", "*");
            httpResponse.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            httpResponse.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
            await httpResponse.WriteStringAsync(response.IsSuccessStatusCode ? "Push notification sent successfully" : "Failed to send push notification");
            return httpResponse;
        }
    }

    public class PushMessage
    {
        public string title { get; set; } = null!;
        public string body { get; set; } = null!;
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
