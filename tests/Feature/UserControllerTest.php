<?php

namespace Tests\Feature;

use App\Models\User;
use App\Enums\RoleType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $superAdmin;
    protected User $operator;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);

        // Create roles if they don't exist in setup or just assign string if it's spatie string-based
        // Assuming Spatie Permission is used and roles need to exist
        // If not using Spatie, syncRoles might just be a custom method.
        // We will just assign the role to the superadmin.
        
        $this->superAdmin = User::factory()->create(['is_active' => true]);
        // Assign SUPERADMIN role to superAdmin
        if (method_exists($this->superAdmin, 'assignRole')) {
            // Need to make sure the role exists, but we can just mock or use without assigning if it's auto-created.
            // Let's assume the role is created via some seeder, or we can just bypass if it's just a trait.
            // We'll create the role first if it's a model
            if (class_exists(\Spatie\Permission\Models\Role::class)) {
                \Spatie\Permission\Models\Role::firstOrCreate(['name' => RoleType::SUPERADMIN->value]);
                \Spatie\Permission\Models\Role::firstOrCreate(['name' => RoleType::ADMIN->value]);
                \Spatie\Permission\Models\Role::firstOrCreate(['name' => RoleType::OPERATOR->value]);
            }
            $this->superAdmin->assignRole(RoleType::SUPERADMIN->value);
        }

        $this->operator = User::factory()->create(['is_active' => true]);
        if (method_exists($this->operator, 'assignRole')) {
            $this->operator->assignRole(RoleType::OPERATOR->value);
        }
    }

    public function test_non_superadmin_cannot_access_user_routes()
    {
        $response = $this->actingAs($this->operator)->get(route('users.index'));
        $response->assertStatus(403);
    }

    public function test_index_displays_users()
    {
        User::factory()->count(3)->create();

        $response = $this->actingAs($this->superAdmin)->get(route('users.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users.data', 4) // 3 newly created + 1 operator (superadmin is excluded)
            ->has('roles')
        );
    }

    public function test_index_applies_search_filter()
    {
        $targetUser = User::factory()->create([
            'name' => 'Target User Name',
            'email' => 'target@example.com'
        ]);
        User::factory()->create(['name' => 'Other User']);

        $response = $this->actingAs($this->superAdmin)
                         ->get(route('users.index', ['search' => 'Target']));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Target User Name')
        );
    }

    public function test_update_role_updates_user_role()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->superAdmin)
                         ->patch(route('users.update-role', $user), [
                             'role' => RoleType::ADMIN->value,
                         ]);

        $response->assertRedirect();
        $response->assertSessionHas('status', 'Peran pengguna berhasil diperbarui.');
        
        $this->assertTrue($user->fresh()->hasRole(RoleType::ADMIN->value));
    }

    public function test_update_role_validates_role()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->superAdmin)
                         ->patch(route('users.update-role', $user), [
                             'role' => 'INVALID_ROLE',
                         ]);

        $response->assertSessionHasErrors('role');
    }

    public function test_update_status_updates_user_status()
    {
        $user = User::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->superAdmin)
                         ->patch(route('users.update-status', $user), [
                             'is_active' => 1,
                         ]);

        $response->assertRedirect();
        $response->assertSessionHas('status', 'Status pengguna berhasil diperbarui.');
        $this->assertTrue((bool) $user->fresh()->is_active);
    }

    public function test_update_status_validates_boolean()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->superAdmin)
                         ->patch(route('users.update-status', $user), [
                             'is_active' => 'not-boolean',
                         ]);

        $response->assertSessionHasErrors('is_active');
    }

    public function test_destroy_fails_for_active_user()
    {
        $activeUser = User::factory()->create(['is_active' => true]);

        $response = $this->actingAs($this->superAdmin)
                         ->delete(route('users.destroy', $activeUser));

        $response->assertRedirect();
        $response->assertSessionHasErrors(['error' => 'Pengguna yang aktif tidak dapat dihapus.']);
        $this->assertDatabaseHas('users', ['id' => $activeUser->id]);
    }

    public function test_destroy_deletes_inactive_user()
    {
        $inactiveUser = User::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->superAdmin)
                         ->delete(route('users.destroy', $inactiveUser));

        $response->assertRedirect();
        $response->assertSessionHas('status', 'Pengguna berhasil dihapus.');
        $this->assertDatabaseMissing('users', ['id' => $inactiveUser->id]);
    }
}
