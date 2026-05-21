import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola profil dan pengaturan aplikasi</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Halaman ini sedang dalam pengembangan.</p>
        </CardContent>
      </Card>
    </div>
  );
}
