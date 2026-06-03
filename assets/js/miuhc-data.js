
const premiIndex = {};

async function loadPremiData() {
  return new Promise((resolve, reject) => {
    Papa.parse("assets/data/miuhc.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete(results) {
        results.data.forEach(row => {
          premiIndex[row.kategori] ??= {};
          premiIndex[row.kategori][row.gender] ??= {};
          premiIndex[row.kategori][row.gender][row.usia] ??= {};
          premiIndex[row.kategori][row.gender][row.usia][row.plan] = Number(row.premi);
        });
        resolve();
      },
      error: reject
    });
  });
}
