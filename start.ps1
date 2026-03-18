Write-Host "=== Iniciando ambiente Docker ===" -ForegroundColor Cyan

function Check-Error {
    if ($LASTEXITCODE -ne 0 -and $null -ne $LASTEXITCODE) {
        Write-Host "Erro ao executar comando. Verifique os logs acima." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n[1/5] Parando containers existentes..." -ForegroundColor Yellow
docker-compose down -v
Check-Error

Write-Host "`n[2/5] Construindo imagens Docker..." -ForegroundColor Yellow
docker-compose build --no-cache
Check-Error

Write-Host "`n[3/5] Iniciando containers..." -ForegroundColor Yellow
docker-compose up -d
Check-Error

Write-Host "`n[4/5] Aguardando banco de dados iniciar (20 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

Write-Host "`n[5/5] Executando migrations..." -ForegroundColor Yellow
docker-compose exec -T backend php artisan migrate --force
Check-Error

# Verificar se a rota de teste existe e criar se necessário
Write-Host "`nVerificando rota de teste..." -ForegroundColor Yellow

# Criar um arquivo temporário com o código PHP
$phpCode = @'
<?php
$routeFile = base_path('routes/api.php');
$content = file_get_contents($routeFile);
if (!str_contains($content, 'test')) {
    $testRoute = "\n\nRoute::get('/test', function() { return response()->json(['message' => 'Backend funcionando!']); });\n";
    file_put_contents($routeFile, $testRoute, FILE_APPEND);
    echo "Rota de teste adicionada!\n";
} else {
    echo "Rota de teste já existe.\n";
}
'@

# Salvar código temporário e executar
$tempFile = "temp_route_check.php"
$phpCode | Out-File -FilePath $tempFile -Encoding UTF8

# Copiar para o container e executar
docker cp $tempFile ecommerce_backend:/var/www/backend/$tempFile
docker-compose exec -T backend php $tempFile
docker-compose exec -T backend rm $tempFile

# Remover arquivo temporário local
Remove-Item $tempFile -Force -ErrorAction SilentlyContinue

Write-Host "`n=== Ambiente iniciado com sucesso! ===" -ForegroundColor Green
Write-Host "Frontend React: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "Rota de teste: http://localhost:8080/api/test" -ForegroundColor Cyan
Write-Host "Banco de dados: localhost:3307 (user/secret)" -ForegroundColor Cyan

Write-Host "`nComandos úteis:" -ForegroundColor Yellow
Write-Host "Ver logs: docker-compose logs -f" -ForegroundColor White
Write-Host "Ver logs do frontend: docker-compose logs frontend" -ForegroundColor White
Write-Host "Ver logs do backend: docker-compose logs backend" -ForegroundColor White
Write-Host "Parar tudo: docker-compose down" -ForegroundColor White
Write-Host "Reiniciar: docker-compose restart" -ForegroundColor White