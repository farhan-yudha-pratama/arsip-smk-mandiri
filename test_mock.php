<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Template;
use App\Contracts\StorageServiceInterface;
use App\Http\Controllers\TemplateController;

$mock = Mockery::mock(StorageServiceInterface::class);
$mock->shouldReceive('getDiskName')->andReturn('public');
$mock->shouldReceive('getUrl')->andReturn('http://success.com');

app()->instance(StorageServiceInterface::class, $mock);

$controller = app()->make(TemplateController::class);

$template = new Template();
$template->url = 'templates/test.docx';

$response = $controller->preview($template);

echo get_class($response) . "\n";
if (method_exists($response, 'headers')) {
    echo $response->headers->get('X-Inertia-Location') . "\n";
}
if (method_exists($response, 'getTargetUrl')) {
    echo $response->getTargetUrl() . "\n";
}
if (session()->has('errors')) {
    echo session('errors')->first() . "\n";
}
