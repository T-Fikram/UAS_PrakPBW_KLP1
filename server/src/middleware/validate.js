/**
 * Input validation middleware for health records
 */

const validateHealthRecord = (req, res, next) => {
  const { sleepHours, waterGlasses, exerciseMinutes, screenTimeHours } = req.body;
  const errors = [];

  // Sleep hours validation
  if (sleepHours === undefined || sleepHours === null) {
    errors.push('Durasi tidur wajib diisi.');
  } else if (typeof sleepHours !== 'number' || sleepHours < 0 || sleepHours > 24) {
    errors.push('Durasi tidur harus antara 0-24 jam.');
  }

  // Water glasses validation
  if (waterGlasses === undefined || waterGlasses === null) {
    errors.push('Konsumsi air putih wajib diisi.');
  } else if (!Number.isInteger(waterGlasses) || waterGlasses < 0 || waterGlasses > 30) {
    errors.push('Konsumsi air putih harus antara 0-30 gelas.');
  }

  // Exercise minutes validation
  if (exerciseMinutes === undefined || exerciseMinutes === null) {
    errors.push('Durasi olahraga wajib diisi.');
  } else if (!Number.isInteger(exerciseMinutes) || exerciseMinutes < 0 || exerciseMinutes > 300) {
    errors.push('Durasi olahraga harus antara 0-300 menit.');
  }

  // Screen time validation
  if (screenTimeHours === undefined || screenTimeHours === null) {
    errors.push('Screen time wajib diisi.');
  } else if (typeof screenTimeHours !== 'number' || screenTimeHours < 0 || screenTimeHours > 24) {
    errors.push('Screen time harus antara 0-24 jam.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Nama harus minimal 2 karakter.');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Format email tidak valid.');
  }

  if (!password || password.length < 6) {
    errors.push('Password harus minimal 6 karakter.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Format email tidak valid.');
  }

  if (!password) {
    errors.push('Password wajib diisi.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateProfileUpdate = (req, res, next) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const errors = [];

  if (name !== undefined && name.trim().length < 2) {
    errors.push('Nama harus minimal 2 karakter.');
  }

  if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Format email tidak valid.');
  }

  if (newPassword) {
    if (!currentPassword) {
      errors.push('Password saat ini wajib diisi untuk mengubah password.');
    }
    if (newPassword.length < 6) {
      errors.push('Password baru harus minimal 6 karakter.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

module.exports = { validateHealthRecord, validateRegister, validateLogin, validateProfileUpdate };

