const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Konfigurasi client
const s3Client = new S3Client({
  region: "auto",
  endpoint: "https://f7be8a3a3819acc1a14003bcb18e80bf.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "983f7e904467a2d56eb8ae16b7c68bc5",
    secretAccessKey: "26727d0e9997afe48122611d59b7ec158d9295052b1ed11cae30f0ea4450ab96"
  }
});

// Upload file ke R2
exports.uploadFile = async (req, res) => {
  const params = {
      Bucket: "edukasiin",
      Key: req.body.fileName,
      Body: req.file.buffer, // Menggunakan buffer dari file yang diupload
      ContentType: req.body.contentType
    };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    console.log("File uploaded successfully:", data);
    return res.status(200).json(data);
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
}