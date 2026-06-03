
function getPremi(kategori, gender, usia, plan) {
  return premiIndex?.[kategori]?.[gender]?.[usia]?.[plan] ?? 0;
}
