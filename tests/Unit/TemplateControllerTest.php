<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\TemplateController;
use App\Contracts\StorageServiceInterface;
use App\Services\DocumentTemplateService;
use Illuminate\Http\Request;
use Mockery;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\RedirectResponse;

class TemplateControllerTest extends TestCase
{
    protected $storageMock;
    protected $controller;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->storageMock = Mockery::mock(StorageServiceInterface::class);
        $this->controller = new TemplateController($this->storageMock);
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_store_handles_missing_base64_format()
    {
        $request = Request::create('/templates', 'POST', [
            'title' => 'Test Template',
            'document' => 'invalid_string_without_base64',
            'metadata' => []
        ]);
        
        $redirectMock = Mockery::mock(RedirectResponse::class);
        $redirectMock->shouldReceive('withErrors')->with(['document' => 'Format Base64 tidak valid'])->andReturnSelf();
        
        Redirect::shouldReceive('back')->andReturn($redirectMock);

        $response = $this->controller->store($request);

        $this->assertSame($redirectMock, $response);
    }

    public function test_extract_variables_invalid_base64()
    {
        $request = Request::create('/extract', 'POST', [
            'document' => 'invalid_doc_string'
        ]);

        $serviceMock = Mockery::mock(DocumentTemplateService::class);

        $response = $this->controller->extractVariables($request, $serviceMock);

        $this->assertEquals(400, $response->getStatusCode());
        $this->assertEquals(['error' => 'Format Base64 tidak valid'], $response->getData(true));
    }

    public function test_extract_variables_unsupported_extension()
    {
        $request = Request::create('/extract', 'POST', [
            'document' => 'data:application/msword;base64,dummydata'
        ]);

        $serviceMock = Mockery::mock(DocumentTemplateService::class);

        $response = $this->controller->extractVariables($request, $serviceMock);

        $this->assertEquals(400, $response->getStatusCode());
        $this->assertEquals(['error' => 'Format file tidak didukung untuk ekstraksi variabel, gunakan .docx'], $response->getData(true));
    }
}
