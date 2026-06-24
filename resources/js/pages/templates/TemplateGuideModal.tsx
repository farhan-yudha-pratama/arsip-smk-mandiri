import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function TemplateGuideModal({ isOpen, onClose }: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Panduan Variabel Template</DialogTitle>
                    <DialogDescription>
                        Berikut adalah penjelasan tentang berbagai jenis variabel yang dapat Anda gunakan di dalam template Word (.docx).
                        Sistem mendeteksi variabel yang diapit oleh <Badge variant="outline">{'{{...}}'}</Badge> atau <Badge variant="outline">{'${...}'}</Badge>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Variabel Umum */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-primary border-b pb-2">1. Variabel Spesial / Otomatis</h3>
                        <p className="text-sm text-muted-foreground">
                            Variabel ini akan diisi secara otomatis oleh sistem, Anda tidak perlu mengisi secara manual.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-muted/30 p-3 rounded-lg border">
                                <Badge className="mb-2">{'{{nomor-surat}}'}</Badge>
                                <p className="text-sm">Otomatis diisi dengan nomor surat berdasarkan kategori dokumen yang dipilih.</p>
                            </div>
                        </div>
                    </div>

                    {/* Variabel Tabel Dinamis */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-primary border-b pb-2">2. Variabel Tabel Dinamis (Awalan T_)</h3>
                        <p className="text-sm text-muted-foreground">
                            Semua variabel yang berawalan <strong>T_</strong> akan dibuat sebagai kolom tabel dinamis. Baris tabel akan diduplikasi secara otomatis sesuai jumlah data yang dimasukkan.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>
                                <strong>Data Siswa:</strong> Gunakan variabel <Badge variant="outline">{'{{T_nama-siswa}}'}</Badge> atau <Badge variant="outline">{'{{T_nama-murid}}'}</Badge>. Kolom tambahan seperti <Badge variant="outline">{'{{T_nis}}'}</Badge>, <Badge variant="outline">{'{{T_kelas}}'}</Badge>, dan <Badge variant="outline">{'{{T_jurusan}}'}</Badge> akan otomatis terisi ketika Anda memilih Siswa.
                            </li>
                            <li>
                                <strong>Data Guru:</strong> Gunakan variabel <Badge variant="outline">{'{{T_nama-guru}}'}</Badge>. Kolom tambahan <Badge variant="outline">{'{{T_nip}}'}</Badge> akan otomatis terisi saat Guru dipilih.
                            </li>
                            <li>
                                <strong>Nomor Urut Otomatis:</strong> Selalu sertakan variabel <Badge variant="outline">{'{{T_no}}'}</Badge> untuk membuat nomor urut secara otomatis.
                            </li>
                        </ul>
                    </div>

                    {/* Variabel Tanggal dan Waktu */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-primary border-b pb-2">3. Variabel Tanggal dan Waktu Khusus</h3>
                        <p className="text-sm text-muted-foreground">
                            Jika Anda menyertakan kata kunci tertentu pada variabel, form input akan otomatis menyesuaikan diri (contoh: memunculkan kalender). Kata kunci ini berlaku baik untuk variabel biasa maupun variabel tabel (T_).
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            {/* Tanggal Biasa */}
                            <div className="space-y-2 bg-muted/20 p-4 rounded-xl border">
                                <div>
                                    <Badge>tanggal</Badge> atau <Badge>T_jadwal_date</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Memunculkan pemilih kalender tunggal.</p>
                                <div className="mt-2">
                                    <Label className="text-xs mb-1 block">Contoh Tampilan Form</Label>
                                    <Input type="date" className="w-full" />
                                </div>
                            </div>

                            {/* Waktu Biasa */}
                            <div className="space-y-2 bg-muted/20 p-4 rounded-xl border">
                                <div>
                                    <Badge>waktu</Badge> atau <Badge>T_jadwal_waktu</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Memunculkan pemilih waktu (jam) tunggal.</p>
                                <div className="mt-2">
                                    <Label className="text-xs mb-1 block">Contoh Tampilan Form</Label>
                                    <Input type="time" className="w-full" />
                                </div>
                            </div>

                            {/* Rentang Tanggal */}
                            <div className="space-y-2 bg-muted/20 p-4 rounded-xl border">
                                <div>
                                    <Badge>T_jadwal_start_end_date</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Memunculkan dua kalender (Tanggal Mulai & Selesai).</p>
                                <div className="mt-2">
                                    <Label className="text-xs mb-1 block">Contoh Tampilan Form</Label>
                                    <div className="flex gap-2">
                                        <Input type="date" className="w-full" />
                                        <span className="self-center">-</span>
                                        <Input type="date" className="w-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Rentang Waktu */}
                            <div className="space-y-2 bg-muted/20 p-4 rounded-xl border">
                                <div>
                                    <Badge>T_jadwal_start_end_waktu</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Memunculkan dua input waktu (Jam Mulai & Selesai).</p>
                                <div className="mt-2">
                                    <Label className="text-xs mb-1 block">Contoh Tampilan Form</Label>
                                    <div className="flex gap-2">
                                        <Input type="time" className="w-full" />
                                        <span className="self-center">-</span>
                                        <Input type="time" className="w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Variabel Lain */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-primary border-b pb-2">4. Variabel Pilihan Khusus</h3>
                        <div className="bg-muted/30 p-3 rounded-lg border">
                            <Badge className="mb-2">kepala-sekolah</Badge>
                            <p className="text-sm">
                                Jika variabel mengandung kata <strong>kepala-sekolah</strong> atau <strong>kepala_sekolah</strong> (contoh: <Badge variant="outline">{'{{kepala-sekolah}}'}</Badge>), form akan otomatis menjadi dropdown yang menampilkan daftar user Kepala Sekolah.
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
