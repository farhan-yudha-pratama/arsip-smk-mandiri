<?php

namespace App\Http\Controllers;

use App\Models\CategoryNumbering;
use App\Services\DocumentNumberingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

/**
 * CategoryNumberingController
 *
 * Mengelola CRUD untuk jenis/kategori surat beserta format nomor suratnya.
 */
class CategoryNumberingController extends Controller
{
    public function __construct(
        protected DocumentNumberingService $numberingService
    ) {}

    /**
     * Tampilkan daftar semua kategori surat.
     */
    public function index()
    {
        $categories = CategoryNumbering::orderBy('letter_code')
            ->withCount('sequences')
            ->get();

        return Inertia::render('category-numbering/index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Simpan kategori surat baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name_numbering_document' => 'required|string|max:255',
            'letter_code'             => 'required|string|max:10|unique:category_numbering,letter_code',
            'abbreviation'            => 'required|string|max:20',
            'description'             => 'nullable|string|max:500',
            'format_pattern'          => 'required|string|max:255',
        ], [
            'letter_code.unique' => "Kode surat '{$request->letter_code}' sudah digunakan. Gunakan kode yang berbeda.",
        ]);

        try {
            $category = CategoryNumbering::create($request->only([
                'name_numbering_document',
                'letter_code',
                'abbreviation',
                'description',
                'format_pattern',
            ]));

            Log::info('CategoryNumberingController@store: Kategori surat baru dibuat', [
                'id'          => $category->id,
                'letter_code' => $category->letter_code,
            ]);

            return back()->with('success', "Kategori surat '{$category->name_numbering_document}' berhasil ditambahkan!");
        } catch (\Exception $e) {
            Log::error('CategoryNumberingController@store gagal', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Gagal menambahkan kategori surat: ' . $e->getMessage()]);
        }
    }

    /**
     * Perbarui data kategori surat yang sudah ada.
     */
    public function update(Request $request, CategoryNumbering $categoryNumbering)
    {
        $request->validate([
            'name_numbering_document' => 'required|string|max:255',
            'letter_code'             => "required|string|max:10|unique:category_numbering,letter_code,{$categoryNumbering->id}",
            'abbreviation'            => 'required|string|max:20',
            'description'             => 'nullable|string|max:500',
            'format_pattern'          => 'required|string|max:255',
        ], [
            'letter_code.unique' => "Kode surat '{$request->letter_code}' sudah digunakan oleh kategori lain.",
        ]);

        try {
            $categoryNumbering->update($request->only([
                'name_numbering_document',
                'letter_code',
                'abbreviation',
                'description',
                'format_pattern',
            ]));

            Log::info('CategoryNumberingController@update: Kategori surat diperbarui', [
                'id'          => $categoryNumbering->id,
                'letter_code' => $categoryNumbering->letter_code,
            ]);

            return back()->with('success', "Kategori surat '{$categoryNumbering->name_numbering_document}' berhasil diperbarui!");
        } catch (\Exception $e) {
            Log::error('CategoryNumberingController@update gagal', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Gagal memperbarui kategori surat: ' . $e->getMessage()]);
        }
    }

    /**
     * Hapus kategori surat dari database.
     *
     * Kategori yang sudah memiliki riwayat penomoran tidak dapat dihapus
     * untuk menjaga integritas data historis.
     */
    public function destroy(CategoryNumbering $categoryNumbering)
    {
        try {
            return DB::transaction(function () use ($categoryNumbering) {
                // Cegah penghapusan jika sudah ada nomor surat yang menggunakan kategori ini
                if ($categoryNumbering->sequences()->exists()) {
                    return back()->withErrors([
                        'error' => "Kategori '{$categoryNumbering->name_numbering_document}' tidak dapat dihapus " .
                                   'karena sudah memiliki riwayat penomoran surat.',
                    ]);
                }

                $namaKategori = $categoryNumbering->name_numbering_document;
                $categoryNumbering->delete();

                Log::info('CategoryNumberingController@destroy: Kategori surat dihapus', [
                    'nama' => $namaKategori,
                ]);

                return back()->with('success', "Kategori surat '{$namaKategori}' berhasil dihapus!");
            });
        } catch (\Exception $e) {
            Log::error('CategoryNumberingController@destroy gagal', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Gagal menghapus kategori surat: ' . $e->getMessage()]);
        }
    }
}
