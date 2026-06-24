<?php

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use App\Http\Controllers\Settings\StudentSyncController;
use App\Http\Controllers\Settings\TeacherSyncController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
    Route::inertia('settings/get-student', 'settings/get-student')->name('get-student.index');
    Route::post('settings/get-student', [StudentSyncController::class, 'store'])->name('get-student.store');

    Route::inertia('settings/get-teacher', 'settings/get-teacher')->name('get-teacher.index');
    Route::post('settings/get-teacher', [TeacherSyncController::class, 'store'])->name('get-teacher.store');

    Route::get('settings/document-counter', [\App\Http\Controllers\Settings\DocumentCounterController::class, 'index'])->name('document-counter.index');
    Route::post('settings/document-counter', [\App\Http\Controllers\Settings\DocumentCounterController::class, 'update'])->name('document-counter.update');
});
