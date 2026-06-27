<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Enums\RoleType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $users = User::with('roles')
            ->where('id', '!=', Auth::id())
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%')
                      ->orWhere('email', 'like', '%' . $search . '%');
            })
            ->paginate(20)
            ->withQueryString();

        $roles = RoleType::cases();

        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => collect($roles)->map(fn($role) => $role->value),
            'filters' => $request->only('search'),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->withErrors(['error' => 'Anda tidak dapat mengubah peran Anda sendiri.']);
        }

        $request->validate([
            'role' => 'required|string|in:' . implode(',', array_column(RoleType::cases(), 'value')),
        ]);

        $user->syncRoles([$request->role]);

        return back()->with('status', 'Peran pengguna berhasil diperbarui.');
    }

    public function updateStatus(Request $request, User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->withErrors(['error' => 'Anda tidak dapat menonaktifkan atau mengubah status Anda sendiri.']);
        }

        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $user->update([
            'is_active' => $request->is_active,
        ]);

        return back()->with('status', 'Status pengguna berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        if ($user->is_active) {
            return back()->withErrors(['error' => 'Pengguna yang aktif tidak dapat dihapus.']);
        }

        $user->delete();

        return back()->with('status', 'Pengguna berhasil dihapus.');
    }
}
