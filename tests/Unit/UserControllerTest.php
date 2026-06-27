<?php

namespace Tests\Unit;

use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\RedirectResponse;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test the destroy method directly (Unit Test approach).
     * We don't hit the route, we just instantiate the controller and call the method.
     */
    public function test_destroy_returns_error_when_user_is_active()
    {
        // Arrange
        $controller = new UserController();
        $user = new User();
        $user->is_active = true;

        // Act
        $response = $controller->destroy($user);

        // Assert
        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertTrue(session()->has('errors'));
        $this->assertEquals('Pengguna yang aktif tidak dapat dihapus.', session('errors')->first('error'));
    }

    /**
     * Test the destroy method directly for an inactive user.
     */
    public function test_destroy_deletes_when_user_is_inactive()
    {
        // Arrange
        $controller = new UserController();
        
        // We use a real model here because we are using RefreshDatabase
        // Mocking Eloquent models is notoriously difficult in Laravel and usually avoided,
        // so we use a real DB hit even for this "Unit" test, or we could just mock the delete method.
        $user = \Mockery::mock(User::class)->makePartial();
        $user->is_active = false;
        
        // Expect delete to be called once
        $user->shouldReceive('delete')->once()->andReturn(true);

        // Act
        $response = $controller->destroy($user);

        // Assert
        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals('Pengguna berhasil dihapus.', session('status'));
    }
}
