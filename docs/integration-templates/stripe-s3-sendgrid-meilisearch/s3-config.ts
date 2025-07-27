// S3 File Storage Configuration for medusa-config.ts

const s3Config = {
  resolve: "@medusajs/file-s3",
  options: {
    access_key_id: process.env.S3_ACCESS_KEY_ID,
    secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
    endpoint: process.env.S3_ENDPOINT, // Optional for S3-compatible services like DigitalOcean Spaces
    // Additional options
    prefix: "medusa", // Prefix for all uploaded files
    acl: "public-read", // Make files publicly accessible
    cache_control: "max-age=31536000", // 1 year cache
    // Transform options
    transformations: [
      {
        name: "thumbnail",
        width: 150,
        height: 150,
        fit: "cover",
      },
      {
        name: "medium",
        width: 500,
        height: 500,
        fit: "inside",
      },
      {
        name: "large",
        width: 1200,
        height: 1200,
        fit: "inside",
      },
    ],
  }
}

// S3 CORS Configuration (apply in AWS Console or via CLI)
export const s3CorsConfig = {
  CORSRules: [
    {
      AllowedHeaders: ["*"],
      AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      AllowedOrigins: [
        "http://localhost:8000", // Storefront
        "http://localhost:9000", // Admin
        "https://your-production-domain.com",
      ],
      ExposeHeaders: ["ETag"],
      MaxAgeSeconds: 3000,
    },
  ],
}

// S3 Bucket Policy for public read access
export const s3BucketPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Sid: "PublicReadGetObject",
      Effect: "Allow",
      Principal: "*",
      Action: ["s3:GetObject"],
      Resource: [`arn:aws:s3:::${process.env.S3_BUCKET}/medusa/*`],
    },
  ],
}

// Add to medusa-config.ts modules array
export default s3Config