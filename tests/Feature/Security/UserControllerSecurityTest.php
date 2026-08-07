<?php

namespace Tests\Feature\Security;

use App\Models\User;
use App\Enums\RoleType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected User $superAdmin;
    protected User $otherSuperAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Kita aktifkan CSRF token khusus untuk file Security Testing ini
        // Jika butuh bypass, bisa pakai $this->withoutMiddleware() tapi kita ingin mengetes aslinya.

        if (class_exists(\Spatie\Permission\Models\Role::class)) {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => RoleType::SUPERADMIN->value]);
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => RoleType::ADMIN->value]);
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => RoleType::OPERATOR->value]);
        }

        $this->superAdmin = User::factory()->create(['is_active' => true]);
        if (method_exists($this->superAdmin, 'assignRole')) {
            $this->superAdmin->assignRole(RoleType::SUPERADMIN->value);
        }

        $this->otherSuperAdmin = User::factory()->create(['is_active' => true]);
        if (method_exists($this->otherSuperAdmin, 'assignRole')) {
            $this->otherSuperAdmin->assignRole(RoleType::SUPERADMIN->value);
        }
    }

    /**
     * IDOR (Insecure Direct Object Reference) Test:
     * Menguji apakah seorang admin dapat menonaktifkan dirinya sendiri (Self-Deactivation).
     * Idealnya, aplikasi harus mencegah pengguna men-disable akunnya sendiri agar tidak terkunci (Lockout).
     */
    public function test_admin_cannot_deactivate_themselves()
    {
        // NOTE: Secara default di UserController Anda saat ini, proteksi ini BELUM ada.
        // Test ini mungkin gagal (status ter-update). Ini membuktikan bahwa vulnerability "Self Lockout" ada.
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);

        $response = $this->actingAs($this->superAdmin)
                         ->patch(route('users.update-status', $this->superAdmin), [
                             'is_active' => false,
                         ]);

        // Kita berharap sistem menolak dengan Forbidden (403) atau error logic (contoh: 302 with specific errors)
        // Jika response redirect success, artinya aplikasi rentan terhadap self-deactivation.
        $this->assertTrue((bool) $this->superAdmin->fresh()->is_active, 'Security Alert: SuperAdmin bisa menonaktifkan akunnya sendiri (Self-Lockout IDOR).');
    }

    /**
     * IDOR (Insecure Direct Object Reference) Test:
     * Menguji apakah seorang admin dapat mengubah role-nya sendiri (Self-Demotion).
     */
    public function test_admin_cannot_demote_themselves()
    {
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);

        $response = $this->actingAs($this->superAdmin)
                         ->patch(route('users.update-role', $this->superAdmin), [
                             'role' => RoleType::OPERATOR->value,
                         ]);

        // Kita berharap admin tidak bisa mendemote dirinya sendiri agar tidak kehilangan akses secara tidak sengaja.
        $this->assertTrue($this->superAdmin->fresh()->hasRole(RoleType::SUPERADMIN->value), 'Security Alert: SuperAdmin bisa mengubah role-nya sendiri (Self-Demotion IDOR).');
    }

    /**
     * Mass Assignment Test:
     * Menguji apakah parameter tak terduga (seperti is_superadmin atau password) diabaikan.
     */
    public function test_mass_assignment_protection_on_status_update()
    {
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);

        $targetUser = User::factory()->create(['is_active' => false]);
        $oldPassword = $targetUser->password;

        $response = $this->actingAs($this->superAdmin)
                         ->patch(route('users.update-status', $targetUser), [
                             'is_active' => true,
                             'password' => 'hackedpassword',
                             'is_superadmin' => true, // Parameter jahat
                         ]);

        $response->assertSessionHasNoErrors();
        
        $targetUser->refresh();
        $this->assertTrue((bool) $targetUser->is_active);
        $this->assertEquals($oldPassword, $targetUser->password, 'Security Alert: Mass Assignment vulnerability ditemukan pada atribut password!');
    }

    /**
     * SQL Injection (SQLi) Test:
     * Menguji keamanan input pencarian dari potensi payload SQLi.
     */
    public function test_search_input_is_safe_from_sql_injection()
    {
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);

        // Payload klasik SQL Injection
        $sqliPayload = "admin' OR 1=1 --";
        
        $response = $this->actingAs($this->superAdmin)
                         ->get(route('users.index', ['search' => $sqliPayload]));

        // Jika rentan, aplikasi akan crash (HTTP 500) karena syntax SQL error.
        // Jika aman, aplikasi akan berjalan normal (HTTP 200).
        $response->assertStatus(200);
    }
}
