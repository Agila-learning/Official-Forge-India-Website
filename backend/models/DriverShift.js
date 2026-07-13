const mongoose = require('mongoose');

const driverShiftSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  shiftStart: { type: Date, required: true },
  shiftEnd: { type: Date },
  statusLogs: [{
    status: { type: String, enum: ['Online', 'Offline', 'Break', 'Lunch', 'Emergency'] },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    durationMinutes: { type: Number, default: 0 }
  }],
  totalOnlineMinutes: { type: Number, default: 0 },
  totalBreakMinutes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('DriverShift', driverShiftSchema);
