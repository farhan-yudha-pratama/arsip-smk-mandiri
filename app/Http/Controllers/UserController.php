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
        $request->validate([
            'role' => 'required|string|in:' . implode(',', array_column(RoleType::cases(), 'value')),
        ]);

        $user->syncRoles([$request->role]);

        return back()->with('status', 'Peran pengguna berhasil diperbarui.');
    }
}
