<?php

use App\Http\Controllers\CategoryNumberingController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    
    // Documents
    Route::get('/document-incoming', [DocumentController::class, 'incomingIndex'])->name('documents.incoming.index');
    Route::get('/document-outgoing', [DocumentController::class, 'outgoingIndex'])->name('documents.outgoing.index');
    Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::get('/documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');
    Route::get('/documents/{document}/history/{history}/download', [DocumentController::class, 'downloadHistory'])->name('documents.history.download');
    Route::post('/documents/incoming', [DocumentController::class, 'storeIncoming'])->name('documents.incoming.store');
    Route::post('/documents/{document}/signed', [DocumentController::class, 'uploadSigned'])->name('documents.upload-signed');
    Route::post('/documents/{document}/archive', [DocumentController::class, 'archive'])->name('documents.archive');
    Route::put('/documents/{document}', [DocumentController::class, 'update'])->name('documents.update');
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');

    // Laporan
    Route::middleware(['role:SUPERADMIN|OPERATOR'])->group(function () {
        Route::get('/laporan-arsip', [\App\Http\Controllers\ArchiveReportController::class, 'index'])->name('reports.archive.index');
        Route::get('/laporan-arsip/export', [\App\Http\Controllers\ArchiveReportController::class, 'export'])->name('reports.archive.export');
    });
});

Route::middleware(['auth', 'role:SUPERADMIN'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])->name('users.update-role');
});

Route::middleware(['auth', 'role:SUPERADMIN|OPERATOR'])->group(function () {
    // Templates
    Route::get('/templates', [TemplateController::class, 'index'])->name('templates.index');
    Route::post('/templates', [TemplateController::class, 'store'])->name('templates.store');
    Route::post('/templates/extract-variables', [TemplateController::class, 'extractVariables'])->name('templates.extract-variables');
    Route::post('/templates/{template}', [TemplateController::class, 'update'])->name('templates.update');
    Route::delete('/templates/{template}', [TemplateController::class, 'destroy'])->name('templates.destroy');
    Route::get('/templates/{template}/preview', [TemplateController::class, 'preview'])->name('templates.preview');
    Route::get('/templates/{template}/download', [TemplateController::class, 'download'])->name('templates.download');

    // Kategori Penomoran Surat
    Route::get('/category-numbering', [CategoryNumberingController::class, 'index'])->name('category-numbering.index');
    Route::post('/category-numbering', [CategoryNumberingController::class, 'store'])->name('category-numbering.store');
    Route::put('/category-numbering/{categoryNumbering}', [CategoryNumberingController::class, 'update'])->name('category-numbering.update');
    Route::delete('/category-numbering/{categoryNumbering}', [CategoryNumberingController::class, 'destroy'])->name('category-numbering.destroy');
});

require __DIR__.'/settings.php';