/**
 * Health Insights Generator
 * 
 * Generates dynamic insights/tips based on user's daily health data.
 */

function generateInsights({ sleepHours, waterGlasses, exerciseMinutes, screenTimeHours }) {
  const insights = [];

  // Sleep insights
  if (sleepHours < 6) {
    insights.push({
      category: 'sleep',
      type: 'warning',
      icon: '😴',
      title: 'Waktu Tidur Kurang',
      message: 'Waktu tidur Anda kurang dari rekomendasi. Cobalah tidur lebih awal untuk mendapatkan minimal 7 jam tidur.',
    });
  } else if (sleepHours >= 6 && sleepHours < 7) {
    insights.push({
      category: 'sleep',
      type: 'info',
      icon: '🛏️',
      title: 'Tidur Hampir Cukup',
      message: 'Tidur Anda hampir mencapai rekomendasi ideal. Tambahkan 30-60 menit lagi untuk hasil optimal.',
    });
  } else if (sleepHours >= 7 && sleepHours <= 9) {
    insights.push({
      category: 'sleep',
      type: 'success',
      icon: '✅',
      title: 'Tidur Ideal',
      message: 'Waktu tidur Anda sudah ideal! Pertahankan pola tidur ini.',
    });
  } else if (sleepHours > 10) {
    insights.push({
      category: 'sleep',
      type: 'info',
      icon: '⏰',
      title: 'Tidur Berlebihan',
      message: 'Tidur terlalu lama juga kurang baik. Idealnya 7-9 jam per malam.',
    });
  }

  // Water insights
  if (waterGlasses < 5) {
    insights.push({
      category: 'water',
      type: 'warning',
      icon: '💧',
      title: 'Konsumsi Air Rendah',
      message: 'Konsumsi air putih masih rendah hari ini. Usahakan minum minimal 8 gelas per hari.',
    });
  } else if (waterGlasses >= 5 && waterGlasses < 8) {
    insights.push({
      category: 'water',
      type: 'info',
      icon: '🥤',
      title: 'Air Putih Hampir Cukup',
      message: 'Konsumsi air Anda cukup baik. Tambahkan beberapa gelas lagi untuk mencapai target.',
    });
  } else {
    insights.push({
      category: 'water',
      type: 'success',
      icon: '💦',
      title: 'Hidrasi Sempurna',
      message: 'Konsumsi air putih Anda sudah memenuhi rekomendasi harian. Bagus!',
    });
  }

  // Exercise insights
  if (exerciseMinutes < 10) {
    insights.push({
      category: 'exercise',
      type: 'warning',
      icon: '🏃',
      title: 'Kurang Aktivitas Fisik',
      message: 'Tambahkan aktivitas fisik ringan untuk menjaga kebugaran. Minimal 30 menit per hari.',
    });
  } else if (exerciseMinutes >= 10 && exerciseMinutes < 30) {
    insights.push({
      category: 'exercise',
      type: 'info',
      icon: '💪',
      title: 'Olahraga Perlu Ditingkatkan',
      message: 'Aktivitas fisik Anda sudah dimulai. Tingkatkan hingga 30 menit untuk hasil optimal.',
    });
  } else {
    insights.push({
      category: 'exercise',
      type: 'success',
      icon: '🎯',
      title: 'Olahraga Tercapai',
      message: 'Target olahraga harian Anda tercapai. Pertahankan kebiasaan ini!',
    });
  }

  // Screen time insights
  if (screenTimeHours > 7) {
    insights.push({
      category: 'screenTime',
      type: 'warning',
      icon: '📱',
      title: 'Screen Time Tinggi',
      message: 'Screen time cukup tinggi. Pertimbangkan mengurangi penggunaan perangkat digital dan istirahatkan mata.',
    });
  } else if (screenTimeHours >= 5 && screenTimeHours <= 7) {
    insights.push({
      category: 'screenTime',
      type: 'info',
      icon: '🖥️',
      title: 'Screen Time Sedang',
      message: 'Screen time Anda dalam batas moderat. Usahakan kurangi ke bawah 4 jam jika memungkinkan.',
    });
  } else {
    insights.push({
      category: 'screenTime',
      type: 'success',
      icon: '👀',
      title: 'Screen Time Terkontrol',
      message: 'Screen time Anda terkontrol dengan baik. Kesehatan mata Anda terjaga!',
    });
  }

  return insights;
}

module.exports = { generateInsights };
