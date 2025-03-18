import multer from 'multer';
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const __dirname = path.resolve();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/pdf',
    'text/csv'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Please upload only Excel, PDF, or CSV files', 400), false);
  }
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }
});

export const uploadFile = () => upload.array('files');

const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const processFile = () => async (req, res, next) => {
  const filesDir = path.resolve(__dirname, 'public');
  console.log(filesDir);
  ensureDirectoryExistence(filesDir);
  const fileNamePrefix = 'document';
  if (!req.files) return next();

  req.body.files = [];

  await Promise.all(
    req.files.map(async (file, index) => {
      const ext = path.extname(file.originalname);
      const oneFileName = `${Date.now()}-${fileNamePrefix}-${index + 1}${ext}`;

      fs.writeFileSync(path.join(filesDir, oneFileName), file.buffer);

      req.body.files.push(oneFileName);
    })
  );

  next();
};

export const removeFile = async (filesArray) => {
  const directoryPath = path.resolve(__dirname, '../public/files');
  filesArray.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    console.log(filePath); // Full path to the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting ${filePath}:`, err);
      }
    });
  });
};

export function getDataByHeader(filePath, headerName) {
  const workbook = xlsx.readFile(filePath);
  let dataByHeader = [];

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length > 0) {
      const headers = jsonData[0]; // First row as headers
      const index = headers.indexOf(headerName);

      if (index !== -1) {
        let columnData = jsonData.slice(1).map((row) => row[index]);

        columnData = columnData
          .map((item) => (typeof item === 'string' ? item.trim() : item))
          .map((item) => cleanNumericData(item))
          .filter((item) => item !== undefined && item !== null && item !== '');
        dataByHeader = dataByHeader.concat(columnData); // Merge into the array
      }
    }
  });

  return dataByHeader; // Keeping duplicates as they are
}

function cleanNumericData(value) {
  if (typeof value === 'number') return value; // Already a valid number

  if (typeof value === 'string') {
    value = value.trim();

    // Handle values inside parentheses (e.g., "(500)" → "-500")
    if (value.startsWith('(') && value.endsWith(')')) {
      value = '-' + value.slice(1, -1);
    }

    // Remove non-numeric characters except dots and commas
    value = value.replace(/[^0-9.,-]/g, '');

    // Convert to a proper number
    if (value.includes(',')) {
      const parts = value.split(',');
      if (parts.length === 2 && parts[1].length <= 2) {
        // Case: "1,234.56" (handle comma as thousands separator)
        value = value.replace(/,/g, '');
      } else {
        // Case: "1.234,56" (handle comma as decimal separator)
        value = value.replace('.', '').replace(',', '.');
      }
    }

    const num = parseFloat(value);
    return isNaN(num) ? null : num; // Return null if not a valid number
  }

  return null; // Ignore any non-string and non-number values
}
