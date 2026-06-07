$root = $PSScriptRoot
$port = 8088

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server started: http://localhost:$port"
Write-Host "Press Ctrl+C to stop"
Write-Host ""

while ($true) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $urlPath = $request.Url.AbsolutePath
    if ($urlPath -eq "/") { $urlPath = "/game/index.html" }

    $filePath = Join-Path $root $urlPath.TrimStart("/").Replace("/", "\")

    if (Test-Path $filePath) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = "text/html; charset=utf-8"
        if ($ext -eq ".css") { $contentType = "text/css; charset=utf-8" }
        elseif ($ext -eq ".js") { $contentType = "application/javascript; charset=utf-8" }
        elseif ($ext -eq ".json") { $contentType = "application/json; charset=utf-8" }
        elseif ($ext -eq ".png") { $contentType = "image/png" }
        elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $contentType = "image/jpeg" }
        elseif ($ext -eq ".svg") { $contentType = "image/svg+xml" }

        $buffer = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = $contentType
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    } else {
        $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 - File not found: " + $urlPath)
        $response.StatusCode = 404
        $response.ContentType = "text/plain; charset=utf-8"
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    }

    $response.OutputStream.Close()
}
