export function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11
  
  // Jika bulan Juli sampai Desember, tahun ajaran adalah tahun ini / tahun depan
  // Jika bulan Januari sampai Juni, tahun ajaran adalah tahun lalu / tahun ini
  if (month >= 6) { 
    return `${year}/${year + 1}`;
  } else { 
    return `${year - 1}/${year}`;
  }
}
