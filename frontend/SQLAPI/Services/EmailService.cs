using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
public class EmailService
{
    private readonly HttpClient _httpClient;

    public EmailService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<bool> SendEmailAsync(string email, string password)
    {
        // Ajusta los parámetros que se deben enviar
        var request = new
        {
            email = email,
            password = password // Cambiar 'subject' y 'body' por 'password'
        };

        var jsonContent = JsonSerializer.Serialize(request);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        // Enviar la solicitud POST a la API
        var response = await _httpClient.PostAsync("https://miappnode.azurewebsites.net/send-password", content);

        // Retorna true si la solicitud fue exitosa, false si no
        return response.IsSuccessStatusCode;
    }
}
